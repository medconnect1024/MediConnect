"use client";

import { useState } from "react";
import {
  format,
  addMinutes,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowUpDown, ChevronDown, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

import AppointmentBooking from "./appointment-booking";

export default function AppointmentPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [showBuffers, setShowBuffers] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const doctors = useQuery(api.users.getDoctors) || [];
  const appointments = useQuery(api.appointment.getAppointments) || [];

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setActiveTab("date-range");
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const appointmentDate = parseISO(apt.appointmentDate);
    const today = startOfDay(new Date());

    const isInDateRange =
      dateRange?.from && dateRange?.to
        ? isAfter(appointmentDate, startOfDay(dateRange.from)) &&
          isBefore(appointmentDate, endOfDay(dateRange.to))
        : true;

    return (
      (selectedDoctor === "all" || apt.doctorId === selectedDoctor) &&
      ((activeTab === "upcoming" && isAfter(appointmentDate, today)) ||
        (activeTab === "pending" && apt.status === "Scheduled") ||
        (activeTab === "past" && isBefore(appointmentDate, today)) ||
        (activeTab === "date-range" && isInDateRange))
    );
  });

  const groupedAppointments = filteredAppointments.reduce(
    (acc: Record<string, typeof appointments>, apt) => {
      const date = format(parseISO(apt.appointmentDate), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = [];
      acc[date].push(apt);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(groupedAppointments).sort(
    (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
  );

  const handleBookingClose = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">Doctor Calendar</h1>
      </header>
      <main className="flex-grow p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {doctor.firstName} {doctor.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-buffers" className="text-sm">
                  Show buffers
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show buffer time between appointments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="show-buffers"
                  checked={showBuffers}
                  onCheckedChange={setShowBuffers}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Displaying {filteredAppointments.length} of {appointments.length}{" "}
              Events
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="date-range" className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        {dateRange?.from ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {dateRange.to
                              ? format(dateRange.to, "LLL dd, y")
                              : "..."}
                          </>
                        ) : (
                          "Date Range"
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                      Fill in the details to book a new appointment.
                    </DialogDescription>
                  </DialogHeader>
                  <AppointmentBooking />
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Filter by Status</DropdownMenuItem>
                  <DropdownMenuItem>Filter by Type</DropdownMenuItem>
                  <DropdownMenuItem>Filter by Duration</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-6">
            {sortedDates.length > 0 ? (
              sortedDates.map((date) => (
                <div key={date}>
                  <div className="text-lg font-semibold mb-4">
                    {format(parseISO(date), "EEEE, d MMMM yyyy")}
                  </div>
                  {groupedAppointments[date].map((appointment) => {
                    const doctor = doctors.find(
                      (d) => d.userId === appointment.doctorId
                    );
                    const appointmentDate = parseISO(
                      appointment.appointmentDate
                    );
                    const appointmentEndTime = addMinutes(appointmentDate, 30); // Assuming 30-minute appointments

                    return (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors mb-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-full bg-primary/10" />
                          <div>
                            <div className="font-medium">
                              {format(appointmentDate, "h:mm a")} -{" "}
                              {format(appointmentEndTime, "h:mm a")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {doctor
                                ? `${doctor.firstName} ${doctor.lastName}`
                                : "Unknown Doctor"}{" "}
                              • {appointment.service}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            {appointment.isTeleconsultation
                              ? "Teleconsultation"
                              : "In-person"}
                          </div>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No appointments found
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        You've reached the end of the list
      </footer>
    </div>
  );
}
