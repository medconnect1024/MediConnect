import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

export const savePrescription = mutation({
  args: {
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
    severity:  v.optional(v.string()),
    investigations: v.array(v.object({ id: v.string(), name: v.string() })),
    investigationNotes: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    medicineReminder: v.object({
      message: v.boolean(),
      call: v.boolean(),
    }),
    dosage: v.optional(v.string()),
    route: v.optional(v.string()),
    medicineInstructions: v.optional(v.string()),
    // New fields
    chronicCondition: v.boolean(),
   
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
  },
  async handler(ctx, args) {
    const {
      doctorId,
      patientId,
      medicines,
      symptoms,
      findings,
      diagnoses,
      severity,
      investigations,
      investigationNotes,
      followUpDate,
      medicineReminder,
      medicineInstructions,
      dosage,
      route,
      chronicCondition,  // Added field
      vitals,  // Added field
    } = args;

    // Auto-generate a unique prescriptionId
    const prescriptionId = `PRESC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Insert the new prescription into the database
    const newPrescriptionId = await ctx.db.insert("prescriptions", {
      prescriptionId,
      doctorId,
      patientId,
      medicines,
      symptoms,
      findings,
      severity,
      diagnoses,
      investigations,
      investigationNotes,
      followUpDate,
      medicineReminder,
      medicineInstructions,
      dosage,
      route,
      chronicCondition,  // Storing chronic condition
      vitals,  // Storing vitals information
    });

    return { prescriptionId: newPrescriptionId };
  },
});
// export const getLastPrescription = query(async (ctx) => {
//   const prescriptions = await ctx.db
//     .query("prescriptions")
//     .order("desc")
//     .take(1); // Use `take` instead of `limit` to get the latest prescription

//   return prescriptions.length > 0 ? prescriptions[0] : null;
// });
// In your Convex query file (e.g., prescriptions.ts)
export const getLastPrescriptionForPatient = query({
  args: { patientId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prescriptions")
      .filter((q) => q.eq(q.field("patientId"), args.patientId))
      .order("desc")
      .first();
  },
});