import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

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
    medications: v.array(
      v.object({
        name: v.string(),
        dosage: v.string(),
        frequency: v.string(),
      })
    ),
    prescribedAt: v.string(),
    instructions: v.optional(v.string()),
  })
    .index("by_patient_id", ["patientId"])
    .index("by_doctor_id", ["doctorId"]),
});
