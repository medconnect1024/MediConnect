'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"

const Header = () => (
  <header className="flex items-center justify-between border-b p-4">
   
   
  </header>
)

interface PatientCardProps {
  name: string;
  gender: string;
  age: string;
  isHighlighted?: boolean;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ name, gender, age, isHighlighted = false, onClick }) => (
  <Card 
    className={`mb-2 p-2 cursor-pointer ${
      isHighlighted 
        ? 'bg-blue-500 text-white hover:bg-blue-500' 
        : 'hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <CardContent className="p-2">
      <div className="flex justify-between items-center">
        <p className={`font-medium text-sm ${isHighlighted ? 'text-white' : ''}`}>{name}</p>
        <p className={`text-xs ${isHighlighted ? 'text-white' : 'text-muted-foreground'}`}>{gender}, {age}</p>
      </div>
    </CardContent>
  </Card>
)

interface Patient {
  name: string;
  gender: string;
  age: string;
}

const Sidebar: React.FC = () => {
  const handlePatientClick = (patient: Patient) => {
    console.log(`Clicked on patient: ${patient.name}`);
    // Add your logic here to handle the click event
  };

  const onQueuePatients: Patient[] = [
    { name: "Harshil", gender: "M", age: "35y 0m" },
    { name: "Priya", gender: "F", age: "28y 6m" },
    { name: "Rahul", gender: "M", age: "42y 3m" },
  ];

  const completedAppointments: Patient[] = [
    { name: "Vaibhav", gender: "M", age: "1y 10m" },
    { name: "Anita", gender: "F", age: "55y 2m" },
    { name: "Rajesh", gender: "M", age: "39y 8m" },
  ];

  const totalPatients = onQueuePatients.length + completedAppointments.length;

  return (
    <aside className="w-64 overflow-y-auto border-r p-4 flex flex-col h-full mg-10">
      <h2 className="mb-4 font-semibold">Today's Patients ({totalPatients})</h2>
      <div className="mb-6 flex-grow overflow-y-auto ">
        <h3 className="text-sm font-medium mb-2">On Queue ({onQueuePatients.length})</h3>
        <div className="overflow-y-auto">
          {onQueuePatients.map((patient, index) => (
            <PatientCard 
              key={index} 
              name={patient.name} 
              gender={patient.gender} 
              age={patient.age} 
              isHighlighted={index === 0}
              onClick={() => handlePatientClick(patient)}
            />
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <h3 className="text-sm font-medium mb-2">Appointment Completed ({completedAppointments.length})</h3>
        <div className="overflow-y-auto">
          {completedAppointments.map((patient, index) => (
            <PatientCard 
              key={index} 
              name={patient.name} 
              gender={patient.gender} 
              age={patient.age}
              onClick={() => handlePatientClick(patient)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

const ActionButtons: React.FC = () => (
  <div className="mb-4">
  <div className="flex flex-wrap gap-2">
    <Button variant="default" className="bg-blue-500 text-white hover:bg-white hover:text-blue-500">
      New Consult
    </Button>
    <Button variant="outline">Treatment</Button>
    <Button variant="outline">Prescription</Button>
    <Button variant="outline">Vaccination</Button>
    <Button variant="outline">Lab Reports</Button>
    
    <div className="flex items-center space-x-4 justify-end ml-auto">
      
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-blue-500" aria-hidden="true" />
        <div>
          <p className="font-medium">Harshil</p>
          <p className="text-sm text-muted-foreground">Male, 35y AS1136</p>
        </div>
      </div>
    </div>
  </div>
</div>

)

const MedicalHistoryCard: React.FC = () => (
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
          { label: "Medication", value: "Insulin_(80_iu) 12 months 7 daily" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const VaccinationCard: React.FC = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center p-6">
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
      <p className="mt-2 text-sm text-muted-foreground">No vaccination records found.</p>
    </CardContent>
  </Card>
)

export default function Component() {
  return (
    <div >
      <Header />
      <div className="flex flex-1 overflow-hidden w-full mt-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <ActionButtons />
          <MedicalHistoryCard />
          <VaccinationCard />
        </main>
      </div>
    </div>
  )
}