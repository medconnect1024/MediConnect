"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Loading } from "@/components/shared/Loading";
import Logo from "@/components/common/Logo";
import { Search, Plus, Calendar } from "lucide-react";
import RegisterPatient from "@/components/RegisterPatientForm"; // Import your RegisterPatient component
// Define a type for the possible values of activePage
type ActivePage = "search" | "registerPatient" | "appointment" | null;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>(null);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="bg-white dark:bg-blue-500 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                className="hidden sm:flex"
                variant="outline"
                onClick={() => setActivePage("search")}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>

              {/* Create New Button */}
              <Button
                className="hidden sm:flex"
                variant="outline"
                onClick={() => setActivePage("registerPatient")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>

              {/* Appointment Button */}
              <Button
                className="hidden sm:flex"
                variant="outline"
                onClick={() => setActivePage("appointment")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Make Appointment
              </Button>
            </div>
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
            </Authenticated>
          </nav>

          {/* Mobile Menu Button (Only visible on mobile) */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-auto"
            >
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col absolute top-16 left-0 w-full bg-white dark:bg-gray-800 p-4 shadow-lg z-50 space-y-4">
            <Button
              variant="outline"
              onClick={() => {
                setActivePage("search");
                closeMenu();
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setActivePage("registerPatient");
                closeMenu();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setActivePage("appointment");
                closeMenu();
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Make Appointment
            </Button>
            <AuthLoading>
              <Loading />
            </AuthLoading>
            <Unauthenticated>
              <SignInButton>
                <Button
                  variant="ghost"
                  className="text-base font-bold text-[#3292f7] hover:text-blue-500"
                  onClick={closeMenu}
                >
                  Log in
                </Button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <UserButton />
            </Authenticated>
          </nav>
        )}
      </header>

      {/* Conditionally Rendered Pages */}
      <div className="container mx-auto px-4 py-6">
        {activePage === "search" && <div></div>}
        {activePage === "registerPatient" && <RegisterPatient />}
        {activePage === "appointment" && <div>Appointment Content</div>}
      </div>
    </>
  );
}
