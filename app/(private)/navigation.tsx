"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Logo from "@/components/common/Logo";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { Loading } from "@/components/shared/Loading";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import router from "next/router";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/docdashboard" },
  { name: "Consultation", icon: Users, path: "/consultation" },
  { name: "AddPatient", icon: UserPlus, path: "/registerPatient" },
];

export default function FixedNavigation() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const patients = useQuery(api.patientsearch.searchPatients, { searchTerm });
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize useRouter

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (patientName: string) => {
    // You can perform any action you want on click
    console.log(`Selected patient: ${patientName}`);
    // setSearchTerm(patientName); // Optionally set the input to the selected patient name
    router.push(`/consultation?patientId=${encodeURIComponent(patientName)}`);
    setIsOpen(false); // Close the dropdown
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-4 py-4">
          <div className="flex items-center space-x-4" ref={searchRef}>
            <Logo />
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search Patient"
                aria-label="Search Patient"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsOpen(true)}
              />
              {isOpen && (
                <div className="absolute z-10 left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {patients ? (
                    patients.length > 0 ? (
                      <ul
                        className="max-h-60 overflow-auto py-1"
                        role="listbox"
                      >
                        {patients.map((patient) => (
                          <li
                            key={patient._id}
                            className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer truncate"
                            role="option"
                            onClick={() => handleResultClick(patient.firstName)} // Close dropdown on click
                          >
                            {patient.firstName}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-2 text-sm text-muted-foreground">
                        No patients found
                      </p>
                    )
                  ) : (
                    <p className="p-2 text-sm text-muted-foreground">
                      Loading...
                    </p>
                  )}
                </div>
              )}
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
