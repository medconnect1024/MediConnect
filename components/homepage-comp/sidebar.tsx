"use client";

import {
  Home,
  Search,
  Users,
  UserCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const categories = [
  {
    name: "Fertility & Family Building",
    href: "/fertility",
  },
  {
    name: "PCOS",
    href: "/pcos",
  },
  {
    name: "Endometriosis",
    href: "/endometriosis",
    subcategories: [
      "Overview",
      "Symptoms",
      "Diagnosis",
      "Treatment",
      "Research",
    ],
  },
  {
    name: "Dementia",
    href: "/dementia",
  },
  {
    name: "ALS",
    href: "/als",
  },
  {
    name: "GBM",
    href: "/gbm",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <div className={cn("pb-12 w-64 bg-[#0a0b3b]", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link className="flex items-center justify-center" href="/homepage">
            <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent">
              MyMedirecords
            </span>
          </Link>
        </div>
        <div className="px-3">
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between text-white hover:bg-blue-900"
              onClick={() => toggleCategory("Categories")}
            >
              <span>Categories</span>
              <ChevronDown
                className={`h-4 w-4 transform ${
                  openCategory === "Categories" ? "rotate-180" : ""
                } transition-transform`}
              />
            </Button>
            {openCategory === "Categories" && (
              <div className="mt-2 space-y-1 bg-gray-800 rounded-lg">
                {categories.map((category, index) => (
                  <div key={index} className="px-3 py-1">
                    <div
                      className="flex items-center justify-between text-gray-200 hover:text-white cursor-pointer"
                      onClick={() =>
                        category.subcategories && toggleCategory(category.name)
                      }
                    >
                      <Link href={category.href}>
                        <span>{category.name}</span>
                      </Link>
                      {category.subcategories && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            openCategory === category.name ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>
                    {openCategory === category.name &&
                      category.subcategories && (
                        <div className="pl-6 mt-1 space-y-1">
                          {category.subcategories.map((sub, subIndex) => (
                            <Link
                              key={subIndex}
                              href={`${category.href}#${sub.toLowerCase()}`}
                              className="block text-sm text-gray-400 hover:text-white"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-1 px-3">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: Search, label: "Explore", href: "/explore" },
            { icon: Users, label: "Experts", href: "/experts" },
            { icon: UserCircle, label: "Profile", href: "/profile" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 hover:bg-blue-900 transition-all"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-4 space-y-2">
        <Link
          href="/privacy"
          className="text-xs text-gray-400 hover:text-white px-3"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="text-xs text-gray-400 hover:text-white px-3"
        >
          Terms
        </Link>
      </div>
    </div>
  );
}
