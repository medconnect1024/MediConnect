import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addIoTData = mutation({
  args: {
    machineId: v.string(),
    temperature: v.number(),
    rating: v.number(),
    canisterLevel: v.number(),
  },
  handler: async (ctx, args) => {
    const { machineId, temperature, rating, canisterLevel } = args;
    const timestamp = new Date().toISOString();

    const iotDataId = await ctx.db.insert("iot_data", {
      machineId,
      timestamp,
      temperature,
      rating,
      canisterLevel,
    });

    // Update the machine's data in the machines table
    const machine = await ctx.db
      .query("machines")
      .filter((q) => q.eq(q.field("id"), machineId))
      .first();

    if (machine) {
      await ctx.db.patch(machine._id, { 
        temperature,
        rating,
        canisterLevel,
      });
    }

    return { id: iotDataId, timestamp };
  },
});

export const getLatestIoTData = query({
  args: { machineId: v.string() },
  handler: async (ctx, args) => {
    const latestData = await ctx.db
      .query("iot_data")
      .filter((q) => q.eq(q.field("machineId"), args.machineId))
      .order("desc")
      .first();

    return latestData;
  },
});

