"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
}

export default function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  const patientsByIdQuery = useQuery(
    api.patients.getPatientById,
    searchTerm ? { patientId: parseInt(searchTerm) || 0 } : "skip"
  );
  const patientsByNameQuery = useQuery(
    api.patients.getPatientByName,
    searchTerm ? { firstName: searchTerm } : "skip"
  );
  const patientsByPhoneQuery = useQuery(
    api.patients.getPatientByPhone,
    searchTerm ? { phoneNumber: searchTerm } : "skip"
  );

  useEffect(() => {
    if (searchTerm) {
      const results: Patient[] = [];
      if (
        patientsByIdQuery &&
        !("error" in patientsByIdQuery) &&
        patientsByIdQuery.id
      ) {
        results.push(patientsByIdQuery as Patient);
      }
      if (patientsByNameQuery && Array.isArray(patientsByNameQuery)) {
        results.push(...(patientsByNameQuery as Patient[]));
      }
      if (
        patientsByPhoneQuery &&
        !("error" in patientsByPhoneQuery) &&
        patientsByPhoneQuery.id
      ) {
        results.push(patientsByPhoneQuery as Patient);
      }
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [
    searchTerm,
    patientsByIdQuery,
    patientsByNameQuery,
    patientsByPhoneQuery,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 ">
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
                {searchTerm && searchResults.length > 0 ? (
                  searchResults.map((patient) => (
                    <tr key={patient.id} className="border-b">
                      <td className="px-4 py-2 text-sm">{patient.id}</td>
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
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : searchTerm ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-sm text-center">
                      No patients found matching the search criteria.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
