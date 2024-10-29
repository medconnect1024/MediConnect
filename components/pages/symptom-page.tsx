"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";

const SYMPTOMS = [
  "Abdominal Pain",
  "Acid Reflux (see Heartburn)",
  "Airsickness (see Motion Sickness)",
  "Bad Breath",
  "Belching (see Gas)",
  "Bellyache (see Abdominal Pain)",
  "Bleeding",
  "Bleeding, Gastrointestinal (see Gastrointestinal Bleeding)",
  "Breath Odor (see Bad Breath)",
  "Breathing Problems",
  "Bruises",
  "Burping (see Gas)",
  "Carsickness (see Motion Sickness)",
  "Chest Pain",
  "Chilblains (see Frostbite)",
  "Choking",
  "Chronic Pain",
  "Cluster Headache (see Headache)",
  "Cold (Temperature) (see Frostbite; Hypothermia)",
  "Communication Disorders (see Speech and Communication Disorders)",
  "Constipation",
  "Contusions (see Bruises)",
  "Cough",
  "Dehydration",
  "Diarrhea",
  "Dizziness and Vertigo",
  "Dropsy (see Edema)",
  "Dysentery (see Diarrhea)",
  "Dysfunctional uterine bleeding (see Vaginal Bleeding)",
  "Dyspepsia (see Indigestion)",
  "Dyspnea (see Breathing Problems)",
  "Edema",
  "Fainting",
  "Fatigue",
  "Fever",
  "Flatulence (see Gas)",
  "Frostbite",
  "Frostnip (see Frostbite)",
  "Gas",
  "Gastrointestinal Bleeding",
  "GI Bleeding (see Gastrointestinal Bleeding)",
  "Halitosis (see Bad Breath)",
  "Headache",
  "Heartburn",
  "Heat Exhaustion (see Heat Illness)",
  "Heat Illness",
  "Heimlich Maneuver (see Choking)",
  "Hematoma (see Bleeding)",
  "Hemorrhage (see Bleeding)",
  "Hives",
  "Hot (Temperature) (see Fever; Heat Illness)",
  "Hypothermia",
  "Icterus (see Jaundice)",
  "Indigestion",
  "Itching",
  "Jaundice",
  "Kernicterus (see Jaundice)",
  "Language Problems (see Speech and Communication Disorders)",
  "Motion Sickness",
  "Nausea and Vomiting",
  "Pain",
  "Pain, Abdominal (see Abdominal Pain)",
  "Pain, Chest (see Chest Pain)",
  "Pain, Chronic (see Chronic Pain)",
  "Pelvic Pain",
  "Pruritus (see Itching)",
  "Pyrexia (see Fever)",
  "Rare Diseases",
  "Raynaud Phenomenon",
  "Raynaud's Disease (see Raynaud Phenomenon)",
  "Raynaud's Syndrome (see Raynaud Phenomenon)",
  "Rectal Bleeding (see Gastrointestinal Bleeding)",
  "Sciatica",
  "Seasickness (see Motion Sickness)",
  "Shortness of Breath (see Breathing Problems)",
  "Speech and Communication Disorders",
  "Stammering (see Stuttering)",
  "Stomach Ache (see Abdominal Pain)",
  "Stuttering",
  "Sunstroke (see Heat Illness)",
  "Swelling (see Edema)",
  "Syncope (see Fainting)",
  "Tachypnea (see Breathing Problems)",
  "Tension Headache (see Headache)",
  "Thirst (see Dehydration)",
  "Tiredness (see Fatigue)",
  "Upset Stomach (see Indigestion)",
  "Urticaria (see Hives)",
  "Uterine bleeding (see Vaginal Bleeding)",
  "Vaginal Bleeding",
  "Vascular Headache (see Headache)",
  "Vasovagal Syncope (see Fainting)",
  "Vertigo (see Dizziness and Vertigo)",
  "Vestibular Diseases (see Dizziness and Vertigo)",
  "Vomiting (see Nausea and Vomiting)",
  "Weariness (see Fatigue)",
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
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-3 text-lg"
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
