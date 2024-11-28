"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
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
  TrendingUp,
  AlertCircle,
  Star,
  ThumbsUp,
  ArrowRight,
  UserPlus,
  FileText,
  Stethoscope,
  Zap,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  Clipboard,
  UserCheck,
  MessageSquare,
  HelpCircle,
  Clock4,
  AlertTriangle,
  AlertOctagon,
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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SlotCreationForm } from "@/components/slot-creation-form";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";

export default function EnhancedDoctorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();
  const { user } = useUser();
  const doctorId = user?.id || "";
  const [showSlotCreationForm, setShowSlotCreationForm] = useState(false);

  const patientData =
    useQuery(api.patients.getAppoitmentsByDoctor, { doctorId }) || [];
  // Call the query and pass the doctorId
  const todayAppointments = useQuery(
    api.appointment.getNumberOfAppointmentsTodayForDoctor,
    {
      doctorId,
    }
  );

  const weeklyAppointments = useQuery(
    api.appointment.getWeeklyAppointmentsForDoctor,
    { doctorId }
  );

  const patientFlowData = useQuery(api.appointment.getPatientFlowThisWeek, {
    doctorId,
  });
  const patientSatisfactionData = useQuery(
    api.appointment.getPatientSatisfactionData,
    { doctorId }
  );

  // const patientSatisfactionData = [
  //   { subject: "Communication", A: 120, B: 110, fullMark: 150 },
  //   { subject: "Treatment Effectiveness", A: 98, B: 130, fullMark: 150 },
  //   { subject: "Wait Time", A: 86, B: 130, fullMark: 150 },
  //   { subject: "Facility Cleanliness", A: 99, B: 100, fullMark: 150 },
  //   { subject: "Staff Friendliness", A: 85, B: 90, fullMark: 150 },
  //   { subject: "Follow-up Care", A: 65, B: 85, fullMark: 150 },
  // ];

  const patientRetentionData = [
    { name: "New", value: 30 },
    { name: "Returning", value: 70 },
  ];

  const postConsultationData = [
    { name: "Felt Better", value: 65 },
    { name: "No Change", value: 20 },
    { name: "Worsened", value: 15 },
  ];

  const followUpData = [
    { name: "No Follow-up", value: 40 },
    { name: "Follow-up Required", value: 60 },
  ];

  const referralData = [
    { name: "Jan", referrals: 5 },
    { name: "Feb", referrals: 8 },
    { name: "Mar", referrals: 12 },
    { name: "Apr", referrals: 10 },
    { name: "May", referrals: 15 },
    { name: "Jun", referrals: 18 },
  ];

  const medicinePatternData = [
    { name: "Antibiotics", prescriptions: 120, effectiveness: 85 },
    { name: "Antihypertensives", prescriptions: 200, effectiveness: 92 },
    { name: "Antidiabetics", prescriptions: 150, effectiveness: 88 },
    { name: "Analgesics", prescriptions: 180, effectiveness: 78 },
    { name: "Antidepressants", prescriptions: 90, effectiveness: 75 },
  ];

  const whatsappBotData = [
    { name: "Appointment Reminders", value: 150 },
    { name: "Medication Reminders", value: 120 },
    { name: "Health Tips", value: 80 },
    { name: "Quick Queries", value: 50 },
  ];
  const loggedInEmail = user?.emailAddresses[0]?.emailAddress || "";

  // Query to fetch user role from the database
  const userExists = useQuery(api.users.checkUserEmail, {
    email: loggedInEmail,
  });
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getCriticalityIcon = (criticality: string) => {
    switch (criticality) {
      case "High":
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "Low":
        return <AlertCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex pt-16 justify-center items-center w-full">
        <div className="w-full max-w-7xl px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome, Dr {user?.username || user?.firstName || "User"}!
            </h2>
            <Modal>
              <ModalTrigger asChild>
                <Button className=" bg-blue-500 ">Create Slots</Button>
              </ModalTrigger>
              <ModalContent>
                <SlotCreationForm doctorId={doctorId} />
              </ModalContent>
            </Modal>
          </div>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-4">
                  <CalendarDays className="h-10 w-10 text-blue-500" />

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Appointments Today
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {todayAppointments
                        ? todayAppointments.count
                        : "Loading..."}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Users className="h-10 w-10 text-green-500" />

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Patients This Week
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {weeklyAppointments
                        ? weeklyAppointments.count
                        : "Loading..."}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ↑ 12% from last week
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clipboard className="h-10 w-10 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Lab Results Pending
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">7</h3>
                    <p className="text-xs text-gray-500">2 critical</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <UserCheck className="h-10 w-10 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Patient Retention Rate
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                    <p className="text-xs text-gray-500">
                      ↑ 2% from last month
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">
                  Patient Flow This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientFlowData || []}>
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

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">
                  Patient Satisfaction Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart
                    outerRadius={90}
                    data={patientSatisfactionData || []}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                    <Radar
                      name="You"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Industry Avg"
                      dataKey="B"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <UpcomingAppointments />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Potential Drug Interaction
                      </p>
                      <p className="text-xs text-gray-600">
                        Check prescriptions for patients on multiple medications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Activity className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Improved Treatment Efficacy
                      </p>
                      <p className="text-xs text-gray-600">
                        New treatment plan showing positive results for diabetes
                        patients
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Treatment Efficacy Trend
                      </p>
                      <p className="text-xs text-gray-600">
                        15% improvement in patient outcomes for hypertension
                        treatments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        AI Diagnosis Accuracy
                      </p>
                      <p className="text-xs text-gray-600">
                        95% accuracy in preliminary diagnoses this month
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">
                  WhatsApp Bot Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={whatsappBotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Key Insights
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      • 150 appointment reminders sent, reducing no-shows by 30%
                    </li>
                    <li>
                      • 120 medication reminders improving adherence rates
                    </li>
                    <li>
                      • 80 health tips shared, increasing patient engagement
                    </li>
                    <li>
                      • 50 quick queries resolved, saving 5 hours of staff time
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">
                Follow-up Call Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {patient.name} - {patient.condition}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          Last visit: {patient.lastVisit} | Next appointment:{" "}
                          {patient.nextAppointment}
                        </p>
                      </div>
                      <Badge
                        variant={
                          patient.followUpStatus === "Completed"
                            ? "default"
                            : patient.followUpStatus === "Scheduled"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {patient.followUpStatus}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center">
                      {patient.followUpStatus === "Completed" && (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      {patient.followUpStatus === "Scheduled" && (
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      )}
                      {patient.followUpStatus === "Pending" && (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <p className="text-sm text-gray-700">
                        {patient.lastFollowUpCall
                          ? `Last follow-up call: ${patient.lastFollowUpCall}`
                          : "No follow-up call recorded"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Follow-up notes:</strong> {patient.followUpNotes}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        onClick={() =>
                          handleNavigation(`/patient/${patient.id}`)
                        }
                      >
                        View Full History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                        onClick={() =>
                          handleNavigation(
                            `/patient/${patient.id}/treatment-plan`
                          )
                        }
                      >
                        Treatment Plan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          patient.followUpStatus === "Completed"
                            ? "text-purple-600 border-purple-300 hover:bg-purple-50"
                            : "text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        }
                        onClick={() =>
                          handleNavigation(`/patient/${patient.id}/follow-up`)
                        }
                      >
                        {patient.followUpStatus === "Completed"
                          ? "Schedule Next Follow-up"
                          : "Manage Follow-up"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
