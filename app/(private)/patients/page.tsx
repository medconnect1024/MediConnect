"use client"

import * as React from "react"
import { Bell, Calendar, Clock, Edit, Phone, PlusCircle, Upload, X, Check, AlertTriangle, User, FileText, Activity, Pill } from "lucide-react"
import { format, addDays, addWeeks, addMonths } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EnhancedMedicalManagementSystem({ userType = "doctor" }: { userType?: "doctor" | "patient" }) {
  const [scheduledCalls, setScheduledCalls] = React.useState([])
  const [prescriptions, setPrescriptions] = React.useState([])
  const [selectedFrequency, setSelectedFrequency] = React.useState("daily")
  const [customReminders, setCustomReminders] = React.useState([])
  const { toast } = useToast()

  const handleScheduleCall = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const callType = formData.get("callType") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string

    let scheduleDates = []
    const baseDate = new Date(`${date}T${time}`)

    switch (selectedFrequency) {
      case "daily":
        scheduleDates = [0, 1, 2, 3, 4].map(days => addDays(baseDate, days))
        break
      case "weekly":
        scheduleDates = [0, 1, 2, 3].map(weeks => addWeeks(baseDate, weeks))
        break
      case "monthly":
        scheduleDates = [0, 1, 2].map(months => addMonths(baseDate, months))
        break
      case "custom":
        scheduleDates = customReminders.map(reminder => new Date(reminder))
        break
    }

    const newCalls = scheduleDates.map((date, index) => ({
      id: scheduledCalls.length + index + 1,
      type: callType,
      datetime: date.toISOString(),
    }))

    setScheduledCalls([...scheduledCalls, ...newCalls])
    toast({
      title: "Calls Scheduled",
      description: `${newCalls.length} ${callType} calls scheduled`,
    })
  }

  const handlePrescriptionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newPrescription = {
      id: prescriptions.length + 1,
      medication: formData.get("medication") as string,
      dosage: formData.get("dosage") as string,
      frequency: formData.get("frequency") as string,
      duration: formData.get("duration") as string,
      notes: formData.get("notes") as string,
    }
    setPrescriptions([...prescriptions, newPrescription])
    toast({
      title: "Prescription Added",
      description: `Prescription for ${newPrescription.medication} has been added`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-800">
            {userType === "doctor" ? "Doctor Dashboard" : "Patient Dashboard"}
          </CardTitle>
          <CardDescription className="text-blue-600">
            {userType === "doctor" ? "Manage patient care and schedules" : "View your appointments and prescriptions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule">
              {userType === "doctor" ? (
                <form onSubmit={handleScheduleCall} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="callType" className="text-lg font-semibold text-blue-800">Appointment Type</Label>
                    <RadioGroup defaultValue="follow-up" name="callType" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="follow-up" id="follow-up" />
                        <Label htmlFor="follow-up" className="text-blue-700">Follow-up</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consultation" id="consultation" />
                        <Label htmlFor="consultation" className="text-blue-700">Consultation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medication-review" id="medication-review" />
                        <Label htmlFor="medication-review" className="text-blue-700">Medication Review</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-blue-700">Date</Label>
                      <Input
                        type="date"
                        id="date"
                        name="date"
                        required
                        className="w-full border-blue-300 focus:border-blue-500 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-blue-700">Time</Label>
                      <Input
                        type="time"
                        id="time"
                        name="time"
                        required
                        className="w-full border-blue-300 focus:border-blue-500 text-base"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-800">Your Upcoming Appointments</h3>
                  {scheduledCalls.length === 0 ? (
                    <p className="text-center text-blue-600">No appointments scheduled</p>
                  ) : (
                    <ul className="space-y-2">
                      {scheduledCalls.map((call) => (
                        <li
                          key={call.id}
                          className={`flex justify-between items-center p-3 rounded-lg shadow ${
                            new Date(call.datetime) < new Date() ? 'bg-gray-100' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Calendar className={`h-4 w-4 ${new Date(call.datetime) < new Date() ? 'text-gray-500' : 'text-blue-600'}`} />
                            <span className={`font-medium ${new Date(call.datetime) < new Date() ? 'text-gray-700' : 'text-blue-800'}`}>
                              {call.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className={`h-4 w-4 ${new Date(call.datetime) < new Date() ? 'text-gray-500' : 'text-blue-600'}`} />
                            <span className={new Date(call.datetime) < new Date() ? 'text-gray-600' : 'text-blue-600'}>
                              {format(new Date(call.datetime), "MMM d, yyyy h:mm a")}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="prescriptions">
              {userType === "doctor" ? (
                <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication" className="text-lg font-semibold text-blue-800">Medication</Label>
                    <Input id="medication" name="medication" required className="border-blue-300 focus:border-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dosage" className="text-blue-700">Dosage</Label>
                      <Input id="dosage" name="dosage" required className="border-blue-300 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-blue-700">Frequency</Label>
                      <Input id="frequency" name="frequency" required className="border-blue-300 focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-blue-700">Duration</Label>
                    <Input id="duration" name="duration" required className="border-blue-300 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-blue-700">Additional Notes</Label>
                    <Textarea id="notes" name="notes" className="border-blue-300 focus:border-blue-500" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Add Prescription
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-800">Your Current Prescriptions</h3>
                  {prescriptions.length === 0 ? (
                    <p className="text-center text-blue-600">No active prescriptions</p>
                  ) : (
                    <ul className="space-y-2">
                      {prescriptions.map((prescription) => (
                        <li key={prescription.id} className="bg-white p-3 rounded-lg shadow">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-blue-800">{prescription.medication}</span>
                            <Pill className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-sm text-blue-600">Dosage: {prescription.dosage}</p>
                          <p className="text-sm text-blue-600">Frequency: {prescription.frequency}</p>
                          <p className="text-sm text-blue-600">Duration: {prescription.duration}</p>
                          {prescription.notes && (
                            <p className="text-sm text-blue-500 mt-2">Notes: {prescription.notes}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="insights">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800">Health Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-800">Medication Adherence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">92%</span>
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-600 mt-2">Great job! Keep up the good work.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-800">Next Check-up</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {format(addDays(new Date(), 30), "MMM d, yyyy")}
                        </span>
                        <Calendar className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-600 mt-2">Scheduled follow-up appointment</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {userType === "doctor" && (
        <Card className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">Patient Overview</CardTitle>
            <CardDescription className="text-green-600">Quick access to patient information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Patient" />
                  <AvatarFallback>PA</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">John Doe</h4>
                  <p className="text-sm text-green-600">Last visit: {format(addDays(new Date(), -15), "MMM d, yyyy")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg shadow">
                  
                  <h5 className="font-medium text-green-800">Allergies</h5>
                  <p className="text-sm text-green-600">Penicillin, Peanuts</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow">
                  <h5 className="font-medium text-green-800">Chronic Conditions</h5>
                  <p className="text-sm text-green-600">Hypertension, Diabetes</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <User className="w-4 h-4 mr-2" />
                View Full Patient Record
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Toaster />
    </div>
  )
}