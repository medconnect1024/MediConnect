import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileIcon, PlusIcon, Eye } from "lucide-react"

type LabReport = {
  id: string
  date: string
  notes: string
  fileUrl: string
  fileType: 'pdf' | 'image'
}

export default function LabReportPage() {
  const [reports, setReports] = useState<LabReport[]>([
    { id: '1', date: '2023-10-15', notes: 'Annual blood work', fileUrl: '/sample.pdf', fileType: 'pdf' },
    { id: '2', date: '2023-11-02', notes: 'X-ray results', fileUrl: '/sample.jpg', fileType: 'image' },
    // Adding more sample reports to demonstrate scrolling
    { id: '3', date: '2023-12-01', notes: 'MRI scan', fileUrl: '/sample.pdf', fileType: 'pdf' },
    { id: '4', date: '2024-01-15', notes: 'Follow-up blood test', fileUrl: '/sample.pdf', fileType: 'pdf' },
    { id: '5', date: '2024-02-20', notes: 'Allergy test results', fileUrl: '/sample.jpg', fileType: 'image' },
  ])

  const [newReport, setNewReport] = useState<Partial<LabReport>>({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    fileUrl: '',
    fileType: 'pdf'
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf'
      setNewReport(prev => ({ ...prev, fileUrl: URL.createObjectURL(file), fileType }))
    }
  }

  const handleUpload = () => {
    if (newReport.notes && newReport.fileUrl) {
      setReports(prev => [{ ...newReport, id: Date.now().toString() } as LabReport, ...prev])
      setNewReport({ date: new Date().toISOString().split('T')[0], notes: '', fileUrl: '', fileType: 'pdf' })
    }
  }

  const ViewReport = ({ report }: { report: LabReport }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lab Report</DialogTitle>
          <DialogDescription>
            Date: {report.date}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p><strong>Notes:</strong> {report.notes}</p>
          {report.fileType === 'pdf' ? (
            <iframe src={report.fileUrl} width="100%" height="500px" />
          ) : (
            <img src={report.fileUrl} alt="Lab Report" style={{ maxWidth: '100%', height: 'auto' }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Lab Reports</CardTitle>
      </CardHeader>
      <CardContent>
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
                onChange={(e) => setNewReport(prev => ({ ...prev, date: e.target.value }))}
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
                onChange={(e) => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
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
                />
              </div>
            </div>
            <Button 
              onClick={handleUpload} 
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
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
                <TableHead>Report Date</TableHead>
                <TableHead>Report Notes</TableHead>
                <TableHead className="text-right">View Report</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.notes}</TableCell>
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
  )
}