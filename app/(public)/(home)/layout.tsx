import Header from "@/components/Header";
import type { Metadata } from "next";

//TODO: change content
export const metadata: Metadata = {
  metadataBase: new URL("https://write_your_prod_website_url"),
  title: {
    default: "Write content",
    template: "",
  },
  description: "write description",
  keywords: "write keywords",
  openGraph: {
    title: "",
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
    <>
      <Header />
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center">
        {children}
      </main>
    </>
  );
}
