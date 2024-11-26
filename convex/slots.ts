import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createSlot = mutation({
    args: {
      doctorId: v.string(),
      startTime: v.number(),
      endTime: v.number(),
    },
    handler: async (ctx, args) => {
  
      const slotId = await ctx.db.insert("slots", {
        doctorId: args.doctorId,
        startTime: args.startTime,
        endTime: args.endTime,
        isBooked: false,
      });
      return slotId;
    },
  });

  export const createBulkSlots = mutation({
    args: {
      doctorId: v.string(),
      startDate: v.string(), // Format: "YYYY-MM-DD"
      endDate: v.string(), // Format: "YYYY-MM-DD"
      dailyStartTime: v.string(), // Format: "HH:mm"
      dailyEndTime: v.string(), // Format: "HH:mm"
      slotDuration: v.number(), // Duration in minutes
      breakStartTime: v.optional(v.string()), // Format: "HH:mm"
      breakEndTime: v.optional(v.string()), // Format: "HH:mm"
      includeWeekends: v.boolean(),
    },
    handler: async (ctx, args) => {
      const slotIds = [];
      const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  
      const startDate = new Date(args.startDate);
      const endDate = new Date(args.endDate);
  
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        // Skip weekends if not included
        if (!args.includeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
          continue;
        }
  
        const [startHour, startMinute] = args.dailyStartTime.split(':').map(Number);
        const [endHour, endMinute] = args.dailyEndTime.split(':').map(Number);
  
        let currentTime = new Date(date);
        currentTime.setHours(startHour, startMinute, 0, 0);
        const dailyEndTime = new Date(date);
        dailyEndTime.setHours(endHour, endMinute, 0, 0);
  
        let breakStartTime, breakEndTime;
        if (args.breakStartTime && args.breakEndTime) {
          const [breakStartHour, breakStartMinute] = args.breakStartTime.split(':').map(Number);
          const [breakEndHour, breakEndMinute] = args.breakEndTime.split(':').map(Number);
          breakStartTime = new Date(date);
          breakStartTime.setHours(breakStartHour, breakStartMinute, 0, 0);
          breakEndTime = new Date(date);
          breakEndTime.setHours(breakEndHour, breakEndMinute, 0, 0);
        }
  
        while (currentTime < dailyEndTime) {
          // Skip break time
          if (breakStartTime && breakEndTime && currentTime >= breakStartTime && currentTime < breakEndTime) {
            currentTime = new Date(breakEndTime);
            continue;
          }
  
          const startTime = currentTime.getTime() + istOffset;
          const endTime = startTime + args.slotDuration * 60 * 1000;
  
          // Ensure the slot doesn't extend past the daily end time
          if (endTime <= dailyEndTime.getTime() + istOffset) {
            const slot = {
              doctorId: args.doctorId,
              startTime,
              endTime,
              isBooked: false
            };
  
            const slotId = await ctx.db.insert("slots", slot);
            slotIds.push(slotId);
          }
  
          currentTime.setTime(currentTime.getTime() + args.slotDuration * 60 * 1000);
        }
      }
  
      return slotIds;
    },
  });
  
  