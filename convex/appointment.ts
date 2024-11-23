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
        (args.doctorId ? q.eq(q.field('doctorId'), args.doctorId) : true)
      )
      .collect();

    return existingAppointments.length === 0;
  },
});

export const checkDoctorAvailability = query({
  args: {
    doctorId: v.string(),
    appointmentDate: v.string(),
  },
  handler: async (ctx, args) => {
    const { doctorId, appointmentDate } = args

    // Validate input
    if (!doctorId || !appointmentDate) {
      throw new Error('Both doctorId and appointmentDate are required')
    }

    // Parse the appointmentDate to ensure it's a valid date
    const date = new Date(appointmentDate)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Please provide the date in ISO 8601 format')
    }

    // Query the appointments table for conflicting appointments
    const conflictingAppointments = await ctx.db
      .query('appointments')
      .filter((q) => 
        q.eq(q.field('doctorId'), doctorId) &&
        q.eq(q.field('appointmentDate'), appointmentDate) &&
        q.neq(q.field('status'), 'cancelled')
      )
      .collect()

    // Check if there are any conflicting appointments
    const isAvailable = conflictingAppointments.length !== 0

    return {
      available: isAvailable,
      message: isAvailable 
        ? "The requested appointment slot is available." 
        : "The requested appointment slot is available.",
    }
  },
})



export const getNumberOfAppointmentsTodayForDoctor = query({
  args: { doctorId: v.string() },
  handler: async (ctx, args) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    const appointmentsToday = await ctx.db
      .query('appointments')
      .filter((q) =>
        q.and(
          q.eq(q.field('doctorId'), args.doctorId),
          q.gte(q.field('appointmentDate'), startOfDay),
          q.lt(q.field('appointmentDate'), endOfDay)
        )
      )
      .collect();

    return { count: appointmentsToday.length, message: 'Number of appointments today for doctor' };
  },
});
export const getWeeklyAppointmentsForDoctor = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const { doctorId } = args;

    // Get the start and end of the current week
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Query for appointments within this range
    const weeklyAppointments = await ctx.db
      .query('appointments')
      .filter((q) =>
        q.and(
          q.eq(q.field('doctorId'), doctorId),
          q.gte(q.field('appointmentDate'), startOfWeek.toISOString()),
          q.lt(q.field('appointmentDate'), endOfWeek.toISOString())
        )
      )
      .collect();

    return {
      count: weeklyAppointments.length,
      message: 'Weekly appointments fetched successfully',
    };
  },
});

export const getPatientFlowThisWeek = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const { doctorId } = args;

    // Get the start of the week
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Fetch all appointments for the doctor this week
    const appointments = await ctx.db
      .query('appointments')
      .filter((q) =>
        q.and(
          q.eq(q.field('doctorId'), doctorId),
          q.gte(q.field('appointmentDate'), startOfWeek.toISOString()),
          q.lt(q.field('appointmentDate'), endOfWeek.toISOString())
        )
      )
      .collect();

    // Group by day of the week
    const patientFlowData = Array(7).fill(0).map((_, i) => ({
      name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
      patients: 0,
    }));

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const dayIndex = appointmentDate.getDay(); // 0 = Sunday, 6 = Saturday
      patientFlowData[dayIndex].patients += 1;
    });

    return patientFlowData;
  },
});

export const getPatientSatisfactionData = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const { doctorId } = args;

    // You can replace this with actual calculations based on your data
    const patientSatisfactionData = [
      { subject: 'Communication', A: 120, B: 110 },
      { subject: 'Care', A: 98, B: 130 },
      { subject: 'Facilities', A: 86, B: 100 },
      { subject: 'Wait Time', A: 99, B: 90 },
      { subject: 'Follow-Up', A: 85, B: 95 },
    ];

    return patientSatisfactionData;
  },
});



export const getAppointmentsByDoctorAndDate = query({
  args: {
    doctorId: v.string(),
    date: v.string(), // Expecting 'YYYY-MM-DD' format
  },
  handler: async ({ db }, { doctorId, date }) => {
    if (!doctorId || !date) {
      console.warn("Missing doctorId or date");
      return [];
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const appointments = await db
      .query("appointments")
      .filter((q) =>
        q.and(
          q.eq(q.field("doctorId"), doctorId),
          q.gte(q.field("appointmentDate"), startOfDay.toISOString()),
          q.lte(q.field("appointmentDate"), endOfDay.toISOString())
        )
      )
      .collect();

    console.log("Fetched appointments:", appointments);
    return appointments;
  },
});
