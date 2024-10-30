"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, Eye, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LabReport = {
  _id: string;
  date: string;
  notes: string;
  storageId: string;
  fileUrl?: string | null;
  fileType: "pdf" | "image";
  fileName: string;
  createdAt: number;
};

type NotificationType = {
  message: string;
  type: "success" | "error";
};

export default function LabReportPage() {
  const reports = useQuery(api.labReports.list);
  const addReport = useMutation(api.labReports.add);
  const generateUploadUrl = useMutation(api.labReports.generateUploadUrl);

  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  const [newReport, setNewReport] = useState<Partial<LabReport>>({
    date: new Date().toISOString().split("T")[0],
    notes: "",
    storageId: "",
    fileType: "pdf",
    fileName: "",
  });

  // Handle file upload to Convex storage
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileType = file.type.startsWith("image/") ? "image" : "pdf";

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Failed to upload file");
      }

      // Get the storage ID from the response
      const { storageId } = await result.json();

      setNewReport((prev) => ({
        ...prev,
        storageId,
        fileType,
        fileName: file.name,
      }));

      setNotification({
        message: "File uploaded successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setNotification({
        message: "Failed to upload file. Please try again.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!newReport.notes || !newReport.storageId) return;

    try {
      await addReport({
        date: newReport.date!,
        notes: newReport.notes,
        storageId: newReport.storageId,
        fileType: newReport.fileType!,
        fileName: newReport.fileName!,
      });

      setNewReport({
        date: new Date().toISOString().split("T")[0],
        notes: "",
        storageId: "",
        fileType: "pdf",
        fileName: "",
      });

      setNotification({
        message: "Lab report uploaded successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding report:", error);
      setNotification({
        message: "Failed to add report. Please try again.",
        type: "error",
      });
    }
  };

  const ViewReport = ({ report }: { report: LabReport }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Lab Report</DialogTitle>
          <DialogDescription>
            Date: {new Date(report.date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>File Name</Label>
            <p className="text-sm text-muted-foreground">{report.fileName}</p>
          </div>
          <div className="grid gap-2">
            <Label>Notes</Label>
            <p className="text-sm text-muted-foreground">{report.notes}</p>
          </div>
          <div className="grid gap-2">
            <Label>Report Content</Label>
            {report.fileUrl &&
              (report.fileType === "pdf" ? (
                <iframe
                  src={report.fileUrl}
                  className="w-full h-[600px] rounded-md border"
                  title="PDF Report"
                />
              ) : (
                <img
                  src={report.fileUrl}
                  alt="Lab Report"
                  className="max-w-full h-auto rounded-md"
                />
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!reports) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Lab Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {notification && (
          <Alert
            className={`mb-4 ${
              notification.type === "success" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <AlertDescription className="flex items-center justify-between">
              <span>{notification.message}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotification(null)}
                className="h-auto p-1 hover:bg-transparent"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Upload New Report</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newReport.date}
                onChange={(e) =>
                  setNewReport((prev) => ({ ...prev, date: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newReport.notes}
                onChange={(e) =>
                  setNewReport((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <div className="col-span-3">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,image/*"
                  disabled={isUploading}
                />
                {isUploading && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    Uploading file...
                  </p>
                )}
                {newReport.fileName && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected file: {newReport.fileName}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleUpload}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!newReport.notes || !newReport.storageId || isUploading}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Upload Report
            </Button>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Report List</h3>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sl. No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={report._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.fileName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {report.notes}
                  </TableCell>
                  <TableCell className="text-right">
                    <ViewReport report={report} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
