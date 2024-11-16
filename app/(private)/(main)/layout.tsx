import Header from "@/components/Header";
import type { Metadata } from "next";
import FixedNavigation from "./navigation";
import RoleSelection from "../roleselection/page";
import RoleBasedNavigation from "@/components/RoleBasedNavigation";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

//TODO: change content
export const metadata: Metadata = {
  metadataBase: new URL("https://write_your_prod_website_url"),
  title: {
    default: "Write content",
    template: "%s | Product title - subtitle/tagline(optional)",
  },
  description: "write description",
  keywords: "write keywords",
  openGraph: {
    title: "Product title - subtitle/tagline(optional)",
    description: "write desc",
    url: "write prod website url for seo",
    type: "website",
    siteName: "write sitename",
    images: [
      {
        url: "opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Write alt text",
      },
    ],
  },
};

export default function RootLayout({

  children,

}: {
  children: React.ReactNode;
  
}) {
  return (
    
    <html lang="en">
    <body>
        <FixedNavigation/>
          <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center p-2 mt-16">
            {children}
          </main>
      <Toaster />
    </body>
  </html>
  );
}
// import React from 'react'
// import FixedNavigation from "./navigation";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <FixedNavigation />
//         <main className="pt-16">{children}</main>
//       </body>
//     </html>
//   )
// }
