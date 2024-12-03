import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Search, Menu, ChevronLeft } from "lucide-react";
import { ExpertsSection } from "@/components/sections/experts-section";
import CTASection from "@/components/sections/cta-section";

const DynamicVideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false,
  loading: () => <p>Loading video player...</p>,
});

const DynamicAnimatedContent = dynamic(
  () => import("@/components/AnimatedContent"),
  {
    ssr: false,
    loading: () => <p>Loading animated content...</p>,
  }
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent">
            MyMedirecords
          </span>
        </Link>
        <nav className="hidden md:flex ml-auto gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            Medical Team
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            Blog
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            Login
          </Link>
          <Button className="bg-gradient-to-r from-blue-600 to-sky-400 text-white hover:opacity-90 transition-opacity">
            Sign Up
          </Button>
        </nav>
        <Button className="md:hidden ml-auto" variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </header>
      <main className="flex-1 pt-16">
        <section className="w-full min-h-[calc(100vh-4rem)] py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-10 text-center">
              <DynamicAnimatedContent />
              <div className="relative w-full max-w-5xl h-[600px] mt-20">
                <Suspense fallback={<div>Loading content...</div>}>
                  <DynamicAnimatedContent isScreens={true} />
                  <DynamicVideoPlayer />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
        <ExpertsSection />
        <CTASection />
      </main>
    </div>
  );
}
