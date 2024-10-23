"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CameraIcon, UserIcon } from "lucide-react";

export default function PatientRegistration() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const [vitals, setVitals] = useState({
    systolic: "120",
    diastolic: "80",
    heartRate: "70",
    temperature: "37.0",
    oxygenSaturation: "98",
  });

  useEffect(() => {
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
      }

      if (days < 0) {
        const prevMonthLastDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        ).getDate();
        days += prevMonthLastDay;
        months--;
      }

      setAge({ years, months, days });
    }
  }, [dateOfBirth]);

  const handleVitalChange = (vital: keyof typeof vitals, value: string) => {
    setVitals((prev) => ({ ...prev, [vital]: value }));
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b min-h-screen mt-5 w-full">
      <div className="container mx-auto w-full lg:max-w-screen-xl">
        <Card className="w-full  shadow-lg">
          <CardHeader className="bg-blue-500 text-white">
            <CardTitle className="text-2xl font-bold flex items-center">
              <UserIcon className="mr-2" />
              New Patient Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="address">Address Information</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientIdentifier">
                        Patient Identifier
                      </Label>
                      <Input
                        id="patientIdentifier"
                        placeholder="Enter Patient Identifier"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enterId">Enter ID</Label>
                      <Input id="enterId" placeholder="Enter ID" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="First Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input id="middleName" placeholder="Middle Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Last Name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative">
                          <Input
                            id="dateOfBirth"
                            type="date"
                            className="w-full pr-10"
                            onChange={(e) => setDateOfBirth(e.target.value)}
                          />
                          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="address">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="houseNo">House No., Street</Label>
                      <Input id="houseNo" placeholder="House No., Street" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gramPanchayat">Gram Panchayat</Label>
                      <Input id="gramPanchayat" placeholder="Gram Panchayat" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="village">Village</Label>
                      <Input id="village" placeholder="Village" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tehsil">Tehsil</Label>
                      <Input id="tehsil" placeholder="Tehsil" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select>
                        <SelectTrigger id="district">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="district1">District 1</SelectItem>
                          <SelectItem value="district2">District 2</SelectItem>
                          <SelectItem value="district3">District 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="state1">State 1</SelectItem>
                          <SelectItem value="state2">State 2</SelectItem>
                          <SelectItem value="state3">State 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="vitals">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Blood Pressure (mmHg)</Label>
                    <div className="flex space-x-4">
                      <div className="w-1/2 space-y-2">
                        <Label htmlFor="systolic">Systolic</Label>
                        <Input
                          id="systolic"
                          type="text"
                          value={vitals.systolic.toString()}
                          onChange={(e) =>
                            handleVitalChange("systolic", e.target.value)
                          }
                          placeholder="Systolic"
                        />
                      </div>
                      <div className="w-1/2 space-y-2">
                        <Label htmlFor="diastolic">Diastolic</Label>
                        <Input
                          id="diastolic"
                          type="number"
                          value={vitals.diastolic}
                          onChange={(e) =>
                            handleVitalChange("diastolic", e.target.value)
                          }
                          placeholder="Diastolic"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input
                      id="heartRate"
                      type="text"
                      value={vitals.heartRate}
                      onChange={(e) =>
                        handleVitalChange("heartRate", e.target.value)
                      }
                      placeholder="Heart Rate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="text"
                      value={vitals.temperature}
                      onChange={(e) =>
                        handleVitalChange("temperature", e.target.value)
                      }
                      placeholder="Temperature"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oxygenSaturation">
                      Oxygen Saturation (%)
                    </Label>
                    <Input
                      id="oxygenSaturation"
                      type="text"
                      value={vitals.oxygenSaturation}
                      onChange={(e) =>
                        handleVitalChange("oxygenSaturation", e.target.value)
                      }
                      placeholder="Oxygen Saturation"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-8">
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                Save
              </Button>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="flex items-center border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
