"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import SymptomPage from "./symptom-page";
import FindingsPage from "./findings-page";
import DiagnosisPage from "./diagnosis-page";
import MedicinePage from "./medicine-page";
import InvestigationsPage from "./investigations-page";

type PrescriptionItem = { id: string; name: string };
type MedicineItem = PrescriptionItem & {
  timesPerDay: string;
  durationDays: string;
  timing: string;
};

export default function PrescriptionPage() {
  const [activeMainTab, setActiveMainTab] = useState("previous");
  const [activeNewTab, setActiveNewTab] = useState("symptoms");
  const [symptoms, setSymptoms] = useState<PrescriptionItem[]>([]);
  const [findings, setFindings] = useState<PrescriptionItem[]>([]);
  const [diagnoses, setDiagnoses] = useState<PrescriptionItem[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [investigations, setInvestigations] = useState<PrescriptionItem[]>([]);
  const [investigationNotes, setInvestigationNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
  const [medicineReminder, setMedicineReminder] = useState({
    message: false,
    call: false,
  });
  const [medicineInstructions, setMedicineInstructions] = useState("");

  const savePrescription = useMutation(api.prescriptions.savePrescription);

  const handleSubmit = async () => {
    const patientId = "121"; // Replace with actual value or state
    const doctorId = "121"; // Replace with actual value or state

    const newPrescription = {
      symptoms,
      findings,
      diagnoses,
      medicines,
      investigations,
      investigationNotes,
      followUpDate: followUpDate ? followUpDate.toISOString() : undefined,
      medicineReminder,
      medicineInstructions,
      patientId,
      doctorId,
    };

    try {
      await savePrescription(newPrescription);
      console.log("Prescription saved successfully.");
      // Clear form data
      setSymptoms([]);
      setFindings([]);
      setDiagnoses([]);
      setMedicines([]);
      setInvestigations([]);
      setInvestigationNotes("");
      setFollowUpDate(undefined);
      setMedicineReminder({ message: false, call: false });
      setMedicineInstructions("");
      setActiveMainTab("previous"); // Switch back to 'Previous Prescription' tab
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
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
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
            >
              Previous Prescription
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
            >
              New Prescription
            </TabsTrigger>
          </TabsList>

          <div className="h-[600px] overflow-hidden">
            <TabsContent value="previous" className="h-full">
              <ScrollArea className="h-full pr-4">
                <h3 className="text-2xl font-semibold mb-4">
                  Previous Prescriptions
                </h3>
                {/* Render previous prescriptions if any */}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="new" className="h-full">
              <ScrollArea className="h-full">
                <Tabs
                  value={activeNewTab}
                  onValueChange={setActiveNewTab}
                  className="space-y-6"
                >
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-14 text-lg">
                    <TabsTrigger
                      value="symptoms"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
                    >
                      Symptoms
                    </TabsTrigger>
                    <TabsTrigger
                      value="findings"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
                    >
                      Findings
                    </TabsTrigger>
                    <TabsTrigger
                      value="diagnosis"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
                    >
                      Diagnosis
                    </TabsTrigger>
                    <TabsTrigger
                      value="medicine"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
                    >
                      Medicine
                    </TabsTrigger>
                    <TabsTrigger
                      value="investigations"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
                    >
                      Investigations
                    </TabsTrigger>
                    <TabsTrigger
                      value="followup"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-primary transition-colors"
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
                    <FindingsPage
                      findings={findings}
                      setFindings={setFindings}
                    />
                  </TabsContent>
                  <TabsContent value="diagnosis">
                    <DiagnosisPage
                      diagnoses={diagnoses}
                      setDiagnoses={setDiagnoses}
                    />
                  </TabsContent>
                  <TabsContent value="medicine">
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
                              variant="outline"
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
                              className="p-5"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    className="relative px-6 py-3 bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10">Submit Prescription</span>
                  </Button>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
