"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link for client-side navigation
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Loading } from "@/components/shared/Loading";
import Logo from "@/components/common/Logo"; // Assuming you have a logo component

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-blue-500 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Menu for larger screens */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Additional Options */}
          <a
            href="#features"
            className="text-lg text-blue-500 dark:text-gray-300 hover:text-blue-500"
          >
            Features
          </a>
          <a
            href="#benefits"
            className="text-lg text-blue-500 dark:text-gray-300 hover:text-blue-500"
          >
            Benefits
          </a>
          <a
            href="#testimonials"
            className="text-lg text-blue-500 dark:text-gray-300 hover:text-blue-500"
          >
            Testimonials
          </a>

          {/* Authentication */}
          <AuthLoading>
            <Loading />
          </AuthLoading>
          <Unauthenticated>
            <SignInButton>
              <Button
                variant="ghost"
                className="text-base font-bold text-[#2178e9] hover:text-blue-500"
              >
                Log in
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
            <Link href="/docdashboard" passHref>
              <Button className="bg-[#2178e9] text-white hover:bg-[#0769e9]">
                Dashboard
              </Button>
            </Link>
          </Authenticated>

          {/* Additional Buttons */}
          <Unauthenticated>
            <Button className="bg-[#2178e9] text-white hover:bg-[#0067ee]">
              Get Started
            </Button>
          </Unauthenticated>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden flex-col absolute top-16 left-0 w-full bg-white dark:bg-gray-800 p-4 shadow-lg z-50 space-y-4">
          {/* Additional Options */}
          <a
            href="#features"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Features
          </a>
          <a
            href="#benefits"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Benefits
          </a>
          <a
            href="#testimonials"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Testimonials
          </a>

          {/* Authentication */}
          <AuthLoading>
            <Loading />
          </AuthLoading>
          <Unauthenticated>
            <SignInButton>
              <Button
                variant="ghost"
                className="text-base font-bold text-[#023E8A] hover:text-blue-500"
              >
                Log in
              </Button>
            </SignInButton>
            <Button className="bg-[#0077B6] text-white hover:bg-[#023E8A]">
              Get Started
            </Button>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
            <Link href="/docdashboard" passHref>
              <Button className="bg-[#0077B6] text-white hover:bg-[#023E8A]">
                Dashboard
              </Button>
            </Link>
          </Authenticated>
        </nav>
      )}
    </header>
  );
}
