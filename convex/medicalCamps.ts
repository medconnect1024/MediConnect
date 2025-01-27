import { v } from "convex/values";
import { query } from "./_generated/server";
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

    return [...new Set(cities.map((c) => c.city).sort())];
  },
});
