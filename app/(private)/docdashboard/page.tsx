"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  ChevronRight,
  ClipboardList,
  Home,
  Search,
  Settings,
  Users,
  Activity,
  Brain,
  Heart,
  Pill,
  Thermometer,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Banner from "@/components/home/Banner";

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  // Mock data
  const patientData = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      lastVisit: "2023-10-15",
      nextAppointment: "2023-11-05",
      condition: "Hypertension",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      lastVisit: "2023-10-18",
      nextAppointment: "2023-11-10",
      condition: "Pregnancy",
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 58,
      lastVisit: "2023-10-10",
      nextAppointment: "2023-11-01",
      condition: "Diabetes",
    },
    {
      id: 4,
      name: "Alice Brown",
      age: 27,
      lastVisit: "2023-10-20",
      nextAppointment: "2023-11-15",
      condition: "Asthma",
    },
  ];

  const patientFlowData = [
    { name: "Mon", patients: 20 },
    { name: "Tue", patients: 25 },
    { name: "Wed", patients: 30 },
    { name: "Thu", patients: 22 },
    { name: "Fri", patients: 28 },
    { name: "Sat", patients: 15 },
    { name: "Sun", patients: 10 },
  ];
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex pt-16 justify-center items-center w-full">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome, Dr. Smith
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-l-4 border-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700">
                  Appointments Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">12</div>
                <p className="text-gray-600">3 urgent</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-l-4 border-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700">
                  Patients This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">78</div>
                <p className="text-gray-600">↑ 12% from last week</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-l-4 border-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700">
                  Lab Results Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">7</div>
                <p className="text-gray-600">2 critical</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-l-4 border-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-700">
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">15</div>
                <p className="text-gray-600">5 unread</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-gray-800">
                  Patient Flow This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-gray-800">
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-600">Patient</TableHead>
                      <TableHead className="text-gray-600">Date</TableHead>
                      <TableHead className="text-gray-600">Condition</TableHead>
                      <TableHead className="text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium text-gray-800">
                          {patient.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {patient.nextAppointment}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {patient.condition}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                          >
                            Reschedule
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="flex flex-col items-center justify-center h-24 bg-blue-100 hover:bg-blue-200 text-blue-700">
                    <Calendar className="h-8 w-8 mb-2" />
                    Schedule Appointment
                  </Button>
                  <Button className="flex flex-col items-center justify-center h-24 bg-green-100 hover:bg-green-200 text-green-700">
                    <ClipboardList className="h-8 w-8 mb-2" />
                    Create Prescription
                  </Button>
                  <Button className="flex flex-col items-center justify-center h-24 bg-purple-100 hover:bg-purple-200 text-purple-700">
                    <Brain className="h-8 w-8 mb-2" />
                    AI Diagnosis Assistant
                  </Button>
                  <Button className="flex flex-col items-center justify-center h-24 bg-red-100 hover:bg-red-200 text-red-700">
                    <Heart className="h-8 w-8 mb-2" />
                    View Patient Vitals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">
                Recent Patient Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-800">
                    John Doe - Hypertension
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Blood pressure slightly elevated. Adjusted medication
                    dosage. Follow-up in 2 weeks.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-800">
                    Jane Smith - Pregnancy
                  </h4>
                  <p className="text-gray-600 mt-1">
                    20-week checkup. All vitals normal. Scheduled anatomy scan
                    for next week.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-800">
                    Bob Johnson - Diabetes
                  </h4>
                  <p className="text-gray-600 mt-1">
                    HbA1c levels improved. Continuing current treatment plan.
                    Encouraged more physical activity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
