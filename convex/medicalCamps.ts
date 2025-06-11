import { v } from "convex/values";
import { query, mutation, action, internalQuery } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { OpenAI } from "openai";
import { internal } from "./_generated/api";

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

// Internal query to fetch camps by IDs
export const getCampsByIds = internalQuery({
  args: { ids: v.array(v.id("medicalCamp")) },
  async handler(ctx, { ids }) {
    const camps = await Promise.all(ids.map((id) => ctx.db.get(id)));
    return camps.filter(Boolean);
  },
});
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getByIdsV2 = action({
  args: { ids: v.array(v.id("medicalCamp")), query: v.string() },
  handler: async (ctx, { ids, query }): Promise<Doc<"medicalCamp">[]> => {
    // 1. Fetch camps from DB using internal query
    const campsWithNull = await ctx.runQuery(
      internal.medicalCamps.getCampsByIds,
      { ids }
    );
    const camps = campsWithNull.filter(
      (camp): camp is Doc<"medicalCamp"> => camp !== null
    );

    if (!query.trim() || camps.length === 0) return camps;

    // 3. Send to OpenAI to filter camps

    const prompt = `Given this user query: "${query}"

And these medical camps:
${JSON.stringify(camps, null, 2)}

IMPORTANT INSTRUCTIONS:
1. If the user query mentions a specific city/location (like "bangalore", "mumbai", etc.), ONLY return camps from that exact city
2. If no location is mentioned, then consider all camps based on services and medical conditions
3. Be strict about location matching - "bangalore" should NOT match "tumkur" or other cities
4. Return only camps that truly match the user's intent

Return ONLY a valid JSON array of _id strings, no markdown formatting, no explanations.

Example: ["id1", "id2", "id3"]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    try {
      let responseContent = response.choices[0].message.content || "[]";

      // Handle markdown code blocks if present
      if (responseContent.includes("```json")) {
        const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          responseContent = jsonMatch[1];
        }
      } else if (responseContent.includes("```")) {
        const jsonMatch = responseContent.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          responseContent = jsonMatch[1];
        }
      }

      const matchingIds = JSON.parse(responseContent.trim()) as string[];

      // 4. Return only matching camps
      return camps.filter((camp) => matchingIds.includes(camp._id));
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.error("Raw response:", response.choices[0].message.content);
      return camps; // Return all camps if parsing fails
    }
  },
});
