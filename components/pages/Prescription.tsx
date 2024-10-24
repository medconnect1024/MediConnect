"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";

import SymptomPage from "./symptom-page";
// Import other pages as you create them
import FindingsPage from "./findings-page";
import DiagnosisPage from "./diagnosis-page";
import MedicinePage from "./medicine-page";
import InvestigationsPage from "./investigations-page";

type PrescriptionItem = {
  id: string;
  name: string;
};

type MedicineItem = PrescriptionItem & {
  timesPerDay: string;
  durationDays: string;
  timing: string;
};

type Prescription = {
  id: string;
  date: string;
  symptoms: string[];
  findings: string[];
  diagnosis: string[];
  medicines: MedicineItem[];
  investigations: string[];
  investigationNotes: string;
  followUpDate: Date | undefined;
  medicineReminder: { message: boolean; call: boolean };
  medicineInstructions: string;
};

export default function PrescriptionPage() {
  const [activeMainTab, setActiveMainTab] = useState("previous");
  const [activeNewTab, setActiveNewTab] = useState("symptoms");
  const [symptoms, setSymptoms] = useState<PrescriptionItem[]>([
    { id: "1", name: "Cough" },
    { id: "2", name: "Fever" },
  ]);
  const [findings, setFindings] = useState<PrescriptionItem[]>([
    { id: "1", name: "Throat Congestion" },
  ]);
  const [diagnoses, setDiagnoses] = useState<PrescriptionItem[]>([
    { id: "1", name: "Common Cold" },
  ]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: "1",
      name: "Paracetamol",
      timesPerDay: "3",
      durationDays: "5",
      timing: "After Food",
    },
  ]);
  const [investigations, setInvestigations] = useState<PrescriptionItem[]>([
    { id: "1", name: "CBC" },
  ]);
  const [investigationNotes, setInvestigationNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState<Date>();
  const [medicineReminder, setMedicineReminder] = useState({
    message: false,
    call: false,
  });
  const [medicineInstructions, setMedicineInstructions] = useState("");

  const [previousPrescriptions, setPreviousPrescriptions] = useState<
    Prescription[]
  >([
    {
      id: "1",
      date: "2023-05-15",
      symptoms: ["Fever", "Cough"],
      findings: ["Throat Congestion"],
      diagnosis: ["Common Cold"],
      medicines: [
        {
          id: "1",
          name: "Paracetamol",
          timesPerDay: "3",
          durationDays: "5",
          timing: "After Food",
        },
      ],
      investigations: ["CBC"],
      investigationNotes: "Check WBC count",
      followUpDate: new Date("2023-05-20"),
      medicineReminder: { message: true, call: false },
      medicineInstructions: "Take with warm water",
    },
  ]);

  const handlePrescriptionClick = (prescription: Prescription) => {
    console.log("Clicked prescription:", prescription);
    // Here you can add logic to show details or edit the prescription
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeMainTab}
          onValueChange={setActiveMainTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 h-14 text-lg">
            <TabsTrigger
              value="previous"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
            >
              Previous Prescription
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
            >
              New Prescription
            </TabsTrigger>
          </TabsList>
          <div className="h-[600px] overflow-hidden">
            <TabsContent value="previous" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    Previous Prescriptions
                  </h3>
                  {previousPrescriptions.map((prescription) => (
                    <Card
                      key={prescription.id}
                      className="mb-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handlePrescriptionClick(prescription)}
                    >
                      <CardContent className="p-6">
                        {/* Previous prescription content */}
                        {/* ... (keep the existing content for previous prescriptions) ... */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="new" className="h-full">
              <ScrollArea className="h-full">
                <Tabs
                  value={activeNewTab}
                  onValueChange={setActiveNewTab}
                  className="space-y-6"
                >
                  <TabsList className="grid w-full grid-cols-6 h-14 text-lg">
                    <TabsTrigger
                      value="symptoms"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Symptoms
                    </TabsTrigger>
                    <TabsTrigger
                      value="findings"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Findings
                    </TabsTrigger>
                    <TabsTrigger
                      value="diagnosis"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Diagnosis
                    </TabsTrigger>
                    <TabsTrigger
                      value="medicine"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Medicine
                    </TabsTrigger>
                    <TabsTrigger
                      value="investigations"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Investigations
                    </TabsTrigger>
                    <TabsTrigger
                      value="followup"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Follow-Up
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="symptoms">
                    <SymptomPage
                      symptoms={symptoms}
                      setSymptoms={setSymptoms}
                    />
                  </TabsContent>
                  <TabsContent value="findings">
                    {/* Replace with FindingsPage component when created */}
                    <div>Findings Page Placeholder</div>
                    <FindingsPage
                      findings={findings}
                      setFindings={setFindings}
                    />
                  </TabsContent>
                  <TabsContent value="diagnosis">
                    {/* Replace with DiagnosisPage component when created */}
                    <div>Diagnosis Page Placeholder</div>
                    <DiagnosisPage
                      diagnoses={diagnoses}
                      setDiagnoses={setDiagnoses}
                    />
                  </TabsContent>
                  <TabsContent value="medicine">
                    {/* Replace with MedicinePage component when created */}
                    <div>Medicine Page Placeholder</div>
                    <MedicinePage
                      medicines={medicines}
                      setMedicines={setMedicines}
                      medicineInstructions={medicineInstructions}
                      setMedicineInstructions={setMedicineInstructions}
                      medicineReminder={medicineReminder}
                      setMedicineReminder={setMedicineReminder}
                    />
                  </TabsContent>
                  <TabsContent value="investigations">
                    {/* Replace with InvestigationsPage component when created */}
                    <div>Investigations Page Placeholder</div>
                    <InvestigationsPage
                      investigations={investigations}
                      setInvestigations={setInvestigations}
                      investigationNotes={investigationNotes}
                      setInvestigationNotes={setInvestigationNotes}
                    />
                  </TabsContent>
                  <TabsContent value="followup">
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Follow-Up</h3>
                      <div className="flex items-center space-x-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-[280px] justify-start text-left font-normal ${
                                !followUpDate && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {followUpDate ? (
                                format(followUpDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={followUpDate}
                              onSelect={setFollowUpDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {followUpDate && (
                          <p>
                            After {differenceInDays(followUpDate, new Date())}{" "}
                            days
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button
                  className="mt-8 w-full py-6 text-xl bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    // Here you would typically save the new prescription
                    console.log("New Prescription:", {
                      symptoms,
                      findings,
                      diagnoses,
                      medicines,
                      medicineInstructions,
                      investigations,
                      investigationNotes,
                      followUpDate,
                      medicineReminder,
                    });
                    // Reset the form
                    // ... (keep the existing reset logic) ...
                  }}
                >
                  Save Prescription
                </Button>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
