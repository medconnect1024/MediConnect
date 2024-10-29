import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    date: v.string(),
    notes: v.string(),
    fileUrl: v.string(),
    fileType: v.union(v.literal("pdf"), v.literal("image")),
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("labReports", args);
    return newId;
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("labReports").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("labReports") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});