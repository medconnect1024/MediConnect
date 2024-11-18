"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, ClockIcon, UserIcon, HeartPulseIcon, AwardIcon, BookOpenIcon, ActivityIcon } from 'lucide-react'

// Mock data for the satisfaction chart
const satisfactionData = [
  { month: "Jan", score: 4.2 },
  { month: "Feb", score: 4.3 },
  { month: "Mar", score: 4.1 },
  { month: "Apr", score: 4.4 },
  { month: "May", score: 4.5 },
  { month: "Jun", score: 4.6 },
]

// Mock data for the appointments chart
const appointmentData = [
  { month: "Jan", appointments: 120 },
  { month: "Feb", appointments: 135 },
  { month: "Mar", appointments: 140 },
  { month: "Apr", appointments: 138 },
  { month: "May", appointments: 145 },
  { month: "Jun", appointments: 150 },
]

// Mock data for KPIs
const kpiData = [
  { label: "Avg. Wait Time", value: "18 mins", icon: ClockIcon, color: "text-amber-500" },
  { label: "Patients Seen", value: "28/day", icon: UserIcon, color: "text-blue-500" },
  { label: "Patient Satisfaction", value: "4.6/5", icon: StarIcon, color: "text-yellow-500" },
  { label: "Years of Experience", value: "15", icon: AwardIcon, color: "text-green-500" },
  { label: "Research Papers", value: "12", icon: BookOpenIcon, color: "text-purple-500" },
  { label: "Success Rate", value: "98%", icon: ActivityIcon, color: "text-red-500" },
]

// Mock data for patient feedback
const patientFeedback = [
  { name: "John D.", comment: "Dr. Smith was very thorough and patient.", rating: 5 },
  { name: "Sarah M.", comment: "Excellent bedside manner. Explained everything clearly.", rating: 5 },
  { name: "Robert L.", comment: "Wait time was a bit long, but overall good experience.", rating: 4 },
]

export default function EnhancedDoctorPerformanceDashboard() {
  const [cmeProgress, setCmeProgress] = useState(65)

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen">
      <header className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Dr. Emily Smith" />
          <AvatarFallback>ES</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dr. Emily Smith</h1>
          <p className="text-lg text-gray-600">Family Medicine Specialist</p>
          <div className="flex space-x-2 mt-2">
            <Badge variant="secondary" className="bg-teal-100 text-teal-800">
              Board Certified
            </Badge>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
              Top Rated
            </Badge>
          </div>
        </div>
      </header>
      
      <div className="grid gap-6 md:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Patient Satisfaction Trend</CardTitle>
            <CardDescription>Monthly average scores (out of 5)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Satisfaction Score",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={satisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Monthly Appointments</CardTitle>
            <CardDescription>Number of patients seen each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                appointments: {
                  label: "Appointments",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="appointments" fill="var(--color-appointments)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HeartPulseIcon className="h-5 w-5 text-red-500" />
              <span>Continuing Medical Education</span>
            </CardTitle>
            <CardDescription>Annual requirement: 50 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={cmeProgress} className="w-full h-4" />
            <p className="mt-2 text-sm text-right">{cmeProgress}% completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent Patient Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientFeedback.map((feedback, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700">{feedback.name}</h4>
                    <div className="flex items-center">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}