"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserCircle } from "lucide-react";
import PrescriptionPage from "@/components/pages/Prescription";
import LabReportPage from "@/components/pages/lab-report-page";
import BillingPage from "@/components/pages/billing-page";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import VaccinationPage from "@/components/pages/VaccinationPage";
import MedicalHistoryPage from "@/components/pages/MedicalHistoryPage";

interface PatientCardProps {
  name: string;
  gender: string;
  age: string;
  isHighlighted?: boolean;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  name,
  gender,
  age,
  isHighlighted = false,
  onClick,
}) => (
  <Card
    className={`mb-2 p-2 cursor-pointer ${
      isHighlighted
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    <CardContent className="p-2">
      <div className="flex justify-between items-center">
        <p
          className={`font-medium text-sm ${isHighlighted ? "text-white" : ""}`}
        >
          {name}
        </p>
        <p
          className={`text-xs ${isHighlighted ? "text-white" : "text-muted-foreground"}`}
        >
          {gender}, {age}
        </p>
      </div>
    </CardContent>
  </Card>
);

const PatientProfile: React.FC<{ patientId: number | null }> = ({
  patientId,
}) => {
  const patientInfo = patientId
    ? useQuery(api.patients.getPatientById, { patientId })
    : null;

  if (!patientId) return <div className="p-4">No patient selected</div>;
  if (patientInfo === undefined) return <div className="p-4">Loading...</div>;
  if (patientInfo === null)
    return <div className="p-4 text-red-500">Error: Patient not found</div>;

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
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

  const age = calculateAge(patientInfo.dateOfBirth);

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg">{`${patientInfo.firstName} ${patientInfo.lastName}`}</h2>
      <p>
        <strong>Gender:</strong> {patientInfo.gender}
      </p>
      <p>
        <strong>Age:</strong> {age} years
      </p>
      <p>
        <strong>Phone:</strong> {patientInfo.phoneNumber}
      </p>
    </div>
  );
};

const Sidebar: React.FC<{
  onPatientSelect: (patientId: number) => void;
  selectedPatientId: number | null;
}> = ({ onPatientSelect, selectedPatientId }) => {
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

  return (
    <aside className="w-64 overflow-y-auto border-r p-4 flex flex-col h-full">
      <h2 className="mb-4 font-semibold">Today's Patients ({totalPatients})</h2>

      <div className="mb-6 flex-grow">
        <h3 className="text-sm font-medium mb-2">
          On Queue ({onQueuePatients.length})
        </h3>
        <div>
          {onQueuePatients.map((appointment) => (
            <PatientCard
              key={appointment.id}
              name={appointment.patientId}
              gender=""
              age=""
              isHighlighted={
                selectedPatientId === Number(appointment.patientId)
              }
              onClick={() => onPatientSelect(Number(appointment.patientId))}
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
              name={appointment.patientId}
              gender=""
              age=""
              isHighlighted={
                selectedPatientId === Number(appointment.patientId)
              }
              onClick={() => onPatientSelect(Number(appointment.patientId))}
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
  selectedPatientId: number | null;
}> = ({ setSelectedSection, selectedSection, selectedPatientId }) => {
  const patientInfo = selectedPatientId
    ? useQuery(api.patients.getPatientById, { patientId: selectedPatientId })
    : null;

  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="flex flex-wrap gap-2">
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="p-0 flex flex-col items-center">
            <UserCircle
              className="h-12 w-12 text-blue-500"
              aria-hidden="true"
            />
            <span className="text-sm font-medium mt-1">
              {selectedPatientId
                ? patientInfo === undefined
                  ? "Loading..."
                  : patientInfo === null
                    ? "Not Found"
                    : patientInfo.firstName
                : "Select Patient"}
            </span>
            <span className="sr-only">View patient profile</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {selectedPatientId ? (
            <PatientProfile patientId={selectedPatientId} />
          ) : (
            <div className="p-4">Please select a patient</div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default function Component() {
  const [selectedSection, setSelectedSection] = useState("overview");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
    setSelectedSection("overview");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-1 overflow-hidden w-full mt-10">
        <Sidebar
          onPatientSelect={handlePatientSelect}
          selectedPatientId={selectedPatientId}
        />
        <main className="flex-1 overflow-y-auto p-4">
          <ActionButtons
            setSelectedSection={setSelectedSection}
            selectedSection={selectedSection}
            selectedPatientId={selectedPatientId}
          />
          {selectedSection === "overview" && <MedicalHistoryPage />}
          {selectedSection === "prescription" && <PrescriptionPage />}
          {selectedSection === "vaccination" && <VaccinationPage />}
          {selectedSection === "labReports" && <LabReportPage />}
          {selectedSection === "billing" && <BillingPage />}
        </main>
      </div>
    </div>
  );
}
