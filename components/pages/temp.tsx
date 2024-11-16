"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import SymptomPage from "./symptom-page";
import FindingsPage from "./findings-page";
import DiagnosisPage from "./diagnosis-page";
import MedicinePage from "./medicine-page";
import InvestigationsPage from "./investigations-page";
import { Id } from "@/convex/_generated/dataModel";
import EnhancedPreviousPrescriptions from "./previous-prescriptions";
import EnhancedPrescriptionPreview from "./prescription-preview";
import { jsPDF } from "jspdf";
import { handleWatiWebhook } from "@/convex/watiWebhook";

const WATI_API_URL = 'https://live-mt-server.wati.io/320742'
const WATI_API_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MWE5NTVhZS02YmM4LTRjMGQtYTljZS00OTU3MzIxZTI0ZGEiLCJ1bmlxdWVfbmFtZSI6Im15bWVkaXJlY29yZHNAZ21haWwuY29tIiwibmFtZWlkIjoibXltZWRpcmVjb3Jkc0BnbWFpbC5jb20iLCJlbWFpbCI6Im15bWVkaXJlY29yZHNAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDYvMjkvMjAyNCAxMDoxMToyMiIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJ0ZW5hbnRfaWQiOiIzMjA3NDIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.Nw-6g96C67FmE0qw0Up6f2Bl4W-x_WsEusImImV_7IU'
interface SendFileResponse {
  result: boolean;
  messageId: string;
}

async function sendFile(phoneNumber: string, fileBlob: Blob, fileName: string, caption: string = ''): Promise<SendFileResponse> {
  console.log(`Attempting to send file to ${phoneNumber}: ${fileName}`);
  const url = `${WATI_API_URL}/api/v1/sendSessionFile/${phoneNumber}`;

  try {
    const formData = new FormData();
    formData.append('file', fileBlob, fileName);
    formData.append('caption', caption);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': WATI_API_TOKEN,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send file: ${response.status}, ${errorText}`);
      throw new Error(`Failed to send file: ${response.status}, ${errorText}`);
    }

    console.log(`File sent successfully to ${phoneNumber}`);
    return await response.json() as SendFileResponse;
  } catch (error) {
    console.error(`Error in sendFile: ${error}`);
    throw error;
  }
}

type SymptomItem = {
  id: string;
  name: string;
  frequency: string;
  severity: string;
  duration: string;
};

type FindingItem = {
  id: string;
  name: string;
};

type MedicineItem = {
  id: string;
  name: string;
  dosage: string;
  route: string;
  timesPerDay: string;
  durationDays: string;
  timing: string;
};

type Prescription = {
  prescriptionId: string;
  symptoms: SymptomItem[];
  findings: FindingItem[];
  diagnoses: { id: string; name: string }[];
  medicines: MedicineItem[];
  investigations: { id: string; name: string }[];
  investigationNotes?: string;
  followUpDate?: string;
  medicineReminder: {
    message: boolean;
    call: boolean;
  };
  medicineInstructions?: string;
  chronicCondition: boolean;
  vitals: {
    temperature: string;
    bloodPressure: string;
    pulse: string;
  };
  severity?: "Mild" | "Moderate" | "Severe";
};

interface ApiPrescription {
  _id: Id<"prescriptions">;
  _creationTime: number;
  investigationNotes?: string;
  followUpDate?: string;
  medicineInstructions?: string;
  severity?: string;
  findings: { id: string; description: string }[];
  symptoms: SymptomItem[];
  diagnoses: { id: string; name: string }[];
  medicines: MedicineItem[];
  investigations: { id: string; name: string }[];
  medicineReminder: {
    message: boolean;
    call: boolean;
  };
  chronicCondition: boolean;
  vitals: {
    temperature: string;
    bloodPressure: string;
    pulse: string;
  };
}

interface MultiStepPrescriptionProps {
  patientId: number;
}

const steps = [
  "Symptoms",
  "Findings",
  "Diagnosis",
  "Medicine",
  "Investigations",
  "Follow-Up",
];

