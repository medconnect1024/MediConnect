"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type PrescriptionItem = {
  id: string;
  name: string;
};

interface FindingsPageProps {
  findings: PrescriptionItem[];
  setFindings: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
}

export default function FindingsPage({
  findings,
  setFindings,
}: FindingsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchResults = useQuery(api.patientsearch.search, { searchTerm });

  const handleAddItem = (item: string) => {
    const newItem: PrescriptionItem = { id: Date.now().toString(), name: item };
    setFindings((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setFindings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Findings</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-6 text-lg"
            placeholder="Search findings (e.g., Throat Congestion, Chest Clear)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => {
            if (searchTerm.trim()) {
              handleAddItem(searchTerm.trim());
              setSearchTerm("");
            }
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      {searchResults && searchResults.length > 0 && (
        <ul className="mt-4 space-y-2">
          {searchResults.map((finding) => (
            <li key={finding._id} className="p-2 bg-secondary rounded-md">
              {finding.firstName}
            </li>
          ))}
        </ul>
      )}
      <ScrollArea className="h-[150px]">
        <div className="flex flex-wrap gap-3">
          {findings.map((item) => (
            <Button
              key={item.id}
              variant="secondary"
              size="lg"
              className="flex items-center gap-2 text-lg hover:bg-blue-500 hover:text-white transition-colors"
            >
              {item.name}
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.id);
                }}
              />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
