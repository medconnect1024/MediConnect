// MedicalHistoryPage.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MedicalHistoryPage: React.FC = () => (
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

export default MedicalHistoryPage;
