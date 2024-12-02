"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield } from "lucide-react";

interface VaccinationPageProps {
  patientId: number | string;
}

const vaccineCategories = {
  "CANCER PREVENTING VACCINES": [
    "HEPATITIS B VACCINE",
    "HUMAN PAPILLOMA VIRUS VACCINE",
  ],
  "INFECTIONS PREVENTING VACCINES": [
    "MMR VACCINE",
    "MEASLES VACCINE",
    "POLIO VACCINE",
    "JAPANESE ENCEPHALITIS VACCINE",
    "ROTA VIRUS VACCINE",
    "HEPATITIS A VACCINE",
    "COVID-19 VACCINE",
    "INFLUENZA VACCINE",
    "VARICELLA VACCINE",
    "PNEUMOCOCCAL VACCINE",
    "BCG VACCINE",
    "DPT VACCINE",
    "TYPHOID VACCINE",
    "MENINGOCOCCAL VACCINE",
    "HEMOPHILUS INFLUENZA TYPE B VACCINE",
    "CHOLERA VACCINE",
    "MALARIA VACCINE",
  ],
  "INTERNATIONAL TRAVEL VACCINES": [
    "YELLOW FEVER VACCINE",
    "RABIES VACCINE",
    "CHOLERA VACCINE",
    "TICK BORNE ENCEPHALITIS VACCINE",
    "TYPHOID VACCINE",
    "JE VIRUS VACCINE",
    "MALARIA VACCINE",
    "MENINGOCOCCAL VACCINE",
  ],
};

const VaccinationPage: React.FC<VaccinationPageProps> = ({ patientId }) => {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const [selectedVaccines, setSelectedVaccines] = useState<{
    [key: string]: boolean;
  }>({});

  const patientIdString = String(patientId);

  const addVaccinations = useMutation(api.vaccinations.addVaccinations);
  const getVaccinations = useQuery(api.vaccinations.getVaccinations, {
    patientId: patientIdString,
    userId,
  });

  useEffect(() => {
    if (getVaccinations) {
      const existingVaccines = getVaccinations.reduce(
        (acc, v) => {
          acc[v.vaccineName] = v.status === "Yes";
          return acc;
        },
        {} as { [key: string]: boolean }
      );
      setSelectedVaccines(existingVaccines);
    }
  }, [getVaccinations]);

  const handleVaccineToggle = (vaccine: string) => {
    setSelectedVaccines((prev) => ({ ...prev, [vaccine]: !prev[vaccine] }));
  };

  const handleSubmit = async () => {
    await addVaccinations({
      patientId: patientIdString,
      userId,
      vaccinations: Object.entries(selectedVaccines).map(
        ([vaccineName, status]) => ({
          vaccineName,
          status: status ? "Yes" : "No",
        })
      ),
    });
    alert("Vaccination records updated successfully!");
  };

  if (!patientId) {
    return <div className="text-center p-4">Please select a patient</div>;
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-blue-500 flex items-center justify-center">
          <Shield className="mr-2" />
          Vaccination Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Patient ID</p>
          <p className="text-lg font-medium">{patientIdString}</p>
        </div>
        {Object.entries(vaccineCategories).map(([category, vaccines]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vaccines.map((vaccine) => (
                <div key={vaccine} className="flex items-center space-x-2">
                  <Button
                    variant={selectedVaccines[vaccine] ? "default" : "outline"}
                    className={`w-full ${selectedVaccines[vaccine] ? "bg-blue-500 hover:bg-blue-600" : "text-blue-500 border-blue-500 hover:bg-blue-100"}`}
                    onClick={() => handleVaccineToggle(vaccine)}
                  >
                    {vaccine}
                  </Button>
                  <span className="text-sm font-medium">
                    {selectedVaccines[vaccine] ? "Yes" : "No"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleSubmit}
        >
          Submit Vaccination Records
        </Button>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">
            Current Vaccination Status:
          </h3>
          <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {getVaccinations
              ?.filter((v) => v.status === "Yes")
              .map((vaccination, index) => (
                <li key={index} className="text-sm">
                  {vaccination.vaccineName}
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VaccinationPage;
