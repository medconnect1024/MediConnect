// "use client";

// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { PlusIcon, Eye } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

// type LabReport = {
//   _id: string;
//   date: string;
//   notes: string;
//   fileUrl: string;
//   fileType: "pdf" | "image";
// };

// export default function LabReportPage() {
//   const reports = useQuery(api.labReports.list) || [];
//   const addReport = useMutation(api.labReports.add);
//   const { toast } = useToast();

//   const [newReport, setNewReport] = useState<Partial<LabReport>>({
//     date: new Date().toISOString().split("T")[0],
//     notes: "",
//     fileUrl: "",
//     fileType: "pdf",
//   });

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const fileType = file.type.startsWith("image/") ? "image" : "pdf";
//       try {
//         const formData = new FormData();
//         formData.append("file", file);
//         const response = await fetch("/api/upload", {
//           method: "POST",
//           body: formData,
//         });
//         if (!response.ok) throw new Error("File upload failed");
//         const { fileUrl } = await response.json();
//         setNewReport((prev) => ({ ...prev, fileUrl, fileType }));
//       } catch (error) {
//         console.error("Error uploading file:", error);
//         toast({
//           title: "Error",
//           description: "Failed to upload file. Please try again.",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (newReport.notes && newReport.fileUrl) {
//       try {
//         await addReport({
//           date: newReport.date!,
//           notes: newReport.notes,
//           fileUrl: newReport.fileUrl,
//           fileType: newReport.fileType!,
//         });
//         setNewReport({
//           date: new Date().toISOString().split("T")[0],
//           notes: "",
//           fileUrl: "",
//           fileType: "pdf",
//         });
//         toast({
//           title: "Success",
//           description: "Lab report uploaded successfully.",
//         });
//       } catch (error) {
//         console.error("Error adding report:", error);
//         toast({
//           title: "Error",
//           description: "Failed to add report. Please try again.",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const ViewReport = ({ report }: { report: LabReport }) => (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="sm">
//           <Eye className="mr-2 h-4 w-4" />
//           View
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Lab Report</DialogTitle>
//           <DialogDescription>Date: {report.date}</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <p>
//             <strong>Notes:</strong> {report.notes}
//           </p>
//           {report.fileType === "pdf" ? (
//             <iframe src={report.fileUrl} width="100%" height="500px" />
//           ) : (
//             <img
//               src={report.fileUrl}
//               alt="Lab Report"
//               style={{ maxWidth: "100%", height: "auto" }}
//             />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-3xl">Lab Reports</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-4">Upload New Report</h3>
//           <div className="grid gap-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="date" className="text-right">
//                 Date
//               </Label>
//               <Input
//                 id="date"
//                 type="date"
//                 value={newReport.date}
//                 onChange={(e) =>
//                   setNewReport((prev) => ({ ...prev, date: e.target.value }))
//                 }
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="notes" className="text-right">
//                 Notes
//               </Label>
//               <Textarea
//                 id="notes"
//                 value={newReport.notes}
//                 onChange={(e) =>
//                   setNewReport((prev) => ({ ...prev, notes: e.target.value }))
//                 }
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="file" className="text-right">
//                 File
//               </Label>
//               <div className="col-span-3">
//                 <Input
//                   id="file"
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,image/*"
//                 />
//               </div>
//             </div>
//             <Button
//               onClick={handleUpload}
//               className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
//               disabled={!newReport.notes || !newReport.fileUrl}
//             >
//               <PlusIcon className="mr-2 h-4 w-4" /> Upload Report
//             </Button>
//           </div>
//         </div>

//         <h3 className="text-lg font-semibold mb-4">Report List</h3>
//         <ScrollArea className="h-[400px] w-full rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[100px]">Sl. No</TableHead>
//                 <TableHead>Report Date</TableHead>
//                 <TableHead>Report Notes</TableHead>
//                 <TableHead className="text-right">View Report</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {reports.map((report, index) => (
//                 <TableRow key={report._id}>
//                   <TableCell className="font-medium">{index + 1}</TableCell>
//                   <TableCell>{report.date}</TableCell>
//                   <TableCell>{report.notes}</TableCell>
//                   <TableCell className="text-right">
//                     <ViewReport report={report} />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }
