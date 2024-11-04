"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Save } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender must be 'Male', 'Female', or 'Other'",
  }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  houseNo: z.string().optional(),
  gramPanchayat: z.string().optional(),
  village: z.string().optional(),
  tehsil: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  systolic: z.string().optional(),
  diastolic: z.string().optional(),
  heartRate: z.string().optional(),
  temperature: z.string().optional(),
  oxygenSaturation: z.string().optional(),
});

export default function RegisterPatientForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      phoneNumber: "",
      houseNo: "",
      gramPanchayat: "",
      village: "",
      tehsil: "",
      district: "",
      state: "",
      systolic: "",
      diastolic: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
    },
  });

  const registerPatient = useMutation(api.patients.registerPatient);
  const [activeTab, setActiveTab] = useState("personal");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await registerPatient(values);
      toast.success("Patient has been registered successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to register patient. Please try again.");
      console.error("Error registering patient:", error);
    }
  };

  return (
    <div>
      <div className="shadow-lg max-w-7xl mx-auto w-screen h-screen py-9">
        <CardHeader className="bg-blue-500 text-white ">
          <div className="text-2xl font-bold">New Patient Registration</div>
        </CardHeader>
        <div className="p-4 sm:p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs
                defaultValue="personal"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="address"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    Address Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="vitals"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    Vitals
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Middle Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["Male", "Female", "Other"].map((gender) => (
                                  <SelectItem value={gender} key={gender}>
                                    {gender}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date?.toISOString())
                                  }
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g: 7550147999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="address">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                      <FormField
                        control={form.control}
                        name="houseNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>House No., Street (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="House No., Street"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gramPanchayat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gram Panchayat (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Gram Panchayat" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="village"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Village (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Village" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tehsil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tehsil (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Tehsil" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="District" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="vitals">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <FormLabel>Blood Pressure (mmHg)</FormLabel>
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <FormField
                          control={form.control}
                          name="systolic"
                          render={({ field }) => (
                            <FormItem className="w-full sm:w-1/2">
                              <FormLabel>Systolic (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Systolic" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="diastolic"
                          render={({ field }) => (
                            <FormItem className="w-full sm:w-1/2">
                              <FormLabel>Diastolic (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Diastolic" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="heartRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heart Rate (bpm) (Optional)</FormLabel>

                          <FormControl>
                            <Input placeholder="Heart Rate" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature (°C) (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Temperature" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="oxygenSaturation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Oxygen Saturation (%) (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Oxygen Saturation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              {activeTab === "vitals" && (
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
