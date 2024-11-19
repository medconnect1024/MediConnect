"use client";

import React, { useState } from "react";
import {
  CoffeeIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  ThermometerIcon,
  DropletIcon,
  AlertCircleIcon,
  CalendarIcon,
  TruckIcon,
  DollarSignIcon,
  PhoneIcon,
  MailIcon,
  PlusCircleIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface VendingMachine {
  id: string;
  name: string;
  status: "online" | "offline";
  temperature: number;
  canisterLevels: { [key: string]: number };
  replenishmentOrder: { status: string; eta: string | null };
  deliveryBoy: { name: string; location: string; eta: string | null } | null;
  lastFulfilled: string;
}

interface Vendor {
  id: string;
  name: string;
  status: string;
  amountDue: number;
  lastOrder: string;
  contactPerson: string;
  email: string;
  phone: string;
}

interface Transaction {
  id: string;
  time: string;
  product: string;
  category: string;
  amount: number;
}

export default function TeaVendingDashboard() {
  const [selectedMachine, setSelectedMachine] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState<"dashboard" | "vendors">(
    "dashboard"
  );

  const [isAddMachineOpen, setIsAddMachineOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({
    id: "",
    name: "",
    location: "",
    description: "",
  });
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const vendingMachines: VendingMachine[] = [
    {
      id: "VM001",
      name: "Central Park",
      status: "online",
      temperature: 72,
      canisterLevels: { green: 80, black: 65, oolong: 45 },
      replenishmentOrder: { status: "Placed", eta: "2023-11-21" },
      deliveryBoy: {
        name: "John Doe",
        location: "En route",
        eta: "15 minutes",
      },
      lastFulfilled: "2023-11-18",
    },
    {
      id: "VM002",
      name: "Times Square",
      status: "offline",
      temperature: 68,
      canisterLevels: { green: 30, black: 50, oolong: 70 },
      replenishmentOrder: { status: "Delivered", eta: null },
      deliveryBoy: { name: "Jane Smith", location: "At machine", eta: null },
      lastFulfilled: "2023-11-19",
    },
    {
      id: "VM003",
      name: "Grand Central",
      status: "online",
      temperature: 70,
      canisterLevels: { green: 90, black: 85, oolong: 60 },
      replenishmentOrder: { status: "Not required", eta: null },
      deliveryBoy: null,
      lastFulfilled: "2023-11-17",
    },
  ];

  const vendors: Vendor[] = [
    {
      id: "V001",
      name: "Green Leaf Tea Co.",
      status: "Active",
      amountDue: 5000,
      lastOrder: "2023-11-15",
      contactPerson: "Alice Green",
      email: "alice@greenleaftea.com",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "V002",
      name: "Black Pearl Imports",
      status: "Inactive",
      amountDue: 0,
      lastOrder: "2023-10-30",
      contactPerson: "Bob Black",
      email: "bob@blackpearlimports.com",
      phone: "+1 (555) 987-6543",
    },
  ];

  const selectedMachineData =
    selectedMachine === "all"
      ? null
      : vendingMachines.find((vm) => vm.id === selectedMachine);

  const toggleMachineStatus = (machineId: string) => {
    console.log(
      `Toggling ${machineId} ${vendingMachines.find((vm) => vm.id === machineId)?.status === "online" ? "offline" : "online"}`
    );
  };

  const transactions: Transaction[] = [
    {
      id: "T001",
      time: "09:15 AM",
      product: "Green Tea",
      category: "green",
      amount: 3.5,
    },
    {
      id: "T002",
      time: "10:30 AM",
      product: "Black Tea",
      category: "black",
      amount: 3.0,
    },
    {
      id: "T003",
      time: "11:45 AM",
      product: "Oolong Tea",
      category: "oolong",
      amount: 4.0,
    },
  ];

  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);
  const categorySales = transactions.reduce(
    (acc: { [key: string]: number }, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    },
    {}
  );

  const handleMachineInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMachine((prev) => ({ ...prev, [name]: value }));
  };

  const handleVendorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleMachineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken =
      Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    console.log("New machine onboarded:", { ...newMachine, accessToken });
    toast.success(
      `${newMachine.name} has been successfully added with ID: ${newMachine.id}`
    );
    setNewMachine({ id: "", name: "", location: "", description: "" });
    setIsAddMachineOpen(false);
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New vendor onboarded:", newVendor);
    toast.success(
      `${newVendor.name} from ${newVendor.company} has been successfully added.`
    );
    setNewVendor({ name: "", email: "", phone: "", company: "" });
    setIsAddVendorOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <CoffeeIcon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
              TeaVend Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedMachine} onValueChange={setSelectedMachine}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a vending machine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vending Machines</SelectItem>
                {vendingMachines.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id}>
                    {machine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddMachineOpen} onOpenChange={setIsAddMachineOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Machine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vending Machine</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new vending machine.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleMachineSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="id" className="text-right">
                        ID
                      </Label>
                      <Input
                        id="id"
                        name="id"
                        value={newMachine.id}
                        onChange={handleMachineInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={newMachine.name}
                        onChange={handleMachineInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={newMachine.location}
                        onChange={handleMachineInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newMachine.description}
                        onChange={handleMachineInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Machine</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlusIcon className="mr-2 h-4 w-4" /> Add Vendor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new vendor.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVendorSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vendorName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="vendorName"
                        name="name"
                        value={newVendor.name}
                        onChange={handleVendorInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vendorEmail" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="vendorEmail"
                        name="email"
                        type="email"
                        value={newVendor.email}
                        onChange={handleVendorInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vendorPhone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        id="vendorPhone"
                        name="phone"
                        type="tel"
                        value={newVendor.phone}
                        onChange={handleVendorInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vendorCompany" className="text-right">
                        Company
                      </Label>
                      <Input
                        id="vendorCompany"
                        name="company"
                        value={newVendor.company}
                        onChange={handleVendorInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Vendor</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => setActiveTab("dashboard")}>
              <LayoutDashboardIcon className="mr-2 h-4 w-4" /> Overview
            </Button>
            <Button variant="outline">
              <SettingsIcon className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="container mx-auto space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={(value: string) =>
              setActiveTab(value as "dashboard" | "vendors")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="dashboard" className="text-lg font-semibold">
                <LayoutDashboardIcon className="w-5 h-5 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="vendors" className="text-lg font-semibold">
                <UsersIcon className="w-5 h-5 mr-2" />
                Vendors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Machines
                    </CardTitle>
                    <CoffeeIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {vendingMachines.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {
                        vendingMachines.filter((vm) => vm.status === "online")
                          .length
                      }{" "}
                      online
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Sales Today
                    </CardTitle>
                    <DropletIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245 cups</div>
                    <p className="text-xs text-muted-foreground">
                      +15% from yesterday
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Alerts
                    </CardTitle>
                    <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      2 low inventory, 1 maintenance
                    </p>
                  </CardContent>
                </Card>
              </div>

              {selectedMachine === "all" && (
                <Card>
                  <CardHeader>
                    <CardTitle>All Vending Machines</CardTitle>
                    <CardDescription>
                      Overview of all tea vending machines
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Replenishment</TableHead>
                          <TableHead>Delivery</TableHead>
                          <TableHead>Last Fulfilled</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendingMachines.map((machine) => (
                          <TableRow key={machine.id}>
                            <TableCell>{machine.id}</TableCell>
                            <TableCell>{machine.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  machine.status === "online"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {machine.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  machine.replenishmentOrder.status === "Urgent"
                                    ? "destructive"
                                    : machine.replenishmentOrder.status ===
                                        "Placed"
                                      ? "default"
                                      : machine.replenishmentOrder.status ===
                                          "Delivered"
                                        ? "default"
                                        : "secondary"
                                }
                              >
                                {machine.replenishmentOrder.status}
                              </Badge>
                              {machine.replenishmentOrder.eta && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ETA: {machine.replenishmentOrder.eta}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {machine.deliveryBoy ? (
                                <div className="flex items-center">
                                  <TruckIcon className="h-4 w-4 mr-2" />
                                  <span>
                                    {machine.deliveryBoy.name} -{" "}
                                    {machine.deliveryBoy.location}
                                  </span>
                                  {machine.deliveryBoy.eta && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      ETA: {machine.deliveryBoy.eta}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  No delivery scheduled
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{machine.lastFulfilled}</TableCell>
                            <TableCell>
                              <Switch
                                checked={machine.status === "online"}
                                onCheckedChange={() =>
                                  toggleMachineStatus(machine.id)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {selectedMachineData && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>
                      {selectedMachineData.name} ({selectedMachineData.id})
                    </CardTitle>
                    <CardDescription>
                      Detailed metrics and controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Status</h3>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedMachineData.status === "online"}
                            onCheckedChange={() =>
                              toggleMachineStatus(selectedMachineData.id)
                            }
                          />
                          <span>
                            {selectedMachineData.status === "online"
                              ? "Online"
                              : "Offline"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Temperature
                        </h3>
                        <div className="flex items-center space-x-2">
                          <ThermometerIcon className="h-5 w-5 text-red-500" />
                          <span>{selectedMachineData.temperature}°F</span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold mb-2">
                          Canister Levels
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(
                            selectedMachineData.canisterLevels
                          ).map(([tea, level]) => (
                            <div
                              key={tea}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-20 capitalize">
                                {tea} Tea:
                              </span>
                              <Progress value={level} className="flex-1" />
                              <span>{level}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Replenishment Order
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              selectedMachineData.replenishmentOrder.status ===
                              "Urgent"
                                ? "destructive"
                                : selectedMachineData.replenishmentOrder
                                      .status === "Placed"
                                  ? "default"
                                  : selectedMachineData.replenishmentOrder
                                        .status === "Delivered"
                                    ? "default"
                                    : "secondary"
                            }
                          >
                            {selectedMachineData.replenishmentOrder.status}
                          </Badge>
                          {selectedMachineData.replenishmentOrder.eta && (
                            <span className="text-sm text-muted-foreground">
                              ETA: {selectedMachineData.replenishmentOrder.eta}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Delivery Status
                        </h3>
                        {selectedMachineData.deliveryBoy ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <TruckIcon className="h-5 w-5" />
                              <span>
                                {selectedMachineData.deliveryBoy.name}
                              </span>
                            </div>
                            <div>
                              Location:{" "}
                              {selectedMachineData.deliveryBoy.location}
                            </div>
                            {selectedMachineData.deliveryBoy.eta && (
                              <div>
                                ETA: {selectedMachineData.deliveryBoy.eta}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No delivery scheduled
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Last Fulfilled
                        </h3>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5" />
                          <span>{selectedMachineData.lastFulfilled}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Transactions
                      </h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <Select
                          value={selectedDate}
                          onValueChange={setSelectedDate}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value={new Date().toISOString().split("T")[0]}
                            >
                              Today
                            </SelectItem>
                            <SelectItem
                              value={
                                new Date(Date.now() - 86400000)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            >
                              Yesterday
                            </SelectItem>
                            <SelectItem
                              value={
                                new Date(Date.now() - 172800000)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            >
                              2 days ago
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Card className="mb-4">
                        <CardHeader>
                          <CardTitle>Sales Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Total Sales
                              </p>
                              <p className="text-2xl font-bold">
                                ${totalSales.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Transactions
                              </p>
                              <p className="text-2xl font-bold">
                                {transactions.length}
                              </p>
                            </div>
                            {Object.entries(categorySales).map(
                              ([category, amount]) => (
                                <div key={category}>
                                  <p className="text-sm font-medium text-muted-foreground capitalize">
                                    {category} Tea Sales
                                  </p>
                                  <p className="text-2xl font-bold">
                                    ${amount.toFixed(2)}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.id}</TableCell>
                              <TableCell>{transaction.time}</TableCell>
                              <TableCell>{transaction.product}</TableCell>
                              <TableCell>
                                ${transaction.amount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="vendors">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Overview</CardTitle>
                  <CardDescription>
                    List of all onboarded vendors and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount Due</TableHead>
                        <TableHead>Last Order</TableHead>
                        <TableHead>Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>{vendor.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                  src={`/placeholder.svg?text=${vendor.name.charAt(0)}`}
                                  alt={vendor.name}
                                />
                                <AvatarFallback>
                                  {vendor.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {vendor.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                vendor.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {vendor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSignIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                              ${vendor.amountDue.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>{vendor.lastOrder}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {vendor.contactPerson}
                              </span>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MailIcon className="h-3 w-3 mr-1" />
                                {vendor.email}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <PhoneIcon className="h-3 w-3 mr-1" />
                                {vendor.phone}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
