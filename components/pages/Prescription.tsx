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
import { CalendarIcon, ChevronRight, ChevronLeft, Eye } from "lucide-react";
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

    console.log("Attempting to save prescription:", newPrescription);

    try {
      console.log("Calling savePrescription mutation...");
      const result = await savePrescription(newPrescription);
      console.log("Prescription saved successfully. Result:", result);
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
      console.log("Form data cleared and reset to first step");
      setTimeout(() => setSaveSuccess(false), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Error saving prescription:", error);
      console.log("Error details:", JSON.stringify(error, null, 2));
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
              {/* Display prescription details here */}
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
        <ul>
          {symptoms.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Findings</h4>
        <ul>
          {findings.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Diagnosis</h4>
        <ul>
          {diagnoses.map((d) => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Medicines</h4>
        <ul>
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
        <ul>
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
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Prescription Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              onClick={() => setActiveTab("previous")}
              variant={activeTab === "previous" ? "default" : "outline"}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Previous Prescriptions
            </Button>
            <Button
              onClick={() => setActiveTab("new")}
              variant={activeTab === "new" ? "default" : "outline"}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              New Prescription
            </Button>
          </div>
          {activeTab === "new" && (
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <Button
                  key={step}
                  onClick={() => setActiveStep(index)}
                  variant={activeStep === index ? "default" : "outline"}
                  className={`${
                    activeStep === index ? "bg-blue-600 text-white" : ""
                  } flex-1 mx-1`}
                >
                  {step}
                </Button>
              ))}
            </div>
          )}
        </div>
        <ScrollArea className="h-[500px] pr-4">
          {activeTab === "new"
            ? showPreview
              ? renderPreview()
              : renderStepContent(activeStep)
            : renderPreviousPrescriptions()}
        </ScrollArea>
        {activeTab === "new" && (
          <div className="mt-8 flex justify-between">
            <Button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="flex items-center bg-blue-600 text-white hover:bg-blue-700"
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center bg-secondary text-secondary-foreground"
            >
              <Eye className="mr-2" /> {showPreview ? "Edit" : "Preview"}
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Submit Prescription</span>
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))
                }
                className="flex items-center bg-blue-600 text-white hover:bg-blue-700"
              >
                Next <ChevronRight className="ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
      {saveSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in-out">
            Prescription Saved Successfully!
          </div>
        </div>
      )}
    </Card>
  );
}