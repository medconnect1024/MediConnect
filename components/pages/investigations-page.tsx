"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { INVESTIGATION_NAMES } from "@/components/data/investigationNames";

type PrescriptionItem = {
  id: string;
  name: string;
};

interface InvestigationsPageProps {
  investigations: PrescriptionItem[];
  setInvestigations: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
  investigationNotes: string;
  setInvestigationNotes: React.Dispatch<React.SetStateAction<string>>;
}

// const INVESTIGATION_NAMES = [
//   "CBC",
//   "Thyroid Profile",
//   "Liver Function Test",
//   "Kidney Function Test",
//   "Blood Sugar",
//   "Lipid Profile",
// ];

export default function InvestigationsPage({
  investigations,
  setInvestigations,
  investigationNotes,
  setInvestigationNotes,
}: InvestigationsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const searchResults = useQuery(api.patientsearch.search, { searchTerm });

  // Update suggestions based on search term
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = INVESTIGATION_NAMES.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleAddItem = (item: string) => {
    const newItem: PrescriptionItem = { id: Date.now().toString(), name: item };
    setInvestigations((prev) => [...prev, newItem]);
    setSearchTerm("");
    setFilteredSuggestions([]);
  };

  const handleRemoveItem = (id: string) => {
    setInvestigations((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    // Here you can handle data passing to the Prescription page dynamically
    // Add any necessary data handling or state syncing here if needed.
  }, [investigations]);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Investigations</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-3 text-lg"
            placeholder="Search investigations (e.g., CBC, Thyroid Profile)"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-10"
          onClick={() => {
            if (searchTerm.trim()) {
              handleAddItem(searchTerm.trim());
            }
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      {filteredSuggestions.length > 0 && (
        <ul className="mt-4 space-y-2 border border-gray-300 rounded-md">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => handleAddItem(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <ScrollArea className="h-[150px] mt-4 border rounded-md">
        <div className="p-3">
          <h4 className="text-lg font-semibold mb-2">
            Selected Investigations
          </h4>
          <div className="flex flex-wrap gap-3">
            {investigations.map((item) => (
              <div key={item.id} className="flex items-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex items-center gap-2 text-lg "
                >
                  {item.name}
                </Button>
                <X
                  className="h-4 w-4 cursor-pointer text-red-500 ml-2"
                  onClick={() => handleRemoveItem(item.id)} // Call handleRemoveItem directly here
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <Textarea
        placeholder="Investigation Notes"
        value={investigationNotes}
        onChange={(e) => setInvestigationNotes(e.target.value)}
        className="mt-4"
      />
    </div>
  );
}
