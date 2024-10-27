import {mutation} from "./_generated/server";

import {v} from "convex/values";

export const registerPatient = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    middleName: v.optional(v.string()),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female"), v.literal("Other")),
    phoneNumber: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  async handler(ctx, values) {
    const {email, firstName, middleName,lastName, dateOfBirth, gender, phoneNumber, address} = values;
    const userRecord = await ctx.db
      .query("patients")
      .withIndex("by_phoneNumber", (q) => q.eq("phoneNumber", phoneNumber))
      .unique();

    const lastCreatedPatient = await ctx.db.query("patients").order("desc").first();
    const patientId = lastCreatedPatient ? lastCreatedPatient.patientId + 1 : 1;

    if (userRecord === null) {
      await ctx.db.insert("patients", {
        patientId,
        email,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        phoneNumber,
        address,
      });
    }
  },
});
