"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

// Define the props interface to include patientId
interface VaccinationPageProps {
  patientId: number | null;
}

const VaccinationPage: React.FC<VaccinationPageProps> = ({ patientId }) => {
  // Handle the case where patientId is null or not provided
  if (patientId === null) {
    return <div>Please select a patient</div>;
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        {/* Display the patientId */}
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Patient ID</p>
          <p className="text-lg font-medium">{patientId}</p>
        </div>

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
};

export default VaccinationPage;
