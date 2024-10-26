import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("Doctor"), v.literal("Patient"))),
  })
    .index("by_clerk_id", ["userId"])
    .index("by_email", ["email"]),
  
  patients: defineTable({
    patientId: v.number(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female"), v.literal("Other")),
    phoneNumber: v.optional(v.string()),
    address: v.optional(v.string()),
  })
    .index("by_patient_id", ["patientId"])
    .index("by_email", ["email"])
    .index("by_phoneNumber", ["phoneNumber"]),
  
  appointments: defineTable({
    appointmentId: v.string(),
    doctorId: v.string(),
    patientId: v.string(),
    appointmentDate: v.string(),
    reasonForVisit: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("Scheduled"), v.literal("Completed"), v.literal("Cancelled"))
    ),
    prescriptionId: v.optional(v.string()),
  })
    .index("by_doctor_id", ["doctorId"])
    .index("by_patient_id", ["patientId"]),
  
    prescriptions: defineTable({
      prescriptionId: v.string(),
      doctorId: v.string(),
      patientId: v.string(),
      medicines: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          timesPerDay: v.string(),
          durationDays: v.string(),
          timing: v.string(),
        })
      ),
      symptoms: v.array(v.object({ id: v.string(), name: v.string() })),
      findings: v.array(v.object({ id: v.string(), description: v.string() })),
      diagnoses: v.array(v.object({ id: v.string(), name: v.string() })),
      investigations: v.array(v.object({ id: v.string(), name: v.string() })),
      investigationNotes: v.optional(v.string()),
      followUpDate: v.optional(v.string()),
      medicineReminder: v.object({
        message: v.boolean(),
        call: v.boolean(),
      }),
      medicineInstructions: v.optional(v.string()),
    })
      .index("by_patient_id", ["patientId"])
      .index("by_doctor_id", ["doctorId"]),
  
  
  
});