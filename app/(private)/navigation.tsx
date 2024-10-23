"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Syringe,
  FileBarChart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Logo from "@/components/common/Logo";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { Loading } from "@/components/shared/Loading";
import { SignInButton, UserButton } from "@clerk/nextjs";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/docdashboard" },
  { name: "Consultation", icon: Users, path: "/consultation" },
  { name: "AddPatient", icon: UserPlus, path: "/patientinfo" },
];

export default function FixedNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-4 py-4">
          <div className="flex items-center space-x-4">
            <Logo />
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search Patient"
                aria-label="Search Patient"
              />
            </div>
          </div>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path} passHref>
                <Button
                  variant="ghost"
                  className={`text-gray-600 hover:text-gray-800 flex items-center ${
                    pathname === item.path ? "bg-gray-100" : ""
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
          <div className="flex justify-end items-center w-full">
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
          </div>
        </ul>
      </div>
    </nav>
  );
}
