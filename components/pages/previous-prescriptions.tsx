import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

interface EnhancedPreviousPrescriptionsProps {
  prescriptions: Prescription[];
}

export default function EnhancedPreviousPrescriptions({
  prescriptions,
}: EnhancedPreviousPrescriptionsProps) {
  const lastTwoPrescriptions = prescriptions.slice(0, 2);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Previous Prescriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {lastTwoPrescriptions.length === 0 ? (
            <p className="text-center text-gray-500">
              No previous prescriptions found.
            </p>
          ) : (
            lastTwoPrescriptions.map((prescription, index) => (
              <Card key={prescription.prescriptionId} className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Prescription {prescription.prescriptionId}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Vitals</h4>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Temperature
                          </TableCell>
                          <TableCell>
                            {prescription.vitals.temperature || "N/A"}
                          </TableCell>
                          <TableCell className="font-medium">
                            Blood Pressure
                          </TableCell>
                          <TableCell>
                            {prescription.vitals.bloodPressure || "N/A"}
                          </TableCell>
                          <TableCell className="font-medium">Pulse</TableCell>
                          <TableCell>
                            {prescription.vitals.pulse || "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Symptoms</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescription.symptoms.length > 0 ? (
                          prescription.symptoms.map((symptom) => (
                            <TableRow key={symptom.id}>
                              <TableCell>{symptom.name}</TableCell>
                              <TableCell>{symptom.frequency}</TableCell>
                              <TableCell>{symptom.severity}</TableCell>
                              <TableCell>{symptom.duration}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No symptoms recorded
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Findings</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescription.findings.length > 0 ? (
                          prescription.findings.map((finding) => (
                            <TableRow key={finding.id}>
                              <TableCell>{finding.name}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="text-center">
                              No findings recorded
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Diagnosis</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescription.diagnoses.length > 0 ? (
                          prescription.diagnoses.map((diagnosis) => (
                            <TableRow key={diagnosis.id}>
                              <TableCell>{diagnosis.name}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="text-center">
                              No diagnoses recorded
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="font-medium">Severity:</span>
                      <Badge
                        variant={
                          prescription.severity === "Severe"
                            ? "destructive"
                            : prescription.severity === "Moderate"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {prescription.severity || "Not specified"}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Chronic Condition:</span>{" "}
                      {prescription.chronicCondition ? "Yes" : "No"}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Medicines</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Timing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescription.medicines.length > 0 ? (
                          prescription.medicines.map((medicine) => (
                            <TableRow key={medicine.id}>
                              <TableCell>{medicine.name}</TableCell>
                              <TableCell>{medicine.dosage}</TableCell>
                              <TableCell>{medicine.route}</TableCell>
                              <TableCell>
                                {medicine.timesPerDay} times per day
                              </TableCell>
                              <TableCell>
                                {medicine.durationDays} days
                              </TableCell>
                              <TableCell>{medicine.timing}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">
                              No medicines prescribed
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="mt-2">
                      <span className="font-medium">Instructions:</span>{" "}
                      {prescription.medicineInstructions || "None"}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Reminders:</span>{" "}
                      {prescription.medicineReminder.message ? "Message" : ""}{" "}
                      {prescription.medicineReminder.call ? "Call" : ""}{" "}
                      {!prescription.medicineReminder.message &&
                      !prescription.medicineReminder.call
                        ? "None"
                        : ""}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Investigations
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescription.investigations.length > 0 ? (
                          prescription.investigations.map((investigation) => (
                            <TableRow key={investigation.id}>
                              <TableCell>{investigation.name}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="text-center">
                              No investigations ordered
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="mt-2">
                      <span className="font-medium">Notes:</span>{" "}
                      {prescription.investigationNotes || "None"}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Follow-Up</h4>
                    <p>
                      {prescription.followUpDate
                        ? format(new Date(prescription.followUpDate), "PPP")
                        : "No follow-up date set"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
