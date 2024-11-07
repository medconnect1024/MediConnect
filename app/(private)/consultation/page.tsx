"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PrescriptionPage from "@/components/pages/Prescription";
import LabReportPage from "@/components/pages/lab-report-page";
import BillingPage from "@/components/pages/billing-page";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import VaccinationPage from "@/components/pages/VaccinationPage";
import MedicalHistoryPage from "@/components/pages/MedicalHistoryPage";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PatientCardProps {
  patientId: number;
  isSelected: boolean;
  onClick: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patientId,
  isSelected,
  onClick,
  isOpen,
  onOpenChange,
}) => {
  const patientInfo = useQuery(api.patients.getPatientById, { patientId });

  if (!patientInfo) return null;

  const { firstName, lastName, gender, dateOfBirth, phoneNumber } = patientInfo;

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dateOfBirth);

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Card
          className={`mb-2 p-2 cursor-pointer ${
            isSelected
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "hover:bg-gray-100"
          }`}
          onClick={onClick}
        >
          <CardContent className="p-2">
            <div className="flex justify-between items-center">
              <p
                className={`font-medium text-sm ${isSelected ? "text-white" : ""}`}
              >
                {firstName}
              </p>
              <div className="flex items-center">
                <p
                  className={`text-xs mr-2 ${isSelected ? "text-white" : "text-muted-foreground"}`}
                >
                  {gender}, {age} years
                </p>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2">
        <div
          className={`p-2 rounded-b-md ${isSelected ? "bg-blue-400" : "bg-gray-100"}`}
        >
          <p className="text-sm">
            <strong>Name:</strong>
            {firstName} {lastName}
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> {phoneNumber}
          </p>
          <p className="text-sm">
            <strong>Date of Birth:</strong>{" "}
            {new Date(dateOfBirth).toLocaleDateString()}
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar: React.FC<{
  onPatientSelect: (patientId: number) => void;
  selectedPatientId: number | null;
  openPatientId: number | null;
  setOpenPatientId: (patientId: number | null) => void;
}> = ({
  onPatientSelect,
  selectedPatientId,
  openPatientId,
  setOpenPatientId,
}) => {
  const appointments = useQuery(api.patients.getAppointments);

  const onQueuePatients =
    appointments?.filter((appointment) => appointment.status === "Scheduled") ||
    [];
  const completedAppointments =
    appointments?.filter((appointment) => appointment.status === "Completed") ||
    [];

  const totalPatients = onQueuePatients.length + completedAppointments.length;

  useEffect(() => {
    if (onQueuePatients.length > 0 && !selectedPatientId) {
      onPatientSelect(Number(onQueuePatients[0].patientId));
    }
  }, [onQueuePatients, selectedPatientId, onPatientSelect]);

  const handlePatientClick = (patientId: number) => {
    onPatientSelect(patientId);
    setOpenPatientId(patientId === openPatientId ? null : patientId);
  };

  return (
    <aside className="w-full md:w-64 overflow-y-auto border-r p-4 flex flex-col h-full">
      <h2 className="mb-4 font-semibold">Today's Patients ({totalPatients})</h2>

      <div className="mb-6 flex-grow">
        <h3 className="text-sm font-medium mb-2">
          On Queue ({onQueuePatients.length})
        </h3>
        <div>
          {onQueuePatients.map((appointment) => (
            <PatientCard
              key={appointment.id}
              patientId={Number(appointment.patientId)}
              isSelected={selectedPatientId === Number(appointment.patientId)}
              onClick={() => handlePatientClick(Number(appointment.patientId))}
              isOpen={openPatientId === Number(appointment.patientId)}
              onOpenChange={(open) =>
                setOpenPatientId(open ? Number(appointment.patientId) : null)
              }
            />
          ))}
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-sm font-medium mb-2">
          Appointment Completed ({completedAppointments.length})
        </h3>
        <div>
          {completedAppointments.map((appointment) => (
            <PatientCard
              key={appointment.id}
              patientId={Number(appointment.patientId)}
              isSelected={selectedPatientId === Number(appointment.patientId)}
              onClick={() => handlePatientClick(Number(appointment.patientId))}
              isOpen={openPatientId === Number(appointment.patientId)}
              onOpenChange={(open) =>
                setOpenPatientId(open ? Number(appointment.patientId) : null)
              }
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

const ActionButtons: React.FC<{
  setSelectedSection: (section: string) => void;
  selectedSection: string;
}> = ({ setSelectedSection, selectedSection }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button
        variant={selectedSection === "overview" ? "default" : "outline"}
        className={
          selectedSection === "overview"
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : ""
        }
        onClick={() => setSelectedSection("overview")}
      >
        Overview
      </Button>
      <Button
        variant={selectedSection === "prescription" ? "default" : "outline"}
        className={
          selectedSection === "prescription"
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : ""
        }
        onClick={() => setSelectedSection("prescription")}
      >
        Prescription
      </Button>
      <Button
        variant={selectedSection === "vaccination" ? "default" : "outline"}
        className={
          selectedSection === "vaccination"
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : ""
        }
        onClick={() => setSelectedSection("vaccination")}
      >
        Vaccination
      </Button>
      <Button
        variant={selectedSection === "labReports" ? "default" : "outline"}
        className={
          selectedSection === "labReports"
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : ""
        }
        onClick={() => setSelectedSection("labReports")}
      >
        Lab Reports
      </Button>
      <Button
        variant={selectedSection === "billing" ? "default" : "outline"}
        className={
          selectedSection === "billing"
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : ""
        }
        onClick={() => setSelectedSection("billing")}
      >
        Billing
      </Button>
    </div>
  );
};

export default function Component() {
  const [selectedSection, setSelectedSection] = useState("overview");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [openPatientId, setOpenPatientId] = useState<number | null>(null);

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
    // Remove this line to maintain the current section when switching patients
    // setSelectedSection("overview");
  };

  return (
    <div className="w-full h-full flex flex-col mt-16 md:flex-row">
      <Sidebar
        onPatientSelect={handlePatientSelect}
        selectedPatientId={selectedPatientId}
        openPatientId={openPatientId}
        setOpenPatientId={setOpenPatientId}
      />
      <main className="flex-1 overflow-y-auto p-4">
        <ActionButtons
          setSelectedSection={setSelectedSection}
          selectedSection={selectedSection}
        />
        {selectedPatientId !== null ? (
          <>
            {selectedSection === "overview" && (
              <MedicalHistoryPage patientId={selectedPatientId} />
            )}
            {selectedSection === "prescription" && (
              <PrescriptionPage patientId={selectedPatientId} />
            )}
            {selectedSection === "vaccination" && (
              <VaccinationPage patientId={selectedPatientId} />
            )}
            {selectedSection === "labReports" && (
              <LabReportPage patientId={selectedPatientId} />
            )}
            {selectedSection === "billing" && (
              <BillingPage patientId={selectedPatientId} />
            )}
          </>
        ) : (
          <p className="text-center mt-4">No patients available.</p>
        )}
      </main>
    </div>
  );
}
