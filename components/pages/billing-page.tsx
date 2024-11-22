"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Plus, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { jsPDF } from "jspdf";

interface BillingPageProps {
  patientId: number;
}

interface BillItem {
  name: string;
  cost: number;
}

interface Bill {
  _id: Id<"bills">;
  billNumber: string;
  date: string;
  items: BillItem[];
  total: number;
  pdfStorageId?: string;
}

export default function BillingPage({ patientId }: BillingPageProps) {
  const { user } = useUser();
  const doctorId = user?.id;

  const bills = useQuery(api.bills.getBillsForPatient, {
    patientId: patientId.toString(),
  });
  const createBill = useMutation(api.bills.createBill);
  const updateBillPdf = useMutation(api.bills.updateBillPdf);
  const generateUploadUrl = useMutation(api.bills.generateUploadUrl);
  const getFileUrl = useMutation(api.bills.getFileUrl);

  const [newItems, setNewItems] = useState<BillItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCost, setNewItemCost] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleAddItem = () => {
    if (newItemName && newItemCost) {
      setNewItems([
        ...newItems,
        { name: newItemName, cost: parseFloat(newItemCost) },
      ]);
      setNewItemName("");
      setNewItemCost("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  const generatePDF = async (bill: Bill) => {
    const doc = new jsPDF();
    let yPos = 30;
    const lineHeight = 7;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const addText = (text: string) => {
      const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      textLines.forEach((line: string) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });
    };

    const addSection = (title: string, content: string) => {
      doc.setFontSize(14);
      addText(title);
      doc.setFontSize(12);
      addText(content);
      yPos += 5;
    };

    const addHeader = () => {
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Clinic Name", pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Clinic Address", pageWidth / 2, 22, { align: "center" });
      doc.setFontSize(10);
      doc.text(
        `Phone: 123-456-7890 | Email: clinic@example.com`,
        pageWidth / 2,
        29,
        { align: "center" }
      );
      doc.line(margin, 32, pageWidth - margin, 32);
    };

    const addFooter = () => {
      doc.setFontSize(10);
      doc.text("Doctor Name", margin, pageHeight - 20);
      doc.text("Doctor Specialty", margin, pageHeight - 15);
      doc.text("License Number", margin, pageHeight - 10);
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        pageWidth - margin,
        pageHeight - 10,
        {
          align: "right",
        }
      );
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    };

    addHeader();

    addSection(
      "Bill Details",
      `Bill Number: ${bill.billNumber}\nDate: ${format(new Date(bill.date), "PPP")}`
    );

    doc.setFontSize(12);
    doc.text("Items:", margin, yPos);
    yPos += lineHeight * 2;

    bill.items.forEach((item) => {
      doc.text(`${item.name}: ₹${item.cost.toFixed(2)}`, margin, yPos);
      yPos += lineHeight;
    });

    yPos += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ₹${bill.total.toFixed(2)}`, margin, yPos);

    addFooter();

    return doc.output("blob");
  };

  const handleCreateBill = async () => {
    if (newItems.length > 0 && doctorId) {
      const newBillId = await createBill({
        userId: doctorId,
        patientId: patientId.toString(),
        items: newItems,
      });

      // Use useQuery to fetch the newly created bill
      const newBill = useQuery(api.bills.getBillById, { billId: newBillId });

      if (newBill) {
        const pdfBlob = await generatePDF(newBill);

        // Get upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // Upload file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/pdf",
          },
          body: pdfBlob,
        });

        if (!result.ok) {
          throw new Error("Failed to upload file");
        }

        // Get the storageId from the upload response
        const { storageId } = await result.json();

        // Update the bill with the PDF storage ID
        await updateBillPdf({ billId: newBillId, pdfStorageId: storageId });

        setNewItems([]);
      }
    }
  };

  const handleViewBill = async (bill: Bill) => {
    setSelectedBill(bill);
    if (bill.pdfStorageId) {
      const url = await getFileUrl({ storageId: bill.pdfStorageId });
      setPdfUrl(url);
    } else {
      setPdfUrl(null);
    }
  };

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Billing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Create New Bill</h3>
          <div className="flex space-x-2 mb-2">
            <Input
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Cost"
              value={newItemCost}
              onChange={(e) => setNewItemCost(e.target.value)}
            />
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>₹{item.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            onClick={handleCreateBill}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white"
          >
            Create Bill
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Previous Bills</h3>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills?.map((bill) => (
                  <TableRow key={bill._id}>
                    <TableCell>{bill.billNumber}</TableCell>
                    <TableCell>{format(new Date(bill.date), "PPP")}</TableCell>
                    <TableCell>₹{bill.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBill(bill)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                      {bill.pdfStorageId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const url = await getFileUrl({
                              storageId: bill.pdfStorageId!,
                            });
                            if (url) window.open(url, "_blank");
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" /> PDF
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <Dialog
          open={!!selectedBill}
          onOpenChange={() => setSelectedBill(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Bill Details</DialogTitle>
            </DialogHeader>
            {selectedBill && (
              <div>
                <p>Bill Number: {selectedBill.billNumber}</p>
                <p>Date: {format(new Date(selectedBill.date), "PPP")}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBill.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>₹{item.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">
                        ₹{selectedBill.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {pdfUrl && (
                  <Button
                    onClick={() => window.open(pdfUrl, "_blank")}
                    className="mt-4"
                  >
                    <FileText className="mr-2 h-4 w-4" /> View PDF
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
