"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  chronicCondition: boolean;
  setChronicCondition: React.Dispatch<React.SetStateAction<boolean>>;
  vitals: {
    temperature: string;
    bloodPressure: string;
    pulse: string;
  };
  setVitals: React.Dispatch<
    React.SetStateAction<{
      temperature: string;
      bloodPressure: string;
      pulse: string;
    }>
  >;
}

export default function FindingsComponent({
  findings,
  setFindings,
  chronicCondition,
  setChronicCondition,
  vitals,
  setVitals,
}: FindingsComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filter findings based on search term
  const filteredFindings = useMemo(() => {
    if (!searchTerm) return [];
    return FINDINGS.filter((finding) =>
      finding.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Adds a finding to the list immediately
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
        <button
          onClick={() => {
            if (searchTerm.trim()) {
              handleAddItem(searchTerm.trim());
            }
          }}
        >
          <Plus className="h-6 w-6" />
        </button>
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
              <button className="flex items-center gap-2 text-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                {item.name}
              </button>
              <X
                className="h-4 w-4 text-red-500 cursor-pointer"
                onClick={() => handleRemoveItem(item.id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Vitals Input Section */}
      <h4 className="text-lg font-semibold mt-6">Vitals</h4>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Temperature"
          value={vitals.temperature}
          onChange={(e) =>
            setVitals({ ...vitals, temperature: e.target.value })
          }
        />
        <Input
          placeholder="Blood Pressure"
          value={vitals.bloodPressure}
          onChange={(e) =>
            setVitals({ ...vitals, bloodPressure: e.target.value })
          }
        />
        <Input
          placeholder="Pulse"
          value={vitals.pulse}
          onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
        />
      </div>

      {/* Chronic Condition Checkbox */}
      <div className="mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={chronicCondition}
            onChange={(e) => setChronicCondition(e.target.checked)}
          />
          <span>Chronic Condition</span>
        </label>
      </div>
    </div>
  );
}
