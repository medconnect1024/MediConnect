import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Download, Plus, X, Search } from "lucide-react"

type BillItem = {
  id: string
  name: string
  cost: number
}

type Bill = {
  id: string
  billNumber: string
  date: string
  items: BillItem[]
  total: number
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      billNumber: 'BILL001',
      date: '2023-10-15',
      items: [
        { id: '1', name: 'Consultation', cost: 100 },
        { id: '2', name: 'X-Ray', cost: 150 },
      ],
      total: 250
    },
    {
      id: '2',
      billNumber: 'BILL002',
      date: '2023-11-20',
      items: [
        { id: '1', name: 'Consultation', cost: 100 },
        { id: '3', name: 'Blood Test', cost: 200 },
      ],
      total: 300
    },
  ])

  const [newBillItems, setNewBillItems] = useState<BillItem[]>([
    { id: '1', name: 'Consultation Charges', cost: 100 },
    { id: '2', name: 'Bed Charges', cost: 500 },
    { id: '3', name: 'ECG', cost: 150 },
    { id: '4', name: 'ICU', cost: 1000 },
  ])

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemCost, setNewItemCost] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState<BillItem[]>(newBillItems)

  useEffect(() => {
    const filtered = newBillItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [searchTerm, newBillItems])

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const handleCostEdit = (itemId: string, newCost: number) => {
    setNewBillItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, cost: newCost } : item
    ))
  }

  const handleAddNewItem = () => {
    if (newItemName && newItemCost) {
      const newItem: BillItem = {
        id: Date.now().toString(),
        name: newItemName,
        cost: parseFloat(newItemCost)
      }
      setNewBillItems(prev => [...prev, newItem])
      setNewItemName('')
      setNewItemCost('')
    }
  }

  const handleCreateBill = () => {
    const selectedBillItems = newBillItems.filter(item => selectedItems.includes(item.id))
    const total = selectedBillItems.reduce((sum, item) => sum + item.cost, 0)
    const newBill: Bill = {
      id: Date.now().toString(),
      billNumber: `BILL${bills.length + 1}`.padStart(7, '0'),
      date: new Date().toISOString().split('T')[0],
      items: selectedBillItems,
      total
    }
    setBills(prev => [...prev, newBill])
    setSelectedItems([])
  }

  const BillDetails = ({ bill }: { bill: Bill }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bill Details</DialogTitle>
          <DialogDescription>
            Bill Number: {bill.billNumber} | Date: {bill.date}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bill.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">₹{item.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">₹{bill.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Billing</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Create New Bill</h3>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="h-10">
                  <TableCell className="py-1">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemSelect(item.id)}
                    />
                  </TableCell>
                  <TableCell className="py-1">{item.name}</TableCell>
                  <TableCell className="py-1">
                    <Input
                      type="number"
                      value={item.cost}
                      onChange={(e) => handleCostEdit(item.id, parseFloat(e.target.value))}
                      className="w-24 h-8"
                    />
                  </TableCell>
                  <TableCell className="text-right py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewBillItems(prev => prev.filter(i => i.id !== item.id))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="New Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="h-8"
          />
          <Input
            type="number"
            placeholder="Cost"
            value={newItemCost}
            onChange={(e) => setNewItemCost(e.target.value)}
            className="h-8"
          />
          <Button 
            onClick={handleAddNewItem}
            className="bg-blue-500 hover:bg-blue-600 text-white h-8"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <Button onClick={handleCreateBill} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Create Bill
        </Button>

        <h3 className="text-lg font-semibold my-4">Bill History</h3>
        <ScrollArea className="h-[300px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-[60px] border-r">Sl. No</TableHead>
                <TableHead className="border-r">Bill Number</TableHead>
                <TableHead className="border-r">Bill Date</TableHead>
                <TableHead className="border-r">Total Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill, index) => (
                <TableRow key={bill.id} className="h-12 border-b">
                  <TableCell className="font-medium border-r">{index + 1}</TableCell>
                  <TableCell className="border-r">{bill.billNumber}</TableCell>
                  <TableCell className="border-r">{bill.date}</TableCell>
                  <TableCell className="border-r">₹{bill.total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      <BillDetails bill={bill} />
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
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