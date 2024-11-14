import React, { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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

type PrescriptionData = {
  patientId: string;
  doctorId: string;
  symptoms: SymptomItem[];
  findings: FindingItem[];
  diagnoses: { id: string; name: string }[];
  medicines: MedicineItem[];
  investigations: { id: string; name: string }[];
  investigationNotes?: string;
  followUpDate?: Date;
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
    height: string;
    weight: string;
    bmi: string;
    waistHip: string;
    spo2: string;
  };
  severity?: "Mild" | "Moderate" | "Severe";
};



export default function EnhancedPrescriptionPreview({
  data,
}: {
  data: PrescriptionData;
}) {
  
  const generateUploadUrl = useMutation(api.labReports.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);

  const generatePDF = async () => {
    const doc = new jsPDF();
    let yPos = 30; // Start lower to accommodate the header
    const lineHeight = 7;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Clinic details (replace with actual details)
    const clinicName = "HealthCare Clinic";
    const clinicAddress = "123 Medical Street, Healthville, HC 12345";
    const clinicPhone = "+1 (555) 123-4567";
    const clinicEmail = "info@healthcareclinic.com";
  
    // Doctor details (replace with actual details)
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
      doc.setFont('undefined', 'bold');
      doc.text(clinicName, pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('undefined', 'normal');
      doc.text(clinicAddress, pageWidth / 2, 22, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Phone: ${clinicPhone} | Email: ${clinicEmail}`, pageWidth / 2, 29, { align: 'center' });
      doc.line(margin, 32, pageWidth - margin, 32);
    };
  
    const addFooter = () => {
      doc.setFontSize(10);
      doc.text(doctorName, margin, pageHeight - 20);
      doc.text(doctorSpecialty, margin, pageHeight - 15);
      doc.text(doctorLicense, margin, pageHeight - 10);
      doc.text(`Page ${3}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    };
  
    // Add header
    addHeader();
  
    // Title
    doc.setFontSize(16);
    doc.setFont('undefined', 'bold');
    doc.text('Prescription', pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight * 2;
  
    // Reset font
    doc.setFontSize(12);
    doc.setFont('undefined', 'normal');
  
    // Patient and Doctor IDs
    addText(`Patient ID: ${data.patientId}`);
    addText(`Doctor ID: ${data.doctorId}`);
    addText(`Date: ${format(new Date(), 'PPP')}`);
    yPos += 5;
  
    // Vitals
    addSection('Vitals', 
      `Temperature: ${data.vitals.temperature}, Blood Pressure: ${data.vitals.bloodPressure}, ` +
      `Pulse: ${data.vitals.pulse}, Height: ${data.vitals.height}, Weight: ${data.vitals.weight}, ` +
      `BMI: ${data.vitals.bmi}, Waist/Hip: ${data.vitals.waistHip}, SPO2: ${data.vitals.spo2}`
    );
  
    // Symptoms
    addSection('Symptoms', data.symptoms.map(s => 
      `${s.name} (Frequency: ${s.frequency}, Severity: ${s.severity}, Duration: ${s.duration})`
    ).join(', '));
  
    // Findings
    addSection('Findings', data.findings.map(f => f.name).join(', '));
  
    // Diagnoses
    addSection('Diagnoses', data.diagnoses.map(d => d.name).join(', '));
    addText(`Severity: ${data.severity || 'Not specified'}`);
    addText(`Chronic Condition: ${data.chronicCondition ? 'Yes' : 'No'}`);
  
    // Check if we need a new page before adding medicines
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 30;
      addHeader();
    }
  
    // Medicines
    addSection('Medicines', data.medicines.map(m => 
      `${m.name} (Dosage: ${m.dosage}, Route: ${m.route}, Frequency: ${m.timesPerDay} times per day, ` +
      `Duration: ${m.durationDays} days, Timing: ${m.timing})`
    ).join('; '));
    addText(`Instructions: ${data.medicineInstructions || 'None'}`);
    addText(`Reminders: ${data.medicineReminder.message ? 'Message' : ''}${data.medicineReminder.message && data.medicineReminder.call ? ', ' : ''}${data.medicineReminder.call ? 'Call' : ''}`);
  
    // Investigations
    addSection('Investigations', data.investigations.map(i => i.name).join(', '));
    if (data.investigationNotes) {
      addText(`Notes: ${data.investigationNotes}`);
    }
  
    // Follow-up
    addSection('Follow-up', data.followUpDate ? format(data.followUpDate, "PPP") : 'No follow-up date set');
  
    // Add footer to all pages
    const pageCount =3
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooter();
    }
  
    try {
      setIsUploading(true)

      // Get the PDF as a Blob
      const pdfBlob = doc.output('blob')

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl()

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
        },
        body: pdfBlob,
      })

      if (!result.ok) {
        throw new Error("Failed to upload file")
      }

      // Handle successful upload
      console.log("PDF uploaded successfully")
      // You might want to add code here to update the UI or state to reflect the successful upload

    } catch (error) {
      console.error("Error uploading PDF:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsUploading(false)
    }
      
    // Save the PDF
    doc.save('prescription.pdf');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Prescription Details
        </CardTitle>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Patient ID: {data.patientId}</span>
          <span>Doctor ID: {data.doctorId}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>Pulse</TableHead>
                      <TableHead>Height</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>BMI</TableHead>
                      <TableHead>Waist/Hip</TableHead>
                      <TableHead>SPO2</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{data.vitals.temperature}</TableCell>
                      <TableCell>{data.vitals.bloodPressure}</TableCell>
                      <TableCell>{data.vitals.pulse}</TableCell>
                      <TableCell>{data.vitals.height}</TableCell>
                      <TableCell>{data.vitals.weight}</TableCell>
                      <TableCell>{data.vitals.bmi}</TableCell>
                      <TableCell>{data.vitals.waistHip}</TableCell>
                      <TableCell>{data.vitals.spo2}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {data.symptoms.map((symptom) => (
                      <TableRow key={symptom.id}>
                        <TableCell>{symptom.name}</TableCell>
                        <TableCell>{symptom.frequency}</TableCell>
                        <TableCell>{symptom.severity}</TableCell>
                        <TableCell>{symptom.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.findings.map((finding) => (
                      <TableRow key={finding.id}>
                        <TableCell>{finding.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.diagnoses.map((diagnosis) => (
                      <TableRow key={diagnosis.id}>
                        <TableCell>{diagnosis.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <span className="font-medium">Severity: </span>
                  <span>{data.severity || "Not specified"}</span>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Chronic Condition: </span>
                  <span>{data.chronicCondition ? "Yes" : "No"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medicines</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {data.medicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell>{medicine.name}</TableCell>
                        <TableCell>{medicine.dosage}</TableCell>
                        <TableCell>{medicine.route}</TableCell>
                        <TableCell>
                          {medicine.timesPerDay} times per day
                        </TableCell>
                        <TableCell>{medicine.durationDays} days</TableCell>
                        <TableCell>{medicine.timing}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <span className="font-medium">Instructions: </span>
                  <span>{data.medicineInstructions}</span>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Reminders: </span>
                  <span>
                    {data.medicineReminder.message ? "Message, " : ""}
                    {data.medicineReminder.call ? "Call" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investigations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.investigations.map((investigation) => (
                      <TableRow key={investigation.id}>
                        <TableCell>{investigation.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <span className="font-medium">Notes: </span>
                  <span>{data.investigationNotes}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow-Up</CardTitle>
              </CardHeader>
              <CardContent>
                <span>
                  {data.followUpDate
                    ? format(data.followUpDate, "PPP")
                    : "No follow-up date set"}
                </span>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <Button onClick={generatePDF} className="mt-4">Generate PDF</Button>
      </CardContent>
    </Card>
  );
}

function setIsUploading(arg0: boolean) {
    throw new Error("Function not implemented.");
  }
