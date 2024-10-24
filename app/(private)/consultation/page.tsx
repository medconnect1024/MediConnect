"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserPlus } from "lucide-react";
import PrescriptionPage from "@/components/pages/Prescription";
import LabReportPage from "@/components/pages/lab-report-page";
import BillingPage from "@/components/pages/billing-page";

// PatientCard Component
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

// Sidebar Component
interface Patient {
  name: string;
  gender: string;
  age: string;
}

const Sidebar: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>("Harshil");

  const handlePatientClick = (patient: Patient) => {
    console.log(`Clicked on patient: ${patient.name}`);
    setSelectedPatient(patient.name); // Highlight the selected patient
  };

  const onQueuePatients: Patient[] = [
    { name: "Harshil", gender: "M", age: "35y 0m" },
    { name: "Priya", gender: "F", age: "28y 6m" },
    { name: "Rahul", gender: "M", age: "42y 3m" },
  ];

  const completedAppointments: Patient[] = [
    { name: "Vaibhav", gender: "M", age: "1y 10m" },
    { name: "Anita", gender: "F", age: "55y 2m" },
    { name: "Rajesh", gender: "M", age: "39y 8m" },
  ];

  const totalPatients = onQueuePatients.length + completedAppointments.length;

  return (
    <aside className="w-64 overflow-y-auto border-r p-4 flex flex-col h-full">
      <h2 className="mb-4 font-semibold">Today's Patients ({totalPatients})</h2>

      <div className="mb-6 flex-grow">
        <h3 className="text-sm font-medium mb-2">
          On Queue ({onQueuePatients.length})
        </h3>
        <div>
          {onQueuePatients.map((patient, index) => (
            <PatientCard
              key={index}
              name={patient.name}
              gender={patient.gender}
              age={patient.age}
              isHighlighted={selectedPatient === patient.name}
              onClick={() => handlePatientClick(patient)}
            />
          ))}
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-sm font-medium mb-2">
          Appointment Completed ({completedAppointments.length})
        </h3>
        <div>
          {completedAppointments.map((patient, index) => (
            <PatientCard
              key={index}
              name={patient.name}
              gender={patient.gender}
              age={patient.age}
              isHighlighted={selectedPatient === patient.name}
              onClick={() => handlePatientClick(patient)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

// ActionButtons Component
// ActionButtons Component
const ActionButtons: React.FC<{
  setSelectedSection: (section: string) => void;
  selectedSection: string; // Add selectedSection as a prop
}> = ({ setSelectedSection, selectedSection }) => (
  <div className="mb-4">
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedSection === "overview" ? "default" : "outline"} // Highlight if selected
        className={`${
          selectedSection === "overview"
            ? "bg-blue-500 text-white hover:bg-white hover:text-blue-500"
            : ""
        }`}
        onClick={() => setSelectedSection("overview")}
      >
        Overview
      </Button>

      <Button
        variant={selectedSection === "prescription" ? "default" : "outline"} // Highlight if selected
        className={`${
          selectedSection === "prescription"
            ? "bg-blue-500 text-white hover:bg-white hover:text-blue-500"
            : ""
        }`}
        onClick={() => setSelectedSection("prescription")}
      >
        Prescription
      </Button>
      <Button
        variant={selectedSection === "vaccination" ? "default" : "outline"} // Highlight if selected
        className={`${
          selectedSection === "vaccination"
            ? "bg-blue-500 text-white hover:bg-white hover:text-blue-500"
            : ""
        }`}
        onClick={() => setSelectedSection("vaccination")}
      >
        Vaccination
      </Button>
      <Button
        variant={selectedSection === "labReports" ? "default" : "outline"} // Highlight if selected
        className={`${
          selectedSection === "labReports"
            ? "bg-blue-500 text-white hover:bg-white hover:text-blue-500"
            : ""
        }`}
        onClick={() => setSelectedSection("labReports")}
      >
        Lab Reports
      </Button>
      <Button
        variant={selectedSection === "billing" ? "default" : "outline"} // Highlight if selected
        className={`${
          selectedSection === "billing"
            ? "bg-blue-500 text-white hover:bg-white hover:text-blue-500"
            : ""
        }`}
        onClick={() => setSelectedSection("billing")}
      >
        Billing
      </Button>

      <div className="flex items-center space-x-4 justify-end ml-auto">
        <div className="flex items-center space-x-2">
          <div
            className="h-8 w-8 rounded-full bg-blue-500"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">Harshil</p>
            <p className="text-sm text-muted-foreground">Male, 35y AS1136</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// MedicalHistoryCard Component
const MedicalHistoryCard: React.FC = () => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-base font-medium">Medical History</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {[
          { label: "Medical problems", value: "Diabetes" },
          { label: "Diabetes since", value: "1-2 years" },
          { label: "Diabetes medication", value: "Yes" },
          { label: "Medication", value: "Insulin (80 iu) - 7 daily" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// VaccinationCard Component
const VaccinationCard: React.FC = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center p-6">
      <svg
        className="h-12 w-12 text-muted-foreground"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.875 6.27A2.225 2.225 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1-2.184 0l-6.75-4.27A2.225 2.225 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
        <path d="m10 16 2 2 4-4" />
      </svg>
      <p className="mt-2 text-sm text-muted-foreground">
        No vaccination records found.
      </p>
    </CardContent>
  </Card>
);

// Main Component
export default function Component() {
  const [selectedSection, setSelectedSection] = useState("overview");

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-1 overflow-hidden w-full mt-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <ActionButtons
            setSelectedSection={setSelectedSection}
            selectedSection={selectedSection} // Pass selectedSection here
          />
          {/* Conditionally render sections based on the selected section */}
          {selectedSection === "overview" && <MedicalHistoryCard />}
          {selectedSection === "prescription" && <PrescriptionPage />}{" "}
          {selectedSection === "vaccination" && <VaccinationCard />}
          {selectedSection === "labReports" && <LabReportPage />}
          {selectedSection === "billing" && <BillingPage />}
          {/* Add more sections as needed */}
        </main>
      </div>
    </div>
  );
}
