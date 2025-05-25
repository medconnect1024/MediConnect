export default {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN,
      applicationID: "convex",
    },
    // {
    //   domain: process.env.CLERK_DOMAIN_QUICK_MEDI,
    //   applicationID: "convex",
    // },
  ],
};
