"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { TEST_CATEGORIES } from "@/components/data/investigations";
type PrescriptionItem = {
  id: string;
  name: string;
};

interface InvestigationsPageProps {
  investigations: PrescriptionItem[];
  setInvestigations: React.Dispatch<React.SetStateAction<PrescriptionItem[]>>;
  investigationNotes: string;
  setInvestigationNotes: React.Dispatch<React.SetStateAction<string>>;
}

// Mock data for related investigations
// const TEST_CATEGORIES: { [key: string]: string[] } = {
//   Haematology: ["Total RBC Count", "Hemoglobin", "Platelet Count", "ESR"],
//   Biochemistry: ["Blood Sugar", "Liver Function Test", "Kidney Function Test"],
//   "Liver Function Test": ["ALT", "AST", "Bilirubin"],
//   Microbiology: ["Culture Test", "Gram Stain", "KOH Test"],
// };

export default function InvestigationsPage({
  investigations,
  setInvestigations,
  investigationNotes,
  setInvestigationNotes,
}: InvestigationsPageProps) {
  const [categorySearch, setCategorySearch] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredTests, setFilteredTests] = useState<string[]>([]);

  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategorySearch(value);
    if (value) {
      const filtered = Object.keys(TEST_CATEGORIES).filter((category) =>
        category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  };

  const handleTestSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTestSearch(value);
    if (selectedCategory && value) {
      const filtered = TEST_CATEGORIES[selectedCategory].filter((test) =>
        test.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTests(filtered);
    } else {
      setFilteredTests([]);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategorySearch(category);
    setFilteredCategories([]);
  };

  const handleTestSelect = (test: string) => {
    if (selectedCategory) {
      const combinedName = `${selectedCategory} - ${test}`;
      addInvestigation(combinedName);
    }
  };

  const handleAddCustom = () => {
    if (categorySearch && testSearch) {
      const combinedName = `${categorySearch} - ${testSearch}`;
      addInvestigation(combinedName);
    }
  };

  const addInvestigation = (name: string) => {
    const newItem: PrescriptionItem = {
      id: Date.now().toString(),
      name: name,
    };
    setInvestigations((prev) => [...prev, newItem]);
    setTestSearch("");
    setFilteredTests([]);
  };

  const handleRemoveItem = (id: string) => {
    setInvestigations((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Investigations</h3>
      <div className="mb-4 flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-3 text-lg"
            placeholder="Search categories (e.g., Haematology)"
            value={categorySearch}
            onChange={handleCategorySearch}
          />
          {filteredCategories.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCategories.map((category, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-3 text-lg"
            placeholder={
              selectedCategory
                ? `Search tests in ${selectedCategory}`
                : "Search tests"
            }
            value={testSearch}
            onChange={handleTestSearch}
          />
          {filteredTests.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredTests.map((test, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={() => handleTestSelect(test)}
                >
                  {test}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-10"
          onClick={handleAddCustom}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      <ScrollArea className="h-[150px] mt-4 border rounded-md">
        <div className="p-3">
          <h4 className="text-lg font-semibold mb-2">
            Selected Investigations
          </h4>
          <div className="flex flex-wrap gap-3">
            {investigations.map((item) => (
              <div key={item.id} className="flex items-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex items-center gap-2 text-lg"
                >
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
      <Textarea
        placeholder="Investigation Notes"
        value={investigationNotes}
        onChange={(e) => setInvestigationNotes(e.target.value)}
        className="mt-4"
      />
    </div>
  );
}
