import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const registerPatient = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    middleName: v.optional(v.string()),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female"), v.literal("Other")),
    phoneNumber: v.string(),
    houseNo:v.optional(v.string()),
    gramPanchayat:v.optional(v.string()),
    village: v.optional(v.string()),
    tehsil: v.optional(v.string()),
    district:v.optional(v.string()),
    state:v.optional(v.string()),
    systolic:v.optional(v.string()),
    diastolic: v.optional(v.string()),
    heartRate: v.optional(v.string()),
    temperature:v.optional(v.string()),
    oxygenSaturation: v.optional(v.string()),
  },
  async handler(ctx, values) {
    const {
      email,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      houseNo,
      gramPanchayat,
      village,
      tehsil,
      district,
      state,
      systolic,
      diastolic,
      heartRate,
      temperature,
      oxygenSaturation
    } = values;

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
        houseNo,
        gramPanchayat,
        village,
        tehsil,
        district,
        state,
        systolic,
        diastolic,
        heartRate,
        temperature,
        oxygenSaturation
      });
    }
  },
});
