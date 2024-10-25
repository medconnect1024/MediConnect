"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";

const SYMPTOMS = [
  "Cough",
  "Fever",
  "Headache",
  "Fatigue",
  "Sore throat",
  "Runny nose",
  "Shortness of breath",
  "Muscle ache",
  "Loss of taste or smell",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Chills",
  "Weakness",
];

type PrescriptionItem = {
  id: string;
  name: string;
};

interface SymptomPageProps {
  symptoms: PrescriptionItem[];
  setSymptoms: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
}

export default function SymptomsComponent({
  symptoms,
  setSymptoms,
}: SymptomPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filteredSymptoms = useMemo(() => {
    if (!searchTerm) return [];
    return SYMPTOMS.filter((symptom) =>
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddItem = (item: string) => {
    const newItem: PrescriptionItem = { id: Date.now().toString(), name: item };
    setSymptoms((prev) => [...prev, newItem]);
    setSearchTerm("");
    setIsSearching(false);
  };

  const handleRemoveItem = (id: string) => {
    setSymptoms((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Symptoms</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-6 text-lg"
            placeholder="Search symptoms (e.g., Cough, Weakness)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearching(true);
            }}
            onFocus={() => setIsSearching(true)}
            onBlur={() => {
              // Delay hiding the results to allow for item selection
              setTimeout(() => setIsSearching(false), 200);
            }}
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
      {isSearching && filteredSymptoms.length > 0 && (
        <ul className="mt-4 space-y-2 absolute z-10 bg-background border rounded-md shadow-lg max-h-60 overflow-auto w-full max-w-[calc(100%-5rem)]">
          {filteredSymptoms.map((symptom) => (
            <li
              key={symptom}
              className="p-2 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
              onClick={() => handleAddItem(symptom)}
            >
              {symptom}
            </li>
          ))}
        </ul>
      )}
      <ScrollArea className="h-[150px] mt-4">
        <div className="flex flex-wrap gap-3">
          {symptoms.map((item) => (
            <div key={item.id} className="flex items-center">
              <Button
                variant="secondary"
                size="lg"
                className="flex items-center gap-2 text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
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
      </ScrollArea>
    </div>
  );
}