export default function MultiStepPrescription({
  patientId,
}: MultiStepPrescriptionProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [symptoms, setSymptoms] = useState<SymptomItem[]>([]);
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [diagnoses, setDiagnoses] = useState<{ id: string; name: string }[]>(
    []
  );
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [investigations, setInvestigations] = useState<
    { id: string; name: string }[]
  >([]);
  const [investigationNotes, setInvestigationNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
  const [medicineReminder, setMedicineReminder] = useState({
    message: false,
    call: false,
  });
  const [medicineInstructions, setMedicineInstructions] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previousPrescriptions, setPreviousPrescriptions] = useState<
    Prescription[]
  >([]);
  const [activeTab, setActiveTab] = useState("new");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [chronicCondition, setChronicCondition] = useState(false);
  const [vitals, setVitals] = useState({
    temperature: "",
    bloodPressure: "",
    pulse: "",
    height: "",
    weight: "",
    bmi: "",
    waistHip: "",
    spo2: "",
  });
  const [severity, setSeverity] = useState<"Mild" | "Moderate" | "Severe">(
    "Mild"
  );

  const savePrescription = useMutation(api.prescriptions.savePrescription);
  const generateUploadUrl = useMutation(api.labReports.generateUploadUrl);
  const getLastPrescriptionForPatient = useQuery(
    api.prescriptions.getLastPrescriptionForPatient,
    {
      patientId: patientId.toString(),
    }
  );
  const { user } = useUser();

  useEffect(() => {
    if (getLastPrescriptionForPatient) {
      const apiPrescription = getLastPrescriptionForPatient as ApiPrescription;
      setPreviousPrescriptions([
        {
          prescriptionId: apiPrescription._id,
          symptoms: apiPrescription.symptoms,
          findings: apiPrescription.findings.map((f) => ({
            id: f.id,
            name: f.description,
          })),
          diagnoses: apiPrescription.diagnoses,
          medicines: apiPrescription.medicines,
          investigations: apiPrescription.investigations,
          investigationNotes: apiPrescription.investigationNotes,
          followUpDate: apiPrescription.followUpDate,
          medicineReminder: apiPrescription.medicineReminder,
          medicineInstructions: apiPrescription.medicineInstructions,
          chronicCondition: apiPrescription.chronicCondition,
          vitals: apiPrescription.vitals,
          severity:
            (apiPrescription.severity as Prescription["severity"]) || undefined,
        },
      ]);
    }
  }, [getLastPrescriptionForPatient]);

  const generatePDF = async (prescriptionData: any) => {
    const doc = new jsPDF();
    let yPos = 30;
    const lineHeight = 7;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const clinicName = "HealthCare Clinic";
    const clinicAddress = "123 Medical Street, Healthville, HC 12345";
    const clinicPhone = "+1 (555) 123-4567";
    const clinicEmail = "info@healthcareclinic.com";

    const doctorName = "Dr. Jane Smith";
    const doctorSpecialty = "General Practitioner";
    const doctorLicense = "License No: MD12345";

    const addText = (text: string) => {
      doc.text(text, margin, yPos);
      yPos += lineHeight;
    };

    const addSection = (title: string, content: string) => {
      doc.setFontSize(14);
      addText(title);
      doc.setFontSize(12);
      addText(content);
      yPos += 5;
    };

    const addHeader = () => {
      doc.setFontSize(18);
      doc.setFont("undefined", "bold");
      doc.text(clinicName, pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("undefined", "normal");
      doc.text(clinicAddress, pageWidth / 2, 22, { align: "center" });
      doc.setFontSize(10);
      doc.text(
        `Phone: ${clinicPhone} | Email: ${clinicEmail}`,
        pageWidth / 2,
        29,
        { align: "center" }
      );
      doc.line(margin, 32, pageWidth - margin, 32);
    };

    const addFooter = () => {
      doc.setFontSize(10);
      doc.text(doctorName, margin, pageHeight - 20);
      doc.text(doctorSpecialty, margin, pageHeight - 15);
      doc.text(doctorLicense, margin, pageHeight - 10);
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        pageWidth - margin,
        pageHeight - 10,
        {
          align: "right",
        }
      );
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    };

    addHeader();

    doc.setFontSize(16);
    doc.setFont("undefined", "bold");
    yPos += lineHeight * 2;
    doc.text("Prescription", pageWidth / 2, yPos, { align: "center" });
    yPos += lineHeight * 2;

    doc.setFontSize(12);
    doc.setFont("undefined", "normal");

    addText(`Patient ID: ${prescriptionData.patientId}`);
    addText(`Doctor ID: ${prescriptionData.doctorId}`);
    addText(`Date: ${format(new Date(), "PPP")}`);
    yPos += 5;

    addSection(
      "Vitals",
      `Temperature: ${prescriptionData.vitals.temperature}, Blood Pressure: ${prescriptionData.vitals.bloodPressure}, ` +
        `Pulse: ${prescriptionData.vitals.pulse}, Height: ${prescriptionData.vitals.height}, Weight: ${prescriptionData.vitals.weight}, ` +
        `BMI: ${prescriptionData.vitals.bmi}, Waist/Hip: ${prescriptionData.vitals.waistHip}, SPO2: ${prescriptionData.vitals.spo2}`
    );

    addSection(
      "Symptoms",
      prescriptionData.symptoms
        .map(
          (s: SymptomItem) =>
            `${s.name} (Frequency: ${s.frequency}, Severity: ${s.severity}, Duration: ${s.duration})`
        )
        .join(", ")
    );

    addSection(
      "Findings",
      prescriptionData.findings.map((f: FindingItem) => f.name).join(", ")
    );

    addSection(
      "Diagnoses",
      prescriptionData.diagnoses.map((d: { name: string }) => d.name).join(", ")
    );
    addText(`Severity: ${prescriptionData.severity || "Not specified"}`);
    addText(
      `Chronic Condition: ${prescriptionData.chronicCondition ? "Yes" : "No"}`
    );

    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 30;
      addHeader();
    }

    addSection(
      "Medicines",
      prescriptionData.medicines
        .map(
          (m: MedicineItem) =>
            `${m.name} (Dosage: ${m.dosage}, Route: ${m.route}, Frequency: ${m.timesPerDay} times per day, ` +
            `Duration: ${m.durationDays} days, Timing: ${m.timing})`
        )
        .join("; ")
    );
    addText(`Instructions: ${prescriptionData.medicineInstructions || "None"}`);
    addText(
      `Reminders: ${prescriptionData.medicineReminder.message ? "Message" : ""}${prescriptionData.medicineReminder.message && prescriptionData.medicineReminder.call ? ", " : ""}${prescriptionData.medicineReminder.call ? "Call" : ""}`
    );

    addSection(
      "Investigations",
      prescriptionData.investigations
        .map((i: { name: string }) => i.name)
        .join(", ")
    );
    if (prescriptionData.investigationNotes) {
      addText(`Notes: ${prescriptionData.investigationNotes}`);
    }

    addSection(
      "Follow-up",
      prescriptionData.followUpDate
        ? format(new Date(prescriptionData.followUpDate), "PPP")
        : "No follow-up date set"
    );

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooter();
    }
   
   // const result = await sendFile('919535339196', doc.output("blob"), "prescription.pdf", "Your Prescription")

    return doc.output("blob");
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User not signed in");
      return;
    }

    const doctorId = user.id;
    const patientIdString = patientId.toString();

    const newPrescription = {
      doctorId,
      patientId: patientIdString,
      medicines: medicines.map((m) => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        route: m.route,
        timesPerDay: m.timesPerDay,
        durationDays: m.durationDays,
        timing: m.timing,
      })),
      symptoms: symptoms.map((s) => ({
        id: s.id,
        name: s.name,
        frequency: s.frequency,
        severity: s.severity,
        duration: s.duration,
      })),
      findings: findings.map((f) => ({ id: f.id, description: f.name })),
      diagnoses: diagnoses.map((d) => ({ id: d.id, name: d.name })),
      investigations: investigations.map((i) => ({ id: i.id, name: i.name })),
      investigationNotes,
      followUpDate: followUpDate ? followUpDate.toISOString() : undefined,
      medicineReminder,
      medicineInstructions,
      chronicCondition,
      vitals,
      severity,
    };

    try {
      // Generate PDF

      const patientId  = parseInt(newPrescription.patientId)
      console.log('newPrescription.patientId',newPrescription.patientId)
      const patient = useQuery(api.patients.getPatientById, {patientId})
      console.log('patient',patient)
      const pdfBlob = await generatePDF(newPrescription);

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
        },
        body: pdfBlob,
      });

      if (!result.ok) {
        throw new Error("Failed to upload file");
      }

      // Get the storageId from the upload response
      const { storageId } = await result.json();

      // Save prescription with storageId
      const savedPrescription = await savePrescription({
        ...newPrescription,
        storageId,
      });

      setSaveSuccess(true);
      // Reset all state variables
      setSymptoms([]);
      setFindings([]);
      setDiagnoses([]);
      setMedicines([]);
      setInvestigations([]);
      setInvestigationNotes("");
      setFollowUpDate(undefined);
      setMedicineReminder({ message: false, call: false });
      setMedicineInstructions("");
      setChronicCondition(false);
      setVitals({
        temperature: "",
        bloodPressure: "",
        pulse: "",
        height: "",
        weight: "",
        bmi: "",
        waistHip: "",
        spo2: "",
      });
      setSeverity("Mild");
      setActiveStep(0);
      setShowPreview(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  const renderPreviousPrescriptions = () => (
    <EnhancedPreviousPrescriptions prescriptions={previousPrescriptions} />
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SymptomPage symptoms={symptoms} setSymptoms={setSymptoms} />;
      case 1:
        return (
          <FindingsPage
            findings={findings}
            setFindings={setFindings}
            vitals={vitals}
            setVitals={setVitals}
          />
        );
      case 2:
        return (
          <DiagnosisPage
            diagnoses={diagnoses}
            setDiagnoses={setDiagnoses}
            severity={severity}
            setSeverity={setSeverity}
            chronicCondition={chronicCondition}
            setChronicCondition={setChronicCondition}
          />
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
                      document.body.click();
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
    <EnhancedPrescriptionPreview
      data={{
        patientId: patientId.toString(),
        doctorId: user?.id || "",
        symptoms,
        findings,
        diagnoses,
        medicines,
        investigations,
        investigationNotes,
        followUpDate,
        medicineReminder,
        medicineInstructions,
        chronicCondition,
        vitals,
        severity,
      }}
    />
  );

  return (
    <Card className="w-full max-w-6xl mx-auto min-h-screen sm:min-h-[600px] relative">
      <CardHeader>
        <CardTitle className="text-1xl">
          Prescription Management for Patient ID: {patientId}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[calc(100vh-200px)] sm:min-h-[400px]">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <Button
              onClick={() => setActiveTab("previous")}
              variant={activeTab === "previous" ? "default" : "outline"}
              className={`w-full sm:w-auto ${
                activeTab === "previous"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Previous Prescriptions
            </Button>
            <Button
              onClick={() => setActiveTab("new")}
              variant={activeTab === "new" ? "default" : "outline"}
              className={`w-full sm:w-auto ${
                activeTab === "new"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              New Prescription
            </Button>
          </div>
          {activeTab === "new" && (
            <div className="flex items-center justify-between w-full">
              <Button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronLeft className="mr-2" />
              </Button>
              <div className="flex-grow flex justify-center space-x-1 mx-5">
                {steps.map((step, index) => (
                  <Button
                    key={step}
                    onClick={() => setActiveStep(index)}
                    variant={activeStep === index ? "default" : "outline"}
                    className={`w-full text-center text-sm py-2 ${
                      activeStep === index
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {step}
                  </Button>
                ))}
              </div>
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
        <DialogContent className="max-w-4xl w-[90vw]">
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
              className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
