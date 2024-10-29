"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Predefined constant array of medicine names
const MEDICINE_NAMES = [
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Metformin",
  "Aspirin",
  "Lisinopril",
  "Atorvastatin",
  "Simvastatin",
  "Levothyroxine",
  "Omeprazole",
];

type MedicineItem = {
  id: string;
  name: string;
  dosage: string;
  route: string;
  timesPerDay: string;
  durationDays: string;
  timing: string;
};

interface MedicinePageProps {
  medicines: MedicineItem[];
  setMedicines: React.Dispatch<React.SetStateAction<MedicineItem[]>>;
  medicineInstructions: string;
  setMedicineInstructions: React.Dispatch<React.SetStateAction<string>>;
  medicineReminder: { message: boolean; call: boolean };
  setMedicineReminder: React.Dispatch<
    React.SetStateAction<{ message: boolean; call: boolean }>
  >;
}

export default function MedicinePage({
  medicines,
  setMedicines,
  medicineInstructions,
  setMedicineInstructions,
  medicineReminder,
  setMedicineReminder,
}: MedicinePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newMedicine, setNewMedicine] = useState<Partial<MedicineItem>>({
    name: "",
    dosage: "",
    route: "",
    timesPerDay: "",
    durationDays: "",
    timing: "",
  });

  // Filter suggestions based on search term
  const filteredSuggestions = MEDICINE_NAMES.filter((medicineName) =>
    medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (
      newMedicine.name &&
      newMedicine.dosage &&
      newMedicine.route &&
      newMedicine.timesPerDay &&
      newMedicine.durationDays &&
      newMedicine.timing
    ) {
      const newMedicineItem: MedicineItem = {
        ...(newMedicine as MedicineItem),
        id: Date.now().toString(),
      };

      // Update the prescription page's state
      setMedicines((prev) => [...prev, newMedicineItem]);

      // Clear input fields after adding
      setNewMedicine({
        name: "",
        dosage: "",
        route: "",
        timesPerDay: "",
        durationDays: "",
        timing: "",
      });
      setSearchTerm("");
    }
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== id));
  };

  const handleSuggestionClick = (medicineName: string) => {
    setNewMedicine((prev) => ({ ...prev, name: medicineName }));
    setSearchTerm(medicineName); // Set the search term to the selected suggestion
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Medicine</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow w-48 ">
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-3 text-lg"
            placeholder="Search and add medicine"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setNewMedicine((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
          {searchTerm && filteredSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1">
              {filteredSuggestions.map((medicineName) => (
                <li
                  key={medicineName}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(medicineName)}
                >
                  {medicineName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Input
          placeholder="Dosage"
          value={newMedicine.dosage}
          onChange={(e) =>
            setNewMedicine((prev) => ({ ...prev, dosage: e.target.value }))
          }
          className="w-32"
        />
        <Select
          onValueChange={(value) =>
            setNewMedicine((prev) => ({ ...prev, route: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Route" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Oral">Oral</SelectItem>
            <SelectItem value="Intravenous">Intravenous</SelectItem>
            <SelectItem value="Intramuscular">Intramuscular</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setNewMedicine((prev) => ({ ...prev, timesPerDay: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Times per day" />
          </SelectTrigger>
          <SelectContent>
            {["1", "2", "3", "4"].map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setNewMedicine((prev) => ({ ...prev, durationDays: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Duration (days)" />
          </SelectTrigger>
          <SelectContent>
            {["1", "3", "5", "7", "10", "14", "30"].map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setNewMedicine((prev) => ({ ...prev, timing: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Timing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Before Food">Before Food</SelectItem>
            <SelectItem value="After Food">After Food</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-10"
          onClick={handleAddMedicine}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Times per Day</TableHead>
              <TableHead>Duration (Days)</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.dosage}</TableCell>
                <TableCell>{medicine.route}</TableCell>
                <TableCell>{medicine.timesPerDay}</TableCell>
                <TableCell>{medicine.durationDays}</TableCell>
                <TableCell>{medicine.timing}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMedicine(medicine.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <Textarea
        placeholder="Instructions for all medicines"
        value={medicineInstructions}
        onChange={(e) => setMedicineInstructions(e.target.value)}
        className="mt-4"
      />
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medicineReminderMessage"
            checked={medicineReminder.message}
            onCheckedChange={(checked) =>
              setMedicineReminder((prev) => ({
                ...prev,
                message: checked as boolean,
              }))
            }
          />
          <label
            htmlFor="medicineReminderMessage"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Message Reminder
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medicineReminderCall"
            checked={medicineReminder.call}
            onCheckedChange={(checked) =>
              setMedicineReminder((prev) => ({
                ...prev,
                call: checked as boolean,
              }))
            }
          />
          <label
            htmlFor="medicineReminderCall"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Call Reminder
          </label>
        </div>
      </div>
    </div>
  );
}
