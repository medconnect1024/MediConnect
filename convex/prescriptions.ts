import { mutation } from "./_generated/server";
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
    
    // New fields
    chronicCondition: v.boolean(),
    vitals: v.object({
      temperature: v.string(),
      bloodPressure: v.string(),
      pulse: v.string(),
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
      investigations,
      investigationNotes,
      followUpDate,
      medicineReminder,
      medicineInstructions,
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
      diagnoses,
      investigations,
      investigationNotes,
      followUpDate,
      medicineReminder,
      medicineInstructions,
      chronicCondition,  // Storing chronic condition
      vitals,  // Storing vitals information
    });

    return { prescriptionId: newPrescriptionId };
  },
});
