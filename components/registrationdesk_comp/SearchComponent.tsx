"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { Id } from "@/convex/_generated/dataModel";
import { Patient } from "@/types/patient";

export default function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] =
    useState<Id<"patients"> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const userId = user?.id || "";

  const hospitalId = useQuery(api.users.getHospitalIdByUserId, { userId });

  const allPatients = useQuery(
    api.patients.getAllPatientsByUserAndHospital,
    hospitalId ? { userId, hospitalId } : "skip"
  );

  const patientsByIdQuery = useQuery(
    api.patients.getPatientById,
    searchTerm && hospitalId
      ? { patientId: parseInt(searchTerm) || 0, userId, hospitalId }
      : "skip"
  );

  const patientsByNameQuery = useQuery(
    api.patients.getPatientByName,
    searchTerm && hospitalId
      ? { firstName: searchTerm, userId, hospitalId }
      : "skip"
  );

  const patientsByPhoneQuery = useQuery(
    api.patients.getPatientByPhone,
    searchTerm && hospitalId
      ? { phoneNumber: searchTerm, userId, hospitalId }
      : "skip"
  );

  useEffect(() => {
    if (searchTerm) {
      const results: Patient[] = [];
      if (
        patientsByIdQuery &&
        !Array.isArray(patientsByIdQuery) &&
        "id" in patientsByIdQuery
      ) {
        results.push(patientsByIdQuery as Patient);
      }
      if (patientsByNameQuery && Array.isArray(patientsByNameQuery)) {
        results.push(...(patientsByNameQuery as Patient[]));
      }
      if (
        patientsByPhoneQuery &&
        !Array.isArray(patientsByPhoneQuery) &&
        "id" in patientsByPhoneQuery
      ) {
        results.push(patientsByPhoneQuery as Patient);
      }
      setSearchResults(results);
    } else if (allPatients && Array.isArray(allPatients)) {
      // Map the received data to match our Patient interface
      const mappedPatients: Patient[] = allPatients.map((patient) => ({
        ...patient,
        id: patient._id,
      }));
      setSearchResults(mappedPatients);
    } else {
      setSearchResults([]);
    }
  }, [
    searchTerm,
    patientsByIdQuery,
    patientsByNameQuery,
    patientsByPhoneQuery,
    allPatients,
  ]);

  const handleViewDetails = (patientId: Id<"patients">) => {
    console.log("View Details clicked for patient ID:", patientId);
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
  };

  console.log(
    "PatientSearch render - selectedPatientId:",
    selectedPatientId,
    "isModalOpen:",
    isModalOpen
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto mt-10 px-4 py-1 w-screen">
        <div className="rounded-lg bg-white p-1 shadow-sm mb-9">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Patients</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter ID, Name, or Phone Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Phone Number
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0 ? (
                  searchResults.map((patient) => (
                    <tr key={patient.id.toString()} className="border-b">
                      <td className="px-4 py-2 text-sm">
                        {patient.patientId?.toString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {`${patient.firstName} ${patient.middleName || ""} ${patient.lastName}`}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {patient.phoneNumber}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Button
                          variant="link"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleViewDetails(patient.id)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-sm text-center">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {selectedPatientId && (
        <PatientDetailsModal
          patientId={selectedPatientId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
