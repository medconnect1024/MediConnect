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
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Patient } from "@/types/patient";

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
    console.log(
      "PatientDetailsModal useEffect - isOpen:",
      isOpen,
      "patientId:",
      patientId
    );
    if (isOpen && patientId) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, patientId]);

  useEffect(() => {
    console.log(
      "PatientDetailsModal useEffect - patientDetails:",
      patientDetails
    );
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        });
        onClose();
      } catch (error) {
        console.error("Error updating patient:", error);
        setError("Failed to update patient. Please try again.");
      }
    }
  };

  const handleMakeAppointment = () => {
    router.push("/appointment-booking");
  };

  console.log(
    "PatientDetailsModal render - isLoading:",
    isLoading,
    "editedPatient:",
    editedPatient,
    "error:",
    error
  );

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
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            View and edit patient information
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <p>Loading patient details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : editedPatient ? (
          <>
            <div className="grid grid-cols-3 gap-4 py-4">
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col space-y-1">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={
                      editedPatient[field.name as keyof Patient]?.toString() ||
                      ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={editedPatient.email} disabled />
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="hospitalId">Hospital ID</Label>
                <Input
                  id="hospitalId"
                  value={editedPatient.hospitalId}
                  disabled
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button onClick={handleMakeAppointment}>Make Appointment</Button>
              <Button type="submit" onClick={handleUpdate}>
                Update Patient
              </Button>
            </DialogFooter>
          </>
        ) : (
          <p>No patient data available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
