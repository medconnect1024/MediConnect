import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Patient } from "@/types/patient";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PatientDetailsModalProps {
  patientId: Id<"patients"> | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientDetailsModal({
  patientId,
  isOpen,
  onClose,
}: PatientDetailsModalProps) {
  const router = useRouter();
  const patientDetails = useQuery(
    api.patients.getPatientDetails,
    patientId ? { patientId } : "skip"
  );
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const updatePatient = useMutation(api.patients.updatePatient);

  useEffect(() => {
    if (isOpen && patientId) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, patientId]);

  useEffect(() => {
    if (patientDetails) {
      if ("error" in patientDetails) {
        setError(patientDetails.error as string);
        setIsLoading(false);
      } else {
        setEditedPatient({
          ...patientDetails,
          id: patientDetails._id,
        } as Patient);
        setIsLoading(false);
      }
    }
  }, [patientDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedPatient((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdate = async () => {
    if (editedPatient) {
      try {
        await updatePatient({
          id: editedPatient.id,
          firstName: editedPatient.firstName,
          middleName: editedPatient.middleName,
          lastName: editedPatient.lastName,
          dateOfBirth: editedPatient.dateOfBirth,
          gender: editedPatient.gender as "Male" | "Female" | "Other",
          phoneNumber: editedPatient.phoneNumber,
          houseNo: editedPatient.houseNo,
          gramPanchayat: editedPatient.gramPanchayat,
          village: editedPatient.village,
          tehsil: editedPatient.tehsil,
          district: editedPatient.district,
          state: editedPatient.state,
          systolic: editedPatient.systolic,
          diastolic: editedPatient.diastolic,
          heartRate: editedPatient.heartRate,
          temperature: editedPatient.temperature,
          oxygenSaturation: editedPatient.oxygenSaturation,
          allergies: editedPatient.allergies,
          chronicConditions: editedPatient.chronicConditions,
          pastSurgeries: editedPatient.pastSurgeries,
          familyHistory: editedPatient.familyHistory,
        });
        onClose();
      } catch (error) {
        console.error("Error updating patient:", error);
        setError("Failed to update patient. Please try again.");
      }
    }
  };

  const handleMakeAppointment = () => {
    router.push("/appointmment");
  };

  const fields = [
    { name: "firstName", label: "First Name" },
    { name: "middleName", label: "Middle Name" },
    { name: "lastName", label: "Last Name" },
    { name: "dateOfBirth", label: "Date of Birth" },
    { name: "gender", label: "Gender" },
    { name: "phoneNumber", label: "Phone Number" },
    { name: "houseNo", label: "House No" },
    { name: "gramPanchayat", label: "Gram Panchayat" },
    { name: "village", label: "Village" },
    { name: "tehsil", label: "Tehsil" },
    { name: "district", label: "District" },
    { name: "state", label: "State" },
    { name: "systolic", label: "Systolic" },
    { name: "diastolic", label: "Diastolic" },
    { name: "heartRate", label: "Heart Rate" },
    { name: "temperature", label: "Temperature" },
    { name: "oxygenSaturation", label: "Oxygen Saturation" },
    { name: "allergies", label: "Allergies" },
    { name: "chronicConditions", label: "Chronic Conditions" },
    { name: "pastSurgeries", label: "Past Surgeries" },
    { name: "familyHistory", label: "Family History" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            View and edit patient information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          {isLoading ? (
            <p>Loading patient details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : editedPatient ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col space-y-1">
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  {[
                    "allergies",
                    "chronicConditions",
                    "pastSurgeries",
                    "familyHistory",
                  ].includes(field.name) ? (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={
                        editedPatient[
                          field.name as keyof Patient
                        ]?.toString() || ""
                      }
                      onChange={handleInputChange}
                      className="h-24 text-sm"
                    />
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      value={
                        editedPatient[
                          field.name as keyof Patient
                        ]?.toString() || ""
                      }
                      onChange={handleInputChange}
                      className="text-sm"
                    />
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editedPatient.email}
                  disabled
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="hospitalId" className="text-sm font-medium">
                  Hospital ID
                </Label>
                <Input
                  id="hospitalId"
                  value={editedPatient.hospitalId}
                  disabled
                  className="text-sm"
                />
              </div>
            </div>
          ) : (
            <p>No patient data available.</p>
          )}
        </ScrollArea>
        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 mt-4">
          <Button onClick={handleMakeAppointment} className="w-full sm:w-auto">
            Make Appointment
          </Button>
          <Button
            type="submit"
            onClick={handleUpdate}
            className="w-full sm:w-auto"
          >
            Update Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
