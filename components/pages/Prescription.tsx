"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, Plus, X } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

type PrescriptionItem = {
  id: string;
  name: string;
};

type MedicineItem = PrescriptionItem & {
  timesPerDay: string;
  durationDays: string;
  timing: string;
};

type Prescription = {
  id: string;
  date: string;
  symptoms: string[];
  findings: string[];
  diagnosis: string[];
  medicines: MedicineItem[];
  investigations: string[];
  investigationNotes: string;
  followUpDate: Date | undefined;
  medicineReminder: { message: boolean; call: boolean };
  medicineInstructions: string;
};

export default function PrescriptionPage() {
  const [activeMainTab, setActiveMainTab] = useState("previous");
  const [symptoms, setSymptoms] = useState<PrescriptionItem[]>([
    { id: "1", name: "Cough" },
    { id: "2", name: "Fever" },
  ]);
  const [findings, setFindings] = useState<PrescriptionItem[]>([
    { id: "1", name: "Throat Congestion" },
  ]);
  const [diagnoses, setDiagnoses] = useState<PrescriptionItem[]>([
    { id: "1", name: "Common Cold" },
  ]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: "1",
      name: "Paracetamol",
      timesPerDay: "3",
      durationDays: "5",
      timing: "After Food",
    },
  ]);
  const [investigations, setInvestigations] = useState<PrescriptionItem[]>([
    { id: "1", name: "CBC" },
  ]);
  const [investigationNotes, setInvestigationNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState<Date>();
  const [medicineReminder, setMedicineReminder] = useState({
    message: false,
    call: false,
  });
  const [medicineInstructions, setMedicineInstructions] = useState("");

  const [previousPrescriptions, setPreviousPrescriptions] = useState<
    Prescription[]
  >([
    {
      id: "1",
      date: "2023-05-15",
      symptoms: ["Fever", "Cough"],
      findings: ["Throat Congestion"],
      diagnosis: ["Common Cold"],
      medicines: [
        {
          id: "1",
          name: "Paracetamol",
          timesPerDay: "3",
          durationDays: "5",
          timing: "After Food",
        },
      ],
      investigations: ["CBC"],
      investigationNotes: "Check WBC count",
      followUpDate: new Date("2023-05-20"),
      medicineReminder: { message: true, call: false },
      medicineInstructions: "Take with warm water",
    },
  ]);

  const handleAddItem = (
    item: string,
    setter: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>
  ) => {
    const newItem: PrescriptionItem = { id: Date.now().toString(), name: item };
    setter((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>
  ) => {
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrescriptionClick = (prescription: Prescription) => {
    console.log("Clicked prescription:", prescription);
    // Here you can add logic to show details or edit the prescription
  };

  const SearchAddSection = ({
    title,
    items,
    setItems,
    placeholder,
  }: {
    title: string;
    items: PrescriptionItem[];
    setItems: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
    placeholder: string;
  }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 py-6 text-lg"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onClick={() => {
              if (searchTerm.trim()) {
                handleAddItem(searchTerm.trim(), setItems);
                setSearchTerm("");
              }
            }}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="h-[150px]">
          <div className="flex flex-wrap gap-3">
            {items.map((item) => (
              <Button
                key={item.id}
                variant="secondary"
                size="lg"
                className="flex items-center gap-2 text-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                {item.name}
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id, setItems);
                  }}
                />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const MedicineSection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [newMedicine, setNewMedicine] = useState<Partial<MedicineItem>>({
      name: "",
      timesPerDay: "",
      durationDays: "",
      timing: "",
    });

    const handleAddMedicine = () => {
      if (
        newMedicine.name &&
        newMedicine.timesPerDay &&
        newMedicine.durationDays &&
        newMedicine.timing
      ) {
        // setMedicines(prev => [...prev, { id: Date.now().toString(), ...newMedicine as MedicineItem }])
        setNewMedicine({
          name: "",
          timesPerDay: "",
          durationDays: "",
          timing: "",
        });
        setSearchTerm("");
      }
    };

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Medicine</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 py-6 text-lg"
              placeholder="Search and add medicine"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setNewMedicine((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
          </div>
          <Select
            onValueChange={(value) =>
              setNewMedicine((prev) => ({ ...prev, timesPerDay: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Times per day" />
            </SelectTrigger>
            <SelectContent>
              {["1", "2", "3", "4"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setNewMedicine((prev) => ({ ...prev, durationDays: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duration (days)" />
            </SelectTrigger>
            <SelectContent>
              {["1", "3", "5", "7", "10", "14", "30"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setNewMedicine((prev) => ({ ...prev, timing: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Timing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Before Food">Before Food</SelectItem>
              <SelectItem value="After Food">After Food</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onClick={handleAddMedicine}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Times per Day</TableHead>
                <TableHead>Duration (Days)</TableHead>
                <TableHead>Timing</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.timesPerDay}</TableCell>
                  <TableCell>{medicine.durationDays}</TableCell>
                  <TableCell>{medicine.timing}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setMedicines((prev) =>
                          prev.filter((m) => m.id !== medicine.id)
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <Textarea
          placeholder="Instructions for all medicines"
          value={medicineInstructions}
          onChange={(e) => setMedicineInstructions(e.target.value)}
          className="mt-4"
        />
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="medicineReminderMessage"
              checked={medicineReminder.message}
              onCheckedChange={(checked: boolean) =>
                setMedicineReminder((prev) => ({
                  ...prev,
                  message: checked as boolean,
                }))
              }
            />
            <label
              htmlFor="medicineReminderMessage"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Message Reminder
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="medicineReminderCall"
              checked={medicineReminder.call}
              onCheckedChange={(checked: boolean) =>
                setMedicineReminder((prev) => ({
                  ...prev,
                  call: checked as boolean,
                }))
              }
            />
            <label
              htmlFor="medicineReminderCall"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Call Reminder
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeMainTab}
          onValueChange={setActiveMainTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 h-14 text-lg">
            <TabsTrigger
              value="previous"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
            >
              Previous Prescription
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
            >
              New Prescription
            </TabsTrigger>
          </TabsList>
          <div className="h-[600px] overflow-hidden">
            {" "}
            {/* Fixed height container */}
            <TabsContent value="previous" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    Previous Prescriptions
                  </h3>
                  {previousPrescriptions.map((prescription) => (
                    <Card
                      key={prescription.id}
                      className="mb-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handlePrescriptionClick(prescription)}
                    >
                      <CardContent className="p-6">
                        <p className="text-xl font-semibold mb-2">
                          Date: {prescription.date}
                        </p>
                        <p className="text-lg">
                          <strong>Symptoms:</strong>{" "}
                          {prescription.symptoms.join(", ")}
                        </p>
                        <p className="text-lg">
                          <strong>Findings:</strong>{" "}
                          {prescription.findings.join(", ")}
                        </p>
                        <p className="text-lg">
                          <strong>Diagnosis:</strong>{" "}
                          {prescription.diagnosis.join(", ")}
                        </p>
                        <p className="text-lg">
                          <strong>Medicines:</strong>
                        </p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medicine Name</TableHead>
                              <TableHead>Times per Day</TableHead>
                              <TableHead>Duration (Days)</TableHead>
                              <TableHead>Timing</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {prescription.medicines.map((medicine) => (
                              <TableRow key={medicine.id}>
                                <TableCell>{medicine.name}</TableCell>
                                <TableCell>{medicine.timesPerDay}</TableCell>
                                <TableCell>{medicine.durationDays}</TableCell>
                                <TableCell>{medicine.timing}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <p className="text-lg mt-4">
                          <strong>Medicine Instructions:</strong>{" "}
                          {prescription.medicineInstructions}
                        </p>
                        <p className="text-lg">
                          <strong>Investigations:</strong>{" "}
                          {prescription.investigations.join(", ")}
                        </p>
                        <p className="text-lg">
                          <strong>Investigation Notes:</strong>{" "}
                          {prescription.investigationNotes}
                        </p>
                        <p className="text-lg">
                          <strong>Follow-up Date:</strong>{" "}
                          {prescription.followUpDate
                            ? format(prescription.followUpDate, "PP")
                            : "Not set"}
                        </p>
                        <p className="text-lg">
                          <strong>Medicine Reminder:</strong>{" "}
                          {prescription.medicineReminder.message
                            ? "Message Reminder: Yes"
                            : "Message Reminder: No"}{" "}
                          {prescription.medicineReminder.call
                            ? ", Call Reminder: Yes"
                            : ", Call Reminder: No"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="new" className="h-full">
              <ScrollArea className="h-full">
                <Tabs defaultValue="symptoms" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-6 h-14 text-lg">
                    <TabsTrigger
                      value="symptoms"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Symptoms
                    </TabsTrigger>
                    <TabsTrigger
                      value="findings"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Findings
                    </TabsTrigger>
                    <TabsTrigger
                      value="diagnosis"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Diagnosis
                    </TabsTrigger>
                    <TabsTrigger
                      value="medicine"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Medicine
                    </TabsTrigger>
                    <TabsTrigger
                      value="investigations"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Investigations
                    </TabsTrigger>
                    <TabsTrigger
                      value="followup"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:text-blue-600 transition-colors"
                    >
                      Follow-Up
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="symptoms">
                    <SearchAddSection
                      title="Symptoms"
                      items={symptoms}
                      setItems={setSymptoms}
                      placeholder="Search symptoms (e.g., Cough, Weakness)"
                    />
                  </TabsContent>
                  <TabsContent value="findings">
                    <SearchAddSection
                      title="Findings"
                      items={findings}
                      setItems={setFindings}
                      placeholder="Search findings (e.g., Throat Congestion, Chest Clear)"
                    />
                  </TabsContent>
                  <TabsContent value="diagnosis">
                    <SearchAddSection
                      title="Diagnosis"
                      items={diagnoses}
                      setItems={setDiagnoses}
                      placeholder="Search diagnosis (e.g., Viral Fever, URTI)"
                    />
                  </TabsContent>
                  <TabsContent value="medicine">
                    <MedicineSection />
                  </TabsContent>
                  <TabsContent value="investigations">
                    <SearchAddSection
                      title="Investigations"
                      items={investigations}
                      setItems={setInvestigations}
                      placeholder="Search investigations (e.g., CBC, Thyroid Profile)"
                    />
                    <Textarea
                      placeholder="Investigation Notes"
                      value={investigationNotes}
                      onChange={(e) => setInvestigationNotes(e.target.value)}
                      className="mt-4"
                    />
                  </TabsContent>
                  <TabsContent value="followup">
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Follow-Up</h3>
                      <div className="flex items-center space-x-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-[280px] justify-start text-left font-normal ${
                                !followUpDate && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {followUpDate ? (
                                format(followUpDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={followUpDate}
                              onSelect={setFollowUpDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {followUpDate && (
                          <p>
                            After {differenceInDays(followUpDate, new Date())}{" "}
                            days
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button
                  className="mt-8 w-full py-6 text-xl bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    // Here you would typically save the new prescription
                    console.log("New Prescription:", {
                      symptoms,
                      findings,
                      diagnoses,
                      medicines,
                      medicineInstructions,
                      investigations,
                      investigationNotes,
                      followUpDate,
                      medicineReminder,
                    });
                    // Reset the form
                    setSymptoms([
                      { id: "1", name: "Cough" },
                      { id: "2", name: "Fever" },
                    ]);
                    setFindings([{ id: "1", name: "Throat Congestion" }]);
                    setDiagnoses([{ id: "1", name: "Common Cold" }]);
                    setMedicines([
                      {
                        id: "1",
                        name: "Paracetamol",
                        timesPerDay: "3",
                        durationDays: "5",
                        timing: "After Food",
                      },
                    ]);
                    setInvestigations([{ id: "1", name: "CBC" }]);
                    setInvestigationNotes("");
                    setFollowUpDate(undefined);
                    setMedicineInstructions("");
                    setMedicineReminder({ message: false, call: false });
                  }}
                >
                  Save Prescription
                </Button>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
