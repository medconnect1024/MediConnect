"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SYMPTOMS = [
  "Abdominal Pain",
  "Acid Reflux",
  "Air sickness",
  "Bad Breath",
  "Belching",
  "Bellyache",
  "Bleeding",
  "Breath Odor",
  "Breathing Problems",
  "Bruises",
  "Burping",
  "Car sickness",
  "Chest Pain",
  "Chilblains",
  "Choking",
  "Chronic Pain",
  "Cluster Headache",
  "Cold (Temperature)",
  "Communication Disorders",
  "Constipation",
  "Contusions",
  "Cough",
  "Dehydration",
  "Diarrhea",
  "Dizziness and Vertigo",
  "Dropsy",
  "Dysentery",
  "Dysfunctional uterine bleeding",
  "Dyspepsia",
  "Dyspnea",
  "Edema",
  "Fainting",
  "Fever",
  "Flatulence",
  "Frostbite",
  "Frostnip",
  "Gas",
  "Gastrointestinal Bleeding",
  "Halitosis",
  "Headache",
  "Heartburn",
  "Heat Exhaustion",
  "Heat Illness",
  "Heimlich Maneuver",
  "Hematoma",
  "Hemorrhage",
  "Hives",
  "Hot (Temperature)",
  "Hypothermia",
  "Icterus",
  "Indigestion",
  "Itching",
  "Jaundice",
  "Kernicterus",
  "Language Problems",
  "Motion Sickness",
  "Nausea and Vomiting",
  "Pain",
  "Pelvic Pain",
  "Pruritus",
  "Pyrexia",
  "Rare Diseases",
  "Raynaud Phenomenon",
  "Raynaud's Disease",
  "Raynaud's Syndrome",
  "Rectal Bleeding",
  "Sciatica",
  "Sea sickness",
  "Shortness of Breath",
  "Speech and Communication Disorders",
  "Stammering",
  "Stomach Ache",
  "Stuttering",
  "Sunstroke",
  "Swelling",
  "Syncope",
  "Tachypnea",
  "Tension Headache",
  "Thirst",
  "Tiredness",
  "Upset Stomach",
  "Urticaria",
  "Uterine bleeding",
  "Vaginal Bleeding",
  "Vascular Headache",
  "Vasovagal Syncope",
  "Vertigo",
  "Vestibular Diseases",
  "Vomiting",
  "Weariness",
  "Acid and chemical burns",
  "Allergies",
  "Animal and human bites",
  "Ankle problems",
  "Back problems",
  "Blisters",
  "Bowel incontinence",
  "Breast pain",
  "Breast swelling in men",
  "Breathlessness and cancer",
  "Burns and scalds",
  "Calf problems",
  "Cancer-related fatigue",
  "Catarrh",
  "Chronic pain",
  "Cold sore",
  "Cuts and grazes",
  "Dehydration",
  "Diarrhoea",
  "Dizziness (light headedness)",
  "Dry mouth",
  "Earache",
  "Eating and digestion with cancer",
  "Elbow problems",
  "Farting",
  "Feeling of something in your throat (Globus)",
  "Fever in adults",
  "Fever in children",
  "Flu",
  "Foot problems",
  "Genital symptoms",
  "Hair loss and cancer",
  "Hay fever",
  "Headaches",
  "Hearing loss",
  "Hip problems",
  "Indigestion",
  "Insect bites and stings",
  "Itchy bottom",
  "Itching",
  "Knee problems",
  "Living well with COPD",
  "Living with chronic pain",
  "Migraine",
  "Mouth ulcer",
  "Neck problems",
  "Nipple discharge",
  "Nipple inversion (inside out nipple)",
  "Nosebleed",
  "Pain and cancer",
  "Skin rashes in children",
  "Shortness of breath",
  "Shoulder problems",
  "Soft tissue injury advice",
  "Sore throat",
  "Stomach ache and abdominal pain",
  "Sunburn",
  "Swollen glands",
  "Testicular lumps and swellings",
  "Thigh problems",
  "Tick bites",
  "Tinnitus",
  "Toothache",
  "Urinary incontinence",
  "Urinary incontinence in women",
  "Urinary tract infection (UTI)",
  "Urinary tract infection (UTI) in children",
  "Vaginal discharge",
  "Vertigo",
  "Vomiting in adults",
  "Vomiting in children and babies",
  "Warts and verrucas",
  "Wrist, hand and finger problems",
  "Abdominal pain",
  "Abdominal pain in children",
  "Absent periods",
  "Aches and pains",
  "Addiction withdrawal symptoms",
  "Amenorrhoea",
  "Anal pain",
  "Anosmia (loss of smell)",
  "Anxiety",
  "Anxiety in teenagers",
  "Black eye",
  "Blackouts",
  "Bleeding between periods",
  "Bleeding gums",
  "Bloating",
  "Blood in semen",
  "Blood in stool",
  "Blood in urine",
  "Blurred vision",
  "Brain fog",
  "Breathing problems",
  "Calf pain",
  "Car sick",
  "Changes to your appetite",
  "Confusion",
  "Coughing up blood",
  "COVID-19 symptoms",
  "Delusions",
  "Dental bleeding",
  "Depression",
  "Diarrhoea in children",
  "Disorientation",
  "Dizziness",
  "Excessive sweating",
  "Excessive worry",
  "Eye discharge",
  "Eye strain",
  "Facial droop",
  "Fecal incontinence",
  "Fatigue",
  "Feeling restless",
  "Feeling worthless",
  "Fluid from the ear",
  "Fluid retention",
  "Groin pain or swelling",
  "Gut pain",
  "Haematuria",
  "Haemoptysis",
  "Heart palpitations",
  "Heat rash",
  "Heavy periods",
  "Heel pain",
  "High temperature",
  "Hip pain",
  "Hyperhidrosis",
  "Incontinence (faecal)",
  "Insomnia",
  "Irregular periods",
  "Irritability and feeling on edge",
  "Itchy anus",
  "Itchy scalp",
  "Itchy skin",
  "Jaundice in adults",
  "Joint pain and swelling",
  "Knee pain",
  "Leg pain",
  "Lightheadedness",
  "Limb numbness",
  "Loose stools (diarrhoea)",
  "Losing interest",
  "Lower back pain",
  "Lumbago",
  "Menorrhagia",
  "Mental health signs of illness",
  "Miliaria",
  "Morning sickness",
  "Motion sickness",
  "Muscle aches and pains",
  "Nausea",
  "Nerve pain",
  "Night sweats",
  "Nose bleeds",
  "Pain (lower back)",
  "Pain and aches",
  "Pain in groin",
  "Painful sex (women)",
  "Palpitations",
  "Pelvic pain",
  "Penis injury",
  "Penis irritation",
  "Periods (heavy)",
  "Pharyngitis",
  "Prickly heat",
  "Pruritus ani",
  "Rectal bleeding",
  "Runny nose",
  "Sea sick",
  "Separation anxiety",
  "Shortness of breath",
  "Shoulder pain",
  "Signs of mental health issues",
  "Sore throat",
  "Spotting",
  "Stomach pain",
  "Summer rashes",
  "Sweating (excessive)",
  "Sweats (night)",
  "Swelling (in joints)",
  "Swelling in groin",
  "Swollen or painful testicle",
  "Symptoms of serious illness in babies and children",
  "Tachycardia",
  "Teenage anxiety",
  "Throwing up (vomiting)",
  "Toothache and Swelling",
  "Travel sickness",
  "Tummy pain",
  "Unpleasant thoughts",
  "Urinary retention",
  "Vaginal and groin irritation and infection",
  "Vaginal dryness",
  "Vomiting",
  "Vomiting (in children)",
  "Vomiting (mother)",
  "Watery stools (diarrhoea)",
  "Withdrawal symptoms from addiction",
];

