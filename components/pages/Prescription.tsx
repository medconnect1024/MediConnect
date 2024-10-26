"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, ChevronRight, ChevronLeft, Eye, X } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import SymptomPage from "./symptom-page";
import FindingsPage from "./findings-page";
import DiagnosisPage from "./diagnosis-page";
import MedicinePage from "./medicine-page";
import InvestigationsPage from "./investigations-page";

type PrescriptionItem = { id: string; name: string };

type MedicineItem = {
  id: string;
  name: string;
  timesPerDay: string;
  durationDays: string;
  timing: string;
};

const steps = [
  "Symptoms",
  "Findings",
  "Diagnosis",
  "Medicine",
  "Investigations",
  "Follow-Up",
];

export default function MultiStepPrescription() {
  const [activeStep, setActiveStep] = useState(0);
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
  const [showPreview, setShowPreview] = useState(false);
  const [previousPrescriptions, setPreviousPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const savePrescription = useMutation(api.prescriptions.savePrescription);

  const handleSubmit = async () => {
    const patientId = "121"; // Replace with actual value or state
    const doctorId = "121"; // Replace with actual value or state

    const newPrescription = {
      doctorId,
      patientId,
      medicines,
      symptoms,
      findings: findings.map((f) => ({ id: f.id, description: f.name })),
      diagnoses,
      investigations,
      investigationNotes,
      followUpDate: followUpDate ? followUpDate.toISOString() : undefined,
      medicineReminder,
      medicineInstructions,
    };

    try {
      const result = await savePrescription(newPrescription);
      setSaveSuccess(true);
      // Clear form data and reset to first step
      setSymptoms([]);
      setFindings([]);
      setDiagnoses([]);
      setMedicines([]);
      setInvestigations([]);
      setInvestigationNotes("");
      setFollowUpDate(undefined);
      setMedicineReminder({ message: false, call: false });
      setMedicineInstructions("");
      setActiveStep(0);
      setShowPreview(false);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  const renderPreviousPrescriptions = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Previous Prescriptions</h3>
      {previousPrescriptions.length === 0 ? (
        <p>No previous prescriptions found.</p>
      ) : (
        previousPrescriptions.map((prescription, index) => (
          <Card key={index}>
            <CardContent>
              <p>Prescription {index + 1}</p>
              {/* Add more details as needed */}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SymptomPage symptoms={symptoms} setSymptoms={setSymptoms} />;
      case 1:
        return <FindingsPage findings={findings} setFindings={setFindings} />;
      case 2:
        return (
          <DiagnosisPage diagnoses={diagnoses} setDiagnoses={setDiagnoses} />
        );
      case 3:
        return (
          <MedicinePage
            medicines={medicines}
            setMedicines={setMedicines}
            medicineInstructions={medicineInstructions}
            setMedicineInstructions={setMedicineInstructions}
            medicineReminder={medicineReminder}
            setMedicineReminder={setMedicineReminder}
          />
        );
      case 4:
        return (
          <InvestigationsPage
            investigations={investigations}
            setInvestigations={setInvestigations}
            investigationNotes={investigationNotes}
            setInvestigationNotes={setInvestigationNotes}
          />
        );
      case 5:
        return (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Follow-Up</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 justify-between">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full sm:w-[280px] justify-start text-left font-normal ${
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
                    onSelect={(date) => {
                      setFollowUpDate(date);
                      document.body.click(); // This will close the popover
                    }}
                    initialFocus
                    className="p-5"
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={() => setShowPreview(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-4 py-2 flex items-center rounded-md shadow-md justify-center sm:justify-end"
              >
                <Eye className="mr-2" /> Preview Prescription
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreview = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Prescription Preview</h3>
      <div>
        <h4 className="text-lg font-semibold">Symptoms</h4>
        <ul className="list-disc pl-5">
          {symptoms.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Findings</h4>
        <ul className="list-disc pl-5">
          {findings.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Diagnosis</h4>
        <ul className="list-disc pl-5">
          {diagnoses.map((d) => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Medicines</h4>
        <ul className="list-disc pl-5">
          {medicines.map((m) => (
            <li key={m.id}>
              {m.name} - {m.timesPerDay} times per day for {m.durationDays} days
              ({m.timing})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Investigations</h4>
        <ul className="list-disc pl-5">
          {investigations.map((i) => (
            <li key={i.id}>{i.name}</li>
          ))}
        </ul>
        <p>Notes: {investigationNotes}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Follow-Up</h4>
        <p>
          {followUpDate ? format(followUpDate, "PPP") : "No follow-up date set"}
        </p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Medicine Instructions</h4>
        <p>{medicineInstructions || "No specific instructions provided."}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Medicine Reminders</h4>
        <p>
          {medicineReminder.message
            ? "Send message reminders"
            : "No message reminders"}
          <br />
          {medicineReminder.call ? "Send call reminders" : "No call reminders"}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto min-h-screen sm:min-h-[600px] relative">
      <CardHeader>
        <CardTitle className="text-3xl">Prescription Management</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[calc(100vh-200px)] sm:min-h-[400px]">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <Button
              onClick={() => setActiveTab("previous")}
              variant={activeTab === "previous" ? "default" : "outline"}
              className={`w-full sm:w-auto ${activeTab === "previous" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              Previous Prescriptions
            </Button>
            <Button
              onClick={() => setActiveTab("new")}
              variant={activeTab === "new" ? "default" : "outline"}
              className={`w-full sm:w-auto ${activeTab === "new" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              New Prescription
            </Button>
          </div>
          {activeTab === "new" && (
            <div className="flex items-center justify-between w-full">
              {/* Previous Button */}
              <Button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronLeft className="mr-2" />
              </Button>

              {/* Steps Container */}
              <div className="flex-grow flex justify-center space-x-1 mx-5">
                {steps.map((step, index) => (
                  <Button
                    key={step}
                    onClick={() => setActiveStep(index)}
                    variant={activeStep === index ? "default" : "outline"}
                    className={`${
                      activeStep === index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } w-full text-center text-sm py-2`}
                  >
                    {step}
                  </Button>
                ))}
              </div>

              {/* Next Button */}
              <Button
                onClick={() =>
                  setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))
                }
                disabled={activeStep === steps.length - 1}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronRight className="ml-2" />
              </Button>
            </div>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-400px)] sm:h-[400px] pr-4">
          {activeTab === "new"
            ? renderStepContent(activeStep)
            : renderPreviousPrescriptions()}
        </ScrollArea>
      </CardContent>
      {saveSuccess && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in-out">
          Prescription Saved Successfully!
        </div>
      )}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prescription Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-200px)]">
            {renderPreview()}
          </ScrollArea>
          <DialogFooter className="sm:justify-between">
            <Button
              onClick={() => setShowPreview(false)}
              variant="outline"
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
