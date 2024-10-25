"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";

// Predefined findings list
const FINDINGS = [
  "Throat Congestion",
  "Chest Clear",
  "Fatigue",
  "Sore Throat",
  "Headache",
  "Cough",
  "Muscle Pain",
  "Fever",
  "Shortness of Breath",
  "Nausea",
  "Dizziness",
  "Runny Nose",
  "Loss of Appetite",
  "Vomiting",
];

type FindingItem = {
  id: string;
  name: string;
};

interface FindingsComponentProps {
  findings: FindingItem[];
  setFindings: React.Dispatch<React.SetStateAction<FindingItem[]>>;
}

export default function FindingsComponent({
  findings,
  setFindings,
}: FindingsComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filtered findings list based on search term
  const filteredFindings = useMemo(() => {
    if (!searchTerm) return [];
    return FINDINGS.filter((finding) =>
      finding.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Adds a finding to the list
  const handleAddItem = (item: string) => {
    if (!findings.some((f) => f.name === item)) {
      const newItem: FindingItem = { id: Date.now().toString(), name: item };
      setFindings((prev) => [...prev, newItem]);
    }
    setSearchTerm("");
    setIsSearching(false);
  };

  // Removes a finding by its ID
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
            placeholder="Search findings (e.g., Throat Congestion, Fever)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearching(true);
            }}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => {
            if (searchTerm.trim()) {
              handleAddItem(searchTerm.trim());
            }
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      {isSearching && filteredFindings.length > 0 && (
        <ul className="mt-4 space-y-2 absolute z-10 bg-background border rounded-md shadow-lg max-h-60 overflow-auto w-full max-w-[calc(100%-5rem)]">
          {filteredFindings.map((finding) => (
            <li
              key={finding}
              className="p-2 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
              onClick={() => handleAddItem(finding)}
            >
              {finding}
            </li>
          ))}
        </ul>
      )}
      <ScrollArea className="h-[150px] mt-4">
        <div className="flex flex-wrap gap-3">
          {findings.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="lg"
                className="flex items-center gap-2 text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {item.name}
              </Button>
              <X
                className="h-4 w-4 text-red-500 cursor-pointer"
                onClick={() => handleRemoveItem(item.id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
