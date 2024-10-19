import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConvexClientProvider from "@/app/ConvexClientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

//TODO: write content
export const metadata: Metadata = {
  metadataBase: new URL("https://write_your_prod_website_url"),
  title: {
    default: "Product Title - tag Line(optional)",
    template: "%s | Product Title - tag Line(optional)",
  },
  description: "write description for seo",
  keywords: "write keywords for seo",
  openGraph: {
    title: "Product Title - tag Line(optional)",
    description: "write description for seo",
    url: "write main website url after deployment",
    type: "website",
    siteName: "write siteName",
    images: [
      {
        url: "opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "write alt text",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased px-5`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