const FREQUENCY_OPTIONS = [
  "1 time a day",
  "2 times a day",
  "More than 2 times a day",
  "Type your own",
];

const SEVERITY_OPTIONS = ["Mild", "Moderate", "Severe"];

const DURATION_OPTIONS = [
  "1 day",
  "2 days",
  "3 days",
  "More than one week",
  "Type your own",
];

type SymptomItem = {
  id: string;
  name: string;
  frequency: string;
  severity: string;
  duration: string;
};

interface SymptomPageProps {
  symptoms: SymptomItem[];
  setSymptoms: React.Dispatch<React.SetStateAction<SymptomItem[]>>;
}

export default function Component(
  { symptoms, setSymptoms }: SymptomPageProps = {
    symptoms: [],
    setSymptoms: () => {},
  }
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [newSymptom, setNewSymptom] = useState<SymptomItem>({
    id: "",
    name: "",
    frequency: "",
    severity: "",
    duration: "",
  });
  const [customFrequency, setCustomFrequency] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [isCustomFrequencyOpen, setIsCustomFrequencyOpen] = useState(false);
  const [isCustomDurationOpen, setIsCustomDurationOpen] = useState(false);

  const filteredSymptoms = useMemo(() => {
    if (!searchTerm) return [];
    return SYMPTOMS.filter((symptom) =>
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddItem = () => {
    if (newSymptom.name.trim()) {
      const symptomToAdd = {
        ...newSymptom,
        id: Date.now().toString(),
        frequency:
          newSymptom.frequency === "Type your own"
            ? customFrequency
            : newSymptom.frequency,
        duration:
          newSymptom.duration === "Type your own"
            ? customDuration
            : newSymptom.duration,
      };
      setSymptoms((prev) => [...prev, symptomToAdd]);
      setNewSymptom({
        id: "",
        name: "",
        frequency: "",
        severity: "",
        duration: "",
      });
      setCustomFrequency("");
      setCustomDuration("");
      setSearchTerm("");
      setIsSearching(false);
      setIsCustomFrequencyOpen(false);
      setIsCustomDurationOpen(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setSymptoms((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFrequencyChange = (value: string) => {
    if (value === "Type your own") {
      setIsCustomFrequencyOpen(true);
    } else {
      setIsCustomFrequencyOpen(false);
      setNewSymptom((prev) => ({ ...prev, frequency: value }));
    }
  };

  const handleDurationChange = (value: string) => {
    if (value === "Type your own") {
      setIsCustomDurationOpen(true);
    } else {
      setIsCustomDurationOpen(false);
      setNewSymptom((prev) => ({ ...prev, duration: value }));
    }
  };

  const addCustomFrequency = () => {
    if (customFrequency && !FREQUENCY_OPTIONS.includes(customFrequency)) {
      FREQUENCY_OPTIONS.push(customFrequency);
      setNewSymptom((prev) => ({ ...prev, frequency: customFrequency }));
      setCustomFrequency("");
      setIsCustomFrequencyOpen(false);
    }
  };

  const addCustomDuration = () => {
    if (customDuration && !DURATION_OPTIONS.includes(customDuration)) {
      DURATION_OPTIONS.push(customDuration);
      setNewSymptom((prev) => ({ ...prev, duration: customDuration }));
      setCustomDuration("");
      setIsCustomDurationOpen(false);
    }
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
              setNewSymptom((prev) => ({ ...prev, name: e.target.value }));
            }}
            onFocus={() => setIsSearching(true)}
            onBlur={() => {
              setTimeout(() => setIsSearching(false), 200);
            }}
          />
        </div>
        <Select
          value={newSymptom.frequency}
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Frequency" />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isCustomFrequencyOpen && (
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Custom frequency"
              value={customFrequency}
              onChange={(e) => setCustomFrequency(e.target.value)}
            />
            <Button variant="outline" onClick={addCustomFrequency}>
              Add
            </Button>
          </div>
        )}
        <Select
          value={newSymptom.severity}
          onValueChange={(value) =>
            setNewSymptom((prev) => ({ ...prev, severity: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            {SEVERITY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={newSymptom.duration}
          onValueChange={handleDurationChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isCustomDurationOpen && (
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Custom duration"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
            />
            <Button variant="outline" onClick={addCustomDuration}>
              Add
            </Button>
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-10"
          onClick={handleAddItem}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      {isSearching && filteredSymptoms.length > 0 && (
        <ul className="mt-4 space-y-2 absolute z-10 bg-background border rounded-md shadow-lg max-h-60 overflow-auto w-full max-w-[calc(100%-5rem)]">
          {filteredSymptoms.map((symptom) => (
            <li
              key={symptom}
              className="p-2 hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => {
                setNewSymptom((prev) => ({ ...prev, name: symptom }));
                setSearchTerm(symptom);
                setIsSearching(false);
              }}
            >
              {symptom}
            </li>
          ))}
        </ul>
      )}
      <ScrollArea className="h-[300px] mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symptom</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {symptoms.map((symptom) => (
              <TableRow key={symptom.id}>
                <TableCell>{symptom.name}</TableCell>
                <TableCell>{symptom.frequency}</TableCell>
                <TableCell>{symptom.severity}</TableCell>
                <TableCell>{symptom.duration}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleRemoveItem(symptom.id)}
                    className="text-red-500 hover:underline"
                  >
                    X
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
