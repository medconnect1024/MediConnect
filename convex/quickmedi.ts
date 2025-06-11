import { ConvexError, v } from "convex/values";
import { mutation, query, internalQuery, action } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { internal } from "./_generated/api";
import { OpenAI } from "openai";

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

export const getDoctorDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const profileImageUrl = user.profileImageUrl
      ? await ctx.storage.getUrl(user.profileImageUrl as Id<"_storage">)
      : undefined;

    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      profileImageUrl: profileImageUrl ?? undefined,
      role: user.role ?? undefined,
      phone: user.phone ?? undefined,
      specialization: user.specialization ?? undefined,
      licenseNumber: user.licenseNumber ?? undefined,
      yearsOfPractice: user.yearsOfPractice ?? undefined,
      practiceType: user.practiceType ?? undefined,
      bio: user.bio ?? undefined,
      clinicName: user.clinicName ?? undefined,
      logo: user.logo ?? undefined,
      address: user.address ?? undefined,
      city: user.city ?? undefined,
      state: user.state ?? undefined,
      zipCode: user.zipCode ?? undefined,
      website: user.website ?? undefined,
      hospitalId: user.hospitalId ?? undefined,
      stateRegistrationNumber: user.stateRegistrationNumber ?? undefined,
      nmcRegistrationId: user.nmcRegistrationId ?? undefined,
      licenseExpiryDate: user.licenseExpiryDate ?? undefined,
      certificateStorageId: user.certificateStorageId ?? undefined,
      signatureStorageId: user.signatureStorageId ?? undefined,
      education: user.education ?? undefined,
      awards: user.awards ?? undefined,
      event: user.upcomingEvents ?? undefined,
      pub: user.recentPublications ?? undefined,
      testimonial: user.patientTestimonials ?? undefined,
    };
  },
});

export const addProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    oldPrice: v.number(),
    discount: v.number(),
    image: v.string(),
    category: v.string(),
    inStock: v.boolean(),
    stockCount: v.number(),
    source: v.string(),
    supplier: v.string(),
    supplierLogo: v.string(),
    minOrder: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    expiryDate: v.string(),
    variations: v.optional(
      v.object({
        colors: v.array(v.string()),
        sizes: v.array(v.string()),
        features: v.array(v.string()),
      })
    ),
    images: v.optional(v.array(v.string())),
    keyAttributes: v.optional(
      v.object({
        condition: v.string(),
        brand: v.string(),
        model: v.string(),
        warranty: v.string(),
        certification: v.string(),
        origin: v.string(),
      })
    ),
    supplierInfo: v.optional(
      v.object({
        yearsInBusiness: v.string(),
        location: v.string(),
        responseTime: v.string(),
        onTimeDelivery: v.string(),
        totalOrders: v.number(),
        reorderRate: v.string(),
      })
    ),
    reviews: v.array(
      v.object({
        id: v.number(),
        reviewerName: v.string(),
        reviewerCountry: v.string(),
        reviewerInitial: v.string(),
        date: v.string(),
        rating: v.number(),
        text: v.string(),
        productName: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Auto-increment id by counting current products (for demo, not for prod)
    const allProducts = await ctx.db.query("products").collect();

    const productId = await ctx.db.insert("products", { ...args });
    return productId;
  },
});

export const getAllProducts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx.db.query("products").paginate(paginationOpts);
  },
});

// Internal query to fetch products by IDs
export const getProductsByIds = internalQuery({
  args: { ids: v.array(v.id("products")) },
  async handler(ctx: any, { ids }: { ids: string[] }) {
    const products = await Promise.all(ids.map((id: string) => ctx.db.get(id)));
    return products.filter(Boolean);
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getProductsByIdsV2 = action({
  args: { ids: v.array(v.id("products")), query: v.string() },
  handler: async (
    ctx: any,
    { ids, query }: { ids: string[]; query: string }
  ): Promise<Doc<"products">[]> => {
    // 1. Fetch products from DB using internal query
    const productsWithNull = await ctx.runQuery(
      internal.quickmedi.getProductsByIds,
      { ids }
    );
    const products = productsWithNull.filter(
      (product: Doc<"products"> | null): product is Doc<"products"> =>
        product !== null
    );

    if (!query.trim() || products.length === 0) return products;

    // 3. Send to OpenAI to filter products
    const prompt = `Given this user query: "${query}"

And these products:
${JSON.stringify(products, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Return only products that truly match the user's intent (category, features, brand, etc.)
2. Be strict about matching, do not return unrelated products
3. Return ONLY a valid JSON array of _id strings, no markdown formatting, no explanations.

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

      // 4. Return only matching products
      return products.filter((product: Doc<"products">) =>
        matchingIds.includes(product._id)
      );
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.error("Raw response:", response.choices[0].message.content);
      return products; // Return all products if parsing fails
    }
  },
});
