import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const create = mutation({
  args: {
    url: v.string(),
    cloudflareId: v.string(),
    metadata: v.any(),
  },
  handler: async (
    { db },
    { url, cloudflareId, metadata }
  ) => {
    await db.insert('videos', {
      url,
      cloudflareId,
      metadata,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: ""
    })
  },
})

export const updateStatus = mutation({
  args: {
    videoId: v.string(),
    status: v.string(),
  },
  handler: async (
    { db },
    { videoId, status }
  ) => {
    const videos = await db
      .query('videos')
      .filter((q) => q.eq(q.field('cloudflareId'), videoId))
      .collect()

    if (videos.length > 0) {
      await db.patch(videos[0]._id, { status })
    }
  },
})

export const list = query({
  handler: async ({ db }) => {
    return await db.query('videos').order('desc').collect()
  },
})
