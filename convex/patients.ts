import { mutation,query} from "./_generated/server";
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
    houseNo: v.optional(v.string()),
    gramPanchayat: v.optional(v.string()),
    village: v.optional(v.string()),
    tehsil: v.optional(v.string()),
    district: v.optional(v.string()),
    state: v.optional(v.string()),
    systolic: v.optional(v.string()),
    diastolic: v.optional(v.string()),
    heartRate: v.optional(v.string()),
    temperature: v.optional(v.string()),
    oxygenSaturation: v.optional(v.string()),
    doctorId:v.optional(v.string()), // New field to store the ID of the doctor who registered the patient
  },
  async handler(ctx, args) {
    // Generate a unique ID for the patient
    const patientId = Date.now();

    // Check if a patient with the given phone number already exists
    const existingPatient = await ctx.db
      .query("patients")
      .withIndex("by_phoneNumber", (q) => q.eq("phoneNumber", args.phoneNumber))
      .unique();

    if (existingPatient) {
      throw new Error("A patient with this phone number already exists.");
    }

    // Insert new patient record into the database
    await ctx.db.insert("patients", {
      patientId,
      ...args,
    });

    return { success: true, patientId };
  },
  
});



export const getAppointmentsByDoctor = query({
  args: { doctorId: v.string() },
  handler: async (ctx, args) => {
    const appointments = await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("doctorId"), args.doctorId))
      .collect();
    return appointments;
  },
});

export const getPatientById = query({
  args: {
    patientId: v.number(),
  },
  handler: async (ctx, { patientId }) => {
    const patient = await ctx.db
      .query("patients")
      .withIndex("by_patient_id", (q) => q.eq("patientId", patientId))
      .unique();

    if (!patient) {
      throw new Error("Patient not found.");
    }

    return {
      id: patient._id,
      email: patient.email,
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phoneNumber: patient.phoneNumber,
      houseNo: patient.houseNo,
      gramPanchayat: patient.gramPanchayat,
      village: patient.village,
      tehsil: patient.tehsil,
      district: patient.district,
      state: patient.state,
      systolic: patient.systolic,
      diastolic: patient.diastolic,
      heartRate: patient.heartRate,
      temperature: patient.temperature,
      oxygenSaturation: patient.oxygenSaturation,
    };
  },
});
