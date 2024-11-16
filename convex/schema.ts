import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("Doctor"), v.literal("Patient"),v.literal("Desk"))),
    phone: v.optional(v.string()),
    specialization: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
    yearsOfPractice: v.optional(v.number()),
    practiceType: v.optional(v.union(v.literal("Private"), v.literal("Hospital"), v.literal("Clinic"))),
    bio: v.optional(v.string()),
    clinicName: v.optional(v.string()),
    logo: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    website: v.optional(v.string()),
  })
    .index("by_clerk_id", ["userId"])
    .index("by_email", ["email"]),
    patients: defineTable({
      patientId: v.number(),
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
    })
      .index("by_patient_id", ["patientId"])
      .index("by_email", ["email"])
      .index("by_phoneNumber", ["phoneNumber"]),
     
  
        appointments: defineTable({
          patientId: v.string(),
          doctorId: v.string(),
          appointmentId: v.string(),
          speciality:v.optional(v.string()),
          service: v.optional(v.string()),
          provider: v.optional(v.string()),
          location: v.optional(v.string()),
          appointmentType: v.optional(v.union(v.literal("regular"), v.literal("recurring"))),
          isTeleconsultation: v.optional(v.boolean()),
          status: v.union(v.literal("Scheduled"), v.literal("waitlist"), v.literal("completed"), v.literal("cancelled"),v.literal("attending")),
          appointmentDate: v.string(),
          notes: v.optional(v.string()),
          reasonForVisit: v.optional(v.string()),
          insuranceDetails: v.optional(v.string()),
          createdAt: v.optional(v.string()),  // Make createdAt optional
          updatedAt: v.optional(v.string()),
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
          dosage: v.string(),  // Add dosage
          route: v.string(),   // Add route
        })
      ),
      symptoms: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          duration: v.optional(v.string()),   // Add duration
          frequency: v.optional(v.string()),  // Add frequency
          severity: v.optional(v.string())    // Add severity
        })
      ),
      findings: v.array(v.object({ id: v.string(), description: v.string() })),
      diagnoses: v.array(v.object({ id: v.string(), name: v.string() })),
      investigations: v.array(v.object({ id: v.string(), name: v.string() })),
      investigationNotes: v.optional(v.string()),
      followUpDate: v.optional(v.string()),
      severity: v.optional(v.string()), 
      medicineReminder: v.object({
        message: v.boolean(),
        call: v.boolean(),
      }),
      dosage: v.optional(v.string()),
      route: v.optional(v.string()),
      medicineInstructions: v.optional(v.string()),
      // New fields
      chronicCondition: v.boolean(),
      criticalLabValues:v.optional(v.string()), 
      vitals: v.object({
        temperature: v.string(),
        bloodPressure: v.string(),
        pulse: v.string(),
        height: v.string(),
        weight: v.string(),
        bmi: v.string(),
        waistHip: v.string(),
        spo2: v.string(),
      }),
      storageId: v.optional(v.string()),
    })
      .index("by_patient_id", ["patientId"])
      .index("by_doctor_id", ["doctorId"]),
      messages: defineTable({
        phoneNumber: v.string(),
        content: v.string(),
        direction: v.string(),
        timestamp: v.string(),
        messageId: v.string(),
        conversationId: v.string()
      }),
  
      labReports: defineTable({
        patientId: v.optional(v.string()),
        date: v.string(),
        notes: v.string(),
        storageId: v.string(),
        fileType: v.union(v.literal("pdf"), v.literal("image")),
        fileName: v.string(),
        createdAt: v.number(),
      }).index("by_date", ["date"]),

      contacts: defineTable({
        phoneNumber: v.string(),
        name: v.string(),
        scheduledTime: v.string(), // Format: "HH:MM"
        timezone: v.string(),
        // Add any additional fields you might need for contacts
      }),
    
      scheduledCalls: defineTable({
        contactId: v.id("contacts"),
        status: v.string(), // e.g., "scheduled", "completed", "failed"
        scheduledAt: v.string(), // ISO 8601 date string
        callId: v.optional(v.string()), // Bolna API call ID
        result: v.optional(v.string()), // To store any result or error message
        // Add any additional fields you might need for scheduled calls
      }),
});

