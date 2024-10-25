import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const savePrescription = mutation({
  args: {
    symptoms: v.array(v.object({ id: v.string(), name: v.string() })),
    findings: v.array(v.object({ id: v.string(), description: v.string() })),
    diagnoses: v.array(v.object({ id: v.string(), name: v.string() })),
    medicines: v.array(v.object({  // Make sure this matches the schema
      id: v.string(),
      name: v.string(),
      timesPerDay: v.string(),
      durationDays: v.string(),
      timing: v.string(),
    })),
    investigations: v.array(v.object({ id: v.string(), name: v.string() })),
    investigationNotes: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    medicineReminder: v.object({
      message: v.boolean(),
      call: v.boolean(),
    }),
    medicineInstructions: v.optional(v.string()),
    patientId: v.string(),
    doctorId: v.string(),
  },
  async handler(ctx, values) {
    const {
      symptoms, findings, diagnoses, medicines, investigations, investigationNotes,
      followUpDate, medicineReminder, medicineInstructions, patientId, doctorId,
    } = values;

    // Auto-generate a unique prescription ID as a string
    const lastPrescription = await ctx.db.query("prescriptions").order("desc").first();
    const prescriptionId = lastPrescription ? String(parseInt(lastPrescription.prescriptionId) + 1) : "1";

    // Insert the new prescription into the database
    await ctx.db.insert("prescriptions", {
      prescriptionId,
      symptoms,
      findings,
      diagnoses,
      medications: medicines, // Ensure this line matches the schema
      investigations,
      investigationNotes,
      followUpDate,
      medicineReminder,
      medicineInstructions,
      patientId,
      doctorId,
      prescribedAt: new Date().toISOString(),
    });
  },
});
