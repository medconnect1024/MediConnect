import Header from "@/components/Header";
import type { Metadata } from "next";
import FixedNavigation from "./navigation";
import RoleSelection from "../roleselection/page";
import RoleBasedNavigation from "@/components/RoleBasedNavigation";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mymedirecords.com"), // Replace with your deployed URL
  title: {
    default: "Your AI Doctor",
    template: "%s | MyMediRecords",
  },
  description:
    "Revolutionize your health records with AI-powered insights and seamless organization.",
  keywords:
    "AI doctor, medical records, health insights, healthcare AI, medical organization",
  openGraph: {
    title: "Your AI Doctor - Organize and Optimize Your Health",
    description:
      "Your trusted platform for AI-powered medical records and health insights.",
    url: "https://www.mymedirecords.com",
    type: "website",
    siteName: "MyMediRecords",
    images: [
      {
        url: "opengraph-image.png", // Ensure the file exists in your public folder
        width: 1200,
        height: 630,
        alt: "MyMediRecords - Your AI doctor",
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
      <FixedNavigation />
      <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center p-2 mt-16">
        {children}
      </main>
      <Toaster />
    </>
  );
}
