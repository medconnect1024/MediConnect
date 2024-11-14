'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, X, ChevronDown } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Textarea } from "@/components/ui/textarea"
import { INVESTIGATION_NAMES } from "@/components/data/investigationNames"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PrescriptionItem = {
  id: string
  name: string
}

interface InvestigationsPageProps {
  investigations: PrescriptionItem[]
  setInvestigations: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>
  investigationNotes: string
  setInvestigationNotes: React.Dispatch<React.SetStateAction<string>>
}

// Mock data for related investigations
const RELATED_INVESTIGATIONS: { [key: string]: string[] } = {
  CBC: ["Hemoglobin", "WBC Count", "Platelet Count"],
  "Thyroid Profile": ["TSH", "T3", "T4"],
  "Liver Function Test": ["ALT", "AST", "Bilirubin"],
  "Kidney Function Test": ["Creatinine", "BUN", "eGFR"],
  "Blood Sugar": ["Fasting Blood Sugar", "HbA1c", "Postprandial Blood Sugar"],
  "Lipid Profile": ["Total Cholesterol", "HDL", "LDL", "Triglycerides"],
}

export default function InvestigationsPage({
  investigations,
  setInvestigations,
  investigationNotes,
  setInvestigationNotes,
}: InvestigationsPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [selectedInvestigation, setSelectedInvestigation] = useState<string | null>(null)
  const [relatedInvestigations, setRelatedInvestigations] = useState<string[]>([])

  const searchResults = useQuery(api.patientsearch.search, { searchTerm })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value) {
      const filtered = INVESTIGATION_NAMES.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }

  const handleAddItem = (item: string) => {
    const newItem: PrescriptionItem = { id: Date.now().toString(), name: item }
    setInvestigations((prev) => [...prev, newItem])
    setSelectedInvestigation(item)
    setRelatedInvestigations(RELATED_INVESTIGATIONS[item] || [])
    setSearchTerm("")
    setFilteredSuggestions([])
  }

  const handleRemoveItem = (id: string) => {
    setInvestigations((prev) => prev.filter((item) => item.id !== id))
  }

  const handleRelatedInvestigationToggle = (relatedItem: string) => {
    const isAlreadyAdded = investigations.some((item) => item.name === relatedItem)
    if (isAlreadyAdded) {
      setInvestigations((prev) => prev.filter((item) => item.name !== relatedItem))
    } else {
      const newItem: PrescriptionItem = { id: Date.now().toString(), name: relatedItem }
      setInvestigations((prev) => [...prev, newItem])
    }
  }

  useEffect(() => {
    // Here you can handle data passing to the Prescription page dynamically
    // Add any necessary data handling or state syncing here if needed.
  }, [investigations])

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Investigations</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-3 text-lg"
            placeholder="Search investigations (e.g., CBC, Thyroid Profile)"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-10"
          onClick={() => {
            if (searchTerm.trim()) {
              handleAddItem(searchTerm.trim())
            }
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      {filteredSuggestions.length > 0 && (
        <ul className="mt-4 space-y-2 border border-gray-300 rounded-md">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => handleAddItem(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <ScrollArea className="h-[150px] mt-4 border rounded-md">
        <div className="p-3">
          <h4 className="text-lg font-semibold mb-2">Selected Investigations</h4>
          <div className="flex flex-wrap gap-3">
            {investigations.map((item) => (
              <div key={item.id} className="flex items-center">
                <Button variant="secondary" size="lg" className="flex items-center gap-2 text-lg ">
                  {item.name}
                </Button>
                <X
                  className="h-4 w-4 cursor-pointer text-red-500 ml-2"
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      {selectedInvestigation && relatedInvestigations.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mt-4">
              Related to {selectedInvestigation} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {relatedInvestigations.map((relatedItem) => (
              <DropdownMenuCheckboxItem
                key={relatedItem}
                checked={investigations.some((item) => item.name === relatedItem)}
                onCheckedChange={() => handleRelatedInvestigationToggle(relatedItem)}
              >
                {relatedItem}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Textarea
        placeholder="Investigation Notes"
        value={investigationNotes}
        onChange={(e) => setInvestigationNotes(e.target.value)}
        className="mt-4"
      />
    </div>
  )
}