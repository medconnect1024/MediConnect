"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Loading } from "@/components/shared/Loading";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo"; // Assuming you have a logo component

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Menu for larger screens */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            General
          </Button>
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Print
          </Button>
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Registration
          </Button>
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Consultation
          </Button>

          {/* Authentication */}
          <AuthLoading>
            <Loading />
          </AuthLoading>
          <Unauthenticated>
            <SignInButton>
              <Button
                variant="ghost"
                className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                Sign In
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
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
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            General
          </Button>
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Print
          </Button>
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Registration
          </Button>
          <Button
            variant="ghost"
            className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Consultation
          </Button>

          {/* Authentication */}
          <AuthLoading>
            <Loading />
          </AuthLoading>
          <Unauthenticated>
            <SignInButton>
              <Button
                variant="ghost"
                className="text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                Sign In
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
        </nav>
      )}
    </header>
  );
}
