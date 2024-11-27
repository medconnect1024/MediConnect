import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to convert IST to UTC
function istToUtc(date: string, time: string): number {
  try {
    // Parse the date and time inputs
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // Validate the parsed inputs
    if (
      isNaN(year) || isNaN(month) || isNaN(day) ||
      isNaN(hours) || isNaN(minutes) ||
      month < 1 || month > 12 || day < 1 || day > 31 ||
      hours < 0 || hours > 23 || minutes < 0 || minutes > 59
    ) {
      throw new Error("Invalid date or time format");
    }

    // Create IST date object
    const istDate = new Date(year, month - 1, day, hours, minutes);

    // Convert IST to UTC timestamp
    return istDate.getTime() - 5.5 * 60 * 60 * 1000;
  } catch (error) {
    console.error("Error converting IST to UTC:", error instanceof Error ? error.message : "Unknown error");
    throw new Error("Invalid date or time provided");
  }
}

// Helper function to convert UTC to IST string
function utcToIstString(utcTimestamp: number): string {
  try {
    // Validate the UTC timestamp
    if (isNaN(utcTimestamp) || utcTimestamp <= 0) {
      throw new Error("Invalid UTC timestamp provided.");
    }

    // Convert to IST
    const istDate = new Date(utcTimestamp + 5.5 * 60 * 60 * 1000);

    // Format the date using Intl.DateTimeFormat
    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false, // Use 24-hour format
    });
  } catch (error) {
    console.error("Error converting UTC to IST:", error instanceof Error ? error.message : "Unknown error");
    throw new Error("Invalid UTC timestamp provided");
  }
}

// Mutation to create a single slot
export const createSlot = mutation({
  args: {
    doctorId: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const startTime = istToUtc(args.date, args.startTime);
    const endTime = istToUtc(args.date, args.endTime);

    const slotId = await ctx.db.insert("slots", {
      doctorId: args.doctorId,
      startTime,
      endTime,
      isBooked: false,
    });
    return slotId;
  },
});

// Mutation to create bulk slots
export const createBulkSlots = mutation({
  args: {
    doctorId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    dailyStartTime: v.string(),
    dailyEndTime: v.string(),
    slotDuration: v.number(),
    breakStartTime: v.optional(v.string()),
    breakEndTime: v.optional(v.string()),
    includeWeekends: v.boolean(),
  },
  handler: async (ctx, args) => {
    const slotIds: any[] | PromiseLike<any[]> = [];
    const startDate = new Date(args.startDate);
    const endDate = new Date(args.endDate);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      if (!args.includeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }

      const dateString = date.toISOString().split('T')[0];
      const dailyStartTimeUtc = istToUtc(dateString, args.dailyStartTime);
      const dailyEndTimeUtc = istToUtc(dateString, args.dailyEndTime);
      let currentTimeUtc = dailyStartTimeUtc;

      let breakStartTimeUtc, breakEndTimeUtc;
      if (args.breakStartTime && args.breakEndTime) {
        breakStartTimeUtc = istToUtc(dateString, args.breakStartTime);
        breakEndTimeUtc = istToUtc(dateString, args.breakEndTime);
      }

      while (currentTimeUtc + args.slotDuration * 60 * 1000 <= dailyEndTimeUtc) {
        if (
          breakStartTimeUtc &&
          breakEndTimeUtc &&
          currentTimeUtc >= breakStartTimeUtc &&
          currentTimeUtc < breakEndTimeUtc
        ) {
          currentTimeUtc = breakEndTimeUtc;
          continue;
        }

        const slot = {
          doctorId: args.doctorId,
          startTime: currentTimeUtc,
          endTime: currentTimeUtc + args.slotDuration * 60 * 1000,
          isBooked: false,
        };

        const slotId = await ctx.db.insert("slots", slot);
        slotIds.push(slotId);

        currentTimeUtc += args.slotDuration * 60 * 1000;
      }
    }

    return slotIds;
  },
});

export const getAvailableSlots = query({
  args: {
    doctorId: v.string(),
    date: v.string(), // Receive the date as string in local time (IST)
  },
  handler: async (ctx, args) => {
    console.log("Received doctorId:", args.doctorId);
    console.log("Received date:", args.date);
    // Convert the local date to UTC
    const localDate = new Date(args.date);  // The date comes in as local time (IST)
    const startOfDayUtc = new Date(localDate.setHours(0, 0, 0, 0)).getTime(); // Convert start of day to UTC
    const endOfDayUtc = new Date(localDate.setHours(23, 59, 59, 999)).getTime(); // Convert end of day to UTC

    const slots = await ctx.db
      .query("slots")
      .filter((q) => q.eq(q.field("doctorId"), args.doctorId))
      .filter((q) => q.gte(q.field("startTime"), startOfDayUtc))
      .filter((q) => q.lte(q.field("endTime"), endOfDayUtc))
      .filter((q) => q.eq(q.field("isBooked"), false))
      .collect();

    // Map the UTC time back to IST for frontend
    return slots.map((slot) => ({
      id: slot._id,
      startTime: utcToIstString(slot.startTime),
      endTime: utcToIstString(slot.endTime),
    }));
  },
});
