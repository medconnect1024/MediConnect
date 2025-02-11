import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const getVideoMetadata = query({
  args: {
    userIds: v.array(v.string()),
    currentUserId: v.optional(v.string()),
    videoIds: v.array(v.number()),
  },
  handler: async (ctx, { userIds, currentUserId, videoIds }) => {
    if (!userIds || userIds.length <= 0) return [];
    console.log(userIds);
    const users = await Promise.all(
      userIds.map((userId) =>
        ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
          .unique()
      )
    );

    let savedVideos: Doc<"savedVideos">[] | null = [];
    if (currentUserId) {
      const data = await Promise.all(
        videoIds.map((videoId) =>
          ctx.db
            .query("savedVideos")
            .withIndex("by_userId_videoId", (q) =>
              q.eq("userId", currentUserId).eq("videoId", videoId)
            )
            .unique()
        )
      );
      savedVideos = data.filter((d) => d !== null);
    }

    const usersWithUrl = await Promise.all(
      users
        .filter((user): user is Doc<"users"> => user !== null)
        .map(async (user) => ({
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          url: user.profileImageUrl
            ? await ctx.storage.getUrl(user.profileImageUrl as Id<"_storage">)
            : undefined,
          specialization: user.specialization ?? "General Physician",
        }))
    );

    return { usersWithUrl, savedVideos };
  },
});

export const getAllDoctors = query({
  handler: async (ctx) => {
    const doctors = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "Doctor"))
      .collect();
    const doctorsWithImageUrl = await Promise.all(
      doctors.map(async (doctor) => {
        return {
          ...doctor,
          imageUrl: doctor.profileImageUrl
            ? await ctx.storage.getUrl(doctor.profileImageUrl as Id<"_storage">)
            : undefined,
        };
      })
    );

    return doctorsWithImageUrl;
  },
});

export const bookmarkVideo = mutation({
  args: {
    videoId: v.number(),
    userId: v.string(),
    shouldAdd: v.boolean(),
    videoThumbnail: v.string(),
    videoUrl: v.string(),
    doctorId: v.string(),
  },
  async handler(
    ctx,
    { videoId, userId, shouldAdd, videoThumbnail, videoUrl, doctorId }
  ) {
    const record = await ctx.db
      .query("savedVideos")
      .withIndex("by_userId_videoId", (q) =>
        q.eq("userId", userId).eq("videoId", videoId)
      )
      .unique();

    if (shouldAdd) {
      if (!record) {
        ctx.db.insert("savedVideos", {
          userId,
          videoId,
          videoThumbnail,
          videoUrl,
          doctorId,
        });
      } else {
        throw new ConvexError("Video is already saved as bookmark");
      }
    } else {
      if (!record) {
        throw new ConvexError(
          "Unable to find bookmarked videos to be removed from bookmarked"
        );
      } else {
        await ctx.db.delete(record._id);
      }
    }
  },
});

export const getBookmarkVideos = query({
  args: { userId: v.string() },
  async handler(ctx, { userId }) {
    const videos = await ctx.db
      .query("savedVideos")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const uniqueUserIds = new Set<string>();
    videos.forEach((v) => uniqueUserIds.add(v.doctorId));
    const doctors = await Promise.all(
      Array.from(uniqueUserIds).map((userId) =>
        ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
          .unique()
      )
    );
    const doctorsWithUrl = await Promise.all(
      doctors
        .filter((user): user is Doc<"users"> => user !== null)
        .map(async (user) => ({
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          url: user.profileImageUrl
            ? await ctx.storage.getUrl(user.profileImageUrl as Id<"_storage">)
            : undefined,
          specialization: user.specialization ?? "General Physician",
        }))
    );
    console.log({ doctorsWithUrl });
    return { videos, doctorsWithUrl };
  },
});
