import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const add = mutation({
  args: {
    userId: v.string(),
    url: v.string(),
    cloudflareId: v.string(),
    status: v.string(),
    metadata: v.any(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const videoId = await ctx.db.insert('videos', args)
    return videoId
  },
})

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('videos')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .order('desc')
      .collect()
  },
})

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const { id } = args

    // Verify that the video exists
    const video = await ctx.db.get(id)
    if (!video) {
      throw new Error("Video not found")
    }

    // Optional: Check if the current user has permission to delete this video
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity || identity.subject !== video.userId) {
    //   throw new Error("Not authorized to delete this video");
    // }

    // Delete the video from the database
    await ctx.db.delete(id)

    // Optional: If you're using Cloudflare Stream, you might want to delete the video from there as well
    // This would require making an API call to Cloudflare
    // const cloudflareResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${video.cloudflareId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
    //   },
    // });
    // if (!cloudflareResponse.ok) {
    //   console.error('Failed to delete video from Cloudflare');
    // }

    return { success: true }
  },
})
