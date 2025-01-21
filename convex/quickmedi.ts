import { v } from "convex/values";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getDoctorDetails = query({
  args: { userIds: v.array(v.string()) },
  handler: async (ctx, { userIds }) => {
    if (!userIds || userIds.length <= 0) return [];
    console.log(userIds);
    const users = await Promise.all(
      userIds.map((userId) =>
        ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
          .unique()
      )
    );

    const usersWithUrl = await Promise.all(
      users
        .filter((user): user is Doc<"users"> => user !== null)
        .map(async (user) => ({
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          url: user.profileImageUrl
            ? await ctx.storage.getUrl(user.profileImageUrl as Id<"_storage">)
            : undefined,
          specialization: user.specialization ?? "General Physician",
        }))
    );

    return usersWithUrl;
  },
});

export const getAllDoctors = query({
  handler: async (ctx) => {
    const doctors = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "Doctor"))
      .collect();
    const doctorsWithImageUrl = await Promise.all(
      doctors.map(async (doctor) => {
        return {
          ...doctor,
          imageUrl: doctor.profileImageUrl
            ? await ctx.storage.getUrl(doctor.profileImageUrl as Id<"_storage">)
            : undefined,
        };
      })
    );

    return doctorsWithImageUrl;
  },
});
