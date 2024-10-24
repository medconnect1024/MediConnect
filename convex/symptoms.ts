// convex/functions/searchSymptoms.ts
import { query } from './_generated/server';
import { v } from 'convex/values';



// Query to search for symptoms based on the search term
export const fetchsymptoms = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.searchTerm.toLowerCase();

    // Fetch all symptoms and filter based on the search term
    const symptoms = await ctx.db
      .query('symptoms')
      //.filter((symptom: Symptom) => symptom.name.toLowerCase().includes(searchTerm))
      .collect();

    console.log('Symptoms Found:', symptoms);
    return symptoms;
  },
});