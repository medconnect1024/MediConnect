import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Mutation to add an appointment
export const addAppointment = mutation({
  args: {
    patientId: v.string(),
    doctorId: v.string(),
    appointmentId: v.string(),
    speciality: v.optional(v.string()),
    service: v.optional(v.string()),
    referredBy: v.optional(v.string()),
    location: v.optional(v.string()),
    appointmentType: v.union(v.literal('regular'), v.literal('recurring')),
    isTeleconsultation: v.optional(v.boolean()),
    status: v.union(v.literal('Scheduled'), v.literal('waitlist'), v.literal('completed'), v.literal('cancelled')),
    appointmentDate: v.string(),
    appointmentTime: v.string(), // New field
    notes: v.optional(v.string()),
    reasonForVisit: v.optional(v.string()),
    insuranceDetails: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointmentId = await ctx.db.insert('appointments', {
      patientId: args.patientId,
      doctorId: args.doctorId,
      appointmentId: args.appointmentId,
      speciality: args.speciality,
      service: args.service,
      referredBy: args.referredBy,
      location: args.location,
      appointmentType: args.appointmentType,
      isTeleconsultation: args.isTeleconsultation,
      status: args.status,
      appointmentDate: args.appointmentDate,
      appointmentTime: args.appointmentTime, // New field
      notes: args.notes,
      reasonForVisit: args.reasonForVisit,
      insuranceDetails: args.insuranceDetails,
      createdAt: new Date().toISOString(),
    })
    return appointmentId
  },
})

// Query to get all appointments
export const getAppointments = query(async (ctx) => {
  return await ctx.db.query('appointments').collect()
})

// Query to get all patients
export const getAllPatients = query(async (ctx) => {
  return await ctx.db.query('patients').collect()
})

export const checkAppointment = query({
  args: { 
    appointmentDate: v.string(),
    appointmentTime: v.string(),
    doctorId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existingAppointments = await ctx.db
      .query('appointments')
      .filter(q => 
        q.eq(q.field('appointmentDate'), args.appointmentDate) &&
        q.eq(q.field('appointmentTime'), args.appointmentTime) &&
        (args.doctorId ? q.eq(q.field('doctorId'), args.doctorId) : true)
      )
      .collect();

    return existingAppointments.length === 0;
  },
});