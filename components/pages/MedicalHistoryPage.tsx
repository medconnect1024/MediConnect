"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the props interface to include patientId
interface MedicalHistoryPageProps {
  patientId: number | null;
}

const MedicalHistoryPage: React.FC<MedicalHistoryPageProps> = ({
  patientId,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure the component only renders after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle the case where patientId is null or not provided
  if (!isClient) {
    return null; // Avoid rendering during hydration mismatch
  }

  if (patientId === null) {
    return <div>Please select a patient</div>;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base font-medium">Medical History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Print the patientId */}
          <div>
            <p className="text-sm text-muted-foreground">Patient ID</p>
            <p>{patientId}</p>
          </div>

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
};

export default MedicalHistoryPage;
