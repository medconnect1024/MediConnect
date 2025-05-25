import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { paginationOptsValidator, PaginationResult } from "convex/server";

export const getAllMedicalCamps = query({
  args: {
    paginationOpts: paginationOptsValidator,
    city: v.string(),
    date: v.optional(v.number()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  async handler(ctx, { city, paginationOpts, date }) {
    console.log({ city, date, paginationOpts });
    let camps: PaginationResult<Doc<"medicalCamp">>;
    if (!date) {
      if (city && city !== "All") {
        camps = await ctx.db
          .query("medicalCamp")
          .withIndex("by_city", (q) => q.eq("city", city))
          .paginate(paginationOpts);
      } else {
        camps = await ctx.db.query("medicalCamp").paginate(paginationOpts);
      }
    } else {
      if (city && city !== "All") {
        console.log("inside else city not all");
        camps = await ctx.db
          .query("medicalCamp")
          .withIndex("by_city_start_end", (q) =>
            q.eq("city", city).gte("endDateTime", date)
          )
          .filter((q) => q.lte(q.field("startDateTime"), date))
          .paginate(paginationOpts);
      } else {
        camps = await ctx.db
          .query("medicalCamp")
          .withIndex("by_start_end", (q) => q.gte("endDateTime", date))
          .filter((q) => q.lte(q.field("startDateTime"), date))
          .paginate(paginationOpts);
        console.log("inside else  else city is all");

        const allResults = await ctx.db
          .query("medicalCamp")
          .withIndex("by_start_end", (q) => q.gte("endDateTime", date))
          .filter((q) => q.lte(q.field("startDateTime"), date))
          .collect();
        console.log("All matching results:", allResults);
      }
    }
    return {
      ...camps,
      // page: camps.page.sort((a, b) => a.startDateTime - b.startDateTime),
    };
  },
});

// export const getAllMedicalCamps = query({
//   args: {
//     paginationOpts: paginationOptsValidator,
//     city: v.string(),
//     date: v.optional(v.number()),
//   },
//   async handler(ctx, { city, paginationOpts, date }) {
//     let queryBuilder = ctx.db.query("medicalCamp");

//     if (city && city !== "All") {
//       queryBuilder = queryBuilder
//         .withIndex("by_city_start_end", (q) => {
//           let query = q.eq("city", city);
//           if (date) {
//             query = query.gte("endDateTime", date).lte("endDateTime", date);
//           }
//           return query;
//         })
//         .paginate(paginationOpts);
//     }

//     const camps = await queryBuilder.paginate(paginationOpts);

//     return {
//       ...camps,
//       page: camps.page
//         .filter((camp) => !date || camp.endDateTime >= date)
//         .sort((a, b) => a.startDateTime - b.startDateTime),
//     };
//   },
// });

export const getCitySuggestions = query({
  async handler(ctx) {
    const cities = await ctx.db.query("medicalCamp").take(100);

    const uniqueCities = Array.from(new Set(cities.map((c) => c.city)));
    return uniqueCities.sort();
  },
});

export const createMedicalCamp = mutation({
  args: {
    title: v.string(),
    city: v.string(),
    state: v.string(),
    pincode: v.string(),
    category: v.string(),
    shortDescription: v.string(),
    address: v.string(),
    startDateTime: v.number(),
    endDateTime: v.number(),
    bannerImageUrl: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    doctors: v.array(v.string()),
    services: v.array(v.string()),
    organizerName: v.string(),
    organizerContact: v.string(),
    organizerEmail: v.string(),
    additionalInfo: v.optional(
      v.object({
        facilities: v.optional(v.array(v.string())),
        requirements: v.optional(v.array(v.string())),
        specialInstructions: v.optional(v.string()),
      })
    ),
    registration: v.object({
      deadline: v.optional(v.string()),
      isRequired: v.boolean(),
      link: v.optional(v.string()),
      phone: v.optional(v.string()),
    }),
  },
  async handler(ctx, args) {
    const campId = await ctx.db.insert("medicalCamp", {
      ...args,
      services: args.services.join(", "),
    });
    return campId;
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("medicalCamp")) },
  async handler(ctx, { ids }) {
    const camps = await Promise.all(ids.map((id) => ctx.db.get(id)));
    return camps.filter(Boolean);
  },
});
