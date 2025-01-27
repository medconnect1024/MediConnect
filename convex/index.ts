// convex/index.ts
import { GeospatialIndex } from "@convex-dev/geospatial";
import { components } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const geospatial = new GeospatialIndex<Id<"medicalCamp">, {}>(
  components.geospatial
);

export const insertPoint = mutation({
  args: { id: v.id("medicalCamp"), lat: v.number(), lng: v.number() },
  handler: async (ctx, { id, lat, lng }) => {
    await geospatial.insert(
      ctx,
      id,
      {
        latitude: lat,
        longitude: lng,
      },
      {}
    );
    const result = await geospatial.get(ctx, id);
    console.log(result);
    // await geospatial.remove(ctx, cityId);
  },
});

export const backFillGeoLocations = mutation({
  async handler(ctx, args_0) {
    const data = await ctx.db.query("medicalCamp").collect();
    data.map(async (d) => {
      await geospatial.insert(
        ctx,
        d._id,
        {
          latitude: d.latitude,
          longitude: d.longitude,
        },
        {}
      );
    });
  },
});

export const nearestPoints = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    maxDistance: v.number(),
  },
  handler: async (ctx, { latitude, longitude, maxDistance }) => {
    const maxResults = 16;
    const result = await geospatial.queryNearest(
      ctx,
      { latitude, longitude },
      maxResults,
      10000
    );

    const data = Promise.all(result.map(async (r) => await ctx.db.get(r.key)));
    return data;
  },
});
