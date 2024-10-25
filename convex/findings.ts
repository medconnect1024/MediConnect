// convex/functions/searchFindings.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

// Query to search for findings based on the search term
export const fetchFindings = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.searchTerm.toLowerCase();

    // Fetch all findings and filter based on the search term
    const findings = await ctx.db
      .query('findings') // Ensure this matches the table name
      .collect();

    // Filter findings that start with the search term
    const filteredFindings = findings.filter(finding => 
      finding.name.toLowerCase().startsWith(searchTerm)
    );

    console.log('Findings Found:', filteredFindings);
    return filteredFindings;
  },
});
