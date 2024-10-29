"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Predefined findings list
const FINDINGS = [
  "Abdominal Bruits",
  "Abdominal Distension",
  "Abdominal Masses",
  "Abdominal Pulsation",
  "Abdominal Rigidity",
  "Abdominal Scars",
  "Abnormal Carotid Pulse Character",
  "Abnormal Dentition",
  "Absent Corneal Reflex",
  "Absent Lower Limb Pulses",
  "Absent Pharyngeal Reflex",
  "Absent Pupillary Light Reflexes",
  "Acetone Breath",
  "Adie's Tonic Pupil",
  "Affect",
  "Alcoholic Foetor",
  "Angular Cheilitis",
  "Anisocoria (Unequal Pupils)",
  "Anomia",
  "Anosmia",
  "Antalgic Gait",
  "Anterior Draw Test",
  "Anterograde Amnesia",
  "Apley Scratch Test",
  "Appearance",
  "Apprehension Test",
  "Appropriateness of Affect",
  "Apraxia",
  "Apraxic Gait",
  "Argyll Robertson Pupil",
  "Arm Elevation Test",
  "Arterial Skin Changes",
  "Arterial Ulcers",
  "Arteriovenous Fistulas",
  "Arteriovenous Nicking",
  "Asterixis",
  "Asymmetric Soft Palate Rise",
  "Ataxic Gait",
  "Atrophic Glossitis",
  "Auditory Acuity",
  "Auditory Hallucinations",
  "Augmentation Test",
  "Babinski Sign",
  "Baker's Cyst",
  "Barrel Chest",
  "Bier Spots",
  "Bitemporal Hemianopia",
  "Bizarre Appearance",
  "Bladder Distension",
  "Bony Tenderness",
  "Bouchard's Nodes",
  "Boutonniere Deformity",
  "Bowel Sounds",
  "Bradycardia",
  "Bradykinesia / Hypokinesia",
  "Bradypnoea",
  "Bronchial Breath Sounds",
  "Brudzinski's Sign",
  "Bulbar Fatigability",
  "Cafe au Lait Spots",
  "Callosities of the Ankle and Foot",
  "Capgras Syndrome",
  "Caput Medusae",
  "Carotid Bruit",
  "Category Fluency",
  "Central Cyanosis",
  "Central Visual Fields",
  "Centre of Gravity",
  "Cervical Hyperlordosis",
  "Charcot Foot",
  "Chest Expansion",
  "Chest Wall Tenderness",
  "Cheyne-Stokes Respiration",
  "Chorea",
  "Chvostek's Sign",
  "Circumlocution",
  "Claw Hand",
  "Claw Toe",
  "Clonus",
  "Cog Wheel Rigidity",
  "Collapsing Pulse",
  "Colour Vision",
  "Compulsions",
  "Conceptualisation",
  "Confusion",
  "Conjunctival Pallor",
  "Continuous Murmur",
  "Cool Extremities",
  "Cotton Wool Spots",
  "Cough",
  "Cover Test",
  "Cozen's Test",
  "Crackles / Crepitations",
  "Cullen's Sign",
  "Cutaneous Nodules",
  "Dactylitis",
  "Decreased Tactile Fremitus",
  "Dehydration",
  "Delusions",
  "Dental Caries",
  "Dental Erosions",
  "Dental Trauma",
  "Depersonalization",
  "Depressive Thought Content",
  "Derealization",
  "Diastolic Murmur",
  "Digital Clubbing",
  "Diplopia",
  "Disordered Reading",
  "Disordered Writing",
  "Disorganised Behaviour",
  "Displaced Apex Beat",
  "Dissociative Symptoms",
  "Distal Weakness",
  "Double Impulse Apex Beat",
  "Dull Percussion Note",
  "Dupuytren's Contracture",
  "Dysdiadochokinesis",
  "Dysmegalopsia",
  "Dystonia",
  "Echophenomena",
  "Elbow Bruising",
  "Elbow Carrying Angle",
  "Elbow Deformity",
  "Empty Can Test",
  "Erotomanic Delusions",
  "Erythroderma",
  "Exaggerated Pharyngeal Reflex",
  "Exanthematous Rash",
  "Facial Weakness",
  "Fasciculations",
  "Femoral Nerve Stretch Test",
  "Festinating Gait",
  "Finger-Nose Test",
  "Fissure in Ano",
  "Flank Tenderness",
  "Flat Affect",
  "Flexor Tendon Crepitus",
  "Flight of Ideas",
  "Fluid Overload",
  "Fluid Wave",
  "Focal Abdominal Tenderness",
  "Foetor Hepaticus",
  "Foot Drop",
  "Foot Position",
  "Formal Thought Disorders",
  "Fourth Heart Sound",
  "Gangrene",
  "Generalised Abdominal Tenderness",
  "Genu Recurvatum (Back-Knee)",
  "Genu Valgum (Knock-Knee)",
  "Genu Varum (Bow Leg)",
  "Gingival Bleeding",
  "Gingival Hypertrophy",
  "Gingival Inflammation",
  "Gottron's Papules",
  "Grandiose Delusions",
  "Grey-Turner's Sign",
  "Gynaecomastia",
  "Haemorrhoids",
  "Halitosis",
  "Hallux Valgus",
  "Hand of Benediction",
  "Harsh Speech",
  "Heberden's Nodes",
  "Heel Walking",
  "Heel-to-Shin Test",
  "Heliotrope Rash",
  "Hepatomegaly",
  "Herniae",
  "High-Arched Palate",
  "Hoarseness",
  "Homonymous Hemianopia",
  "Homonymous Quadrantanopia",
  "Hyperactivity",
  "Hyperaesthesia",
  "Hyperkeratosis",
  "Hypernasal Speech",
  "Hyperpigmentation",
  "Hyperreflexia",
  "Hyperresonant Percussion Note",
  "Hypertension",
  "Hypoaesthesia",
  "Hypophonia",
  "Hyporeflexia",
  "Hypotension",
  "Illusions",
  "Impaired Accommodation",
  "Impaired Digit Span",
  "Impaired Executive Function",
  "Impaired Judgement",
  "Impaired Rapid Foot Tapping",
  "Inattention",
  "Increased Anal Sphincter Tone",
  "Increased Body Mass Index",
  "Increased Body Temperature",
  "Increased Glabellar Reflex",
  "Increased Tactile Fremitus",
  "Increased Vocal Resonance",
  "Increased Waist-Hip Ratio",
  "Ingrown Toenails",
  "Inhibitory Control",
  "Injection Sites",
  "Intensity of Affect",
  "Intention Tremor",
  "Internuclear Ophthalmoplegia",
  "Irregular Pulse",
  "Irritability",
  "Janeway Lesions",
  "Jaundice",
  "Jaw Jerk",
  "Jealous Delusions",
  "Jerk Nystagmus",
  "Kayser-Fleischer Rings",
  "Kernig's Sign",
  "Koilonychia",
  "Kolbel's Bow Test",
  "Kussmaul Respiration",
  "Lability of Mood",
  "Lead Pipe Rigidity",
  "Leg Length Discrepancy",
  "Leg Tenderness",
  "Lesser Toe Deformities",
  "Leukonychia",
  "Leukoplakia",
  "Level of Happiness",
  "Lhermitte's Sign",
  "Lift Off Test",
  "Light Touch Sensation",
  "Limitation of Extraocular Movement",
  "Limited Active Movement",
  "Lip Pigmentation",
  "Lip Ulceration",
  "Livedo Reticularis",
  "Liver Nodularity",
  "Log Roll Test",
  "Loss of Cervical Lordosis",
  "Loss of Chest Hair Distribution",
  "Loss of Lumbar Lordosis",
  "Loss of Proprioception",
  "Loud P2",
  "Loud S1",
  "Lower Limb Erythema",
  "Lower Motor Neuron Weakness",
  "Lupus Pernio",
  "Lymphadenopathy",
  "Maculopapular Rash",
  "March a Petit Poids",
  "Mastoid Tenderness",
  "McBurney's Point Tenderness",
  "McMurray's Test for the Lateral Meniscus",
  "McMurray's Test for the Medial Meniscus",
  "Mechanic's Hands",
  "Micrographia",
  "Miosis",
  "Mitral Facies",
  "Mixed UMN and LMN Weakness",
  "Monoarthritis",
  "Morbilliform Rash",
  "Mouth Ulcers",
  "Murphy's Sign",
  "Muscle Wasting",
  "Mydriasis",
  "Myoclonus",
  "Myopathic Facies",
  "Nail Bed Cyanosis",
  "Nail Pitting",
  "Narrow Pulse Pressure",
  "Nasal Discharge",
  "Nasal Septal Deviation",
  "Nasal Septal Perforation",
  "Nasal Sinus Tenderness",
  "Nasal Sinus Transillumination",
  "Neck Flexion Limitation",
  "Neck Masses",
  "Negative Affective Cognitive Style",
  "Neologisms",
  "Neurogenic Claudication",
  "Next Finger Test",
  "Nicoladoni-Branham Sign",
  "Nightingale Sign",
  "Nipple Retraction",
  "Nocturnal Cough",
  "Nocturnal Enuresis",
  "Non Tender Lymph Nodes",
  "Non Visible Apical Impulse",
  "Obesity",
  "Obstruction of External Ear Canal",
  "Occipital Nodes",
  "Oligoclonal Bands",
  "Oliguria",
  "Onycholysis",
  "Optic Atrophy",
  "Orthostatic Hypotension",
  "Oscillopsia",
  "Pachyonychia",
  "Pallor",
  "Palpable Distended Bladder",
  "Palpable Liver Edge",
  "Palpable Lymph Nodes",
  "Palpable Thyroid",
  "Palpation",
  "Panic Attacks",
  "Panniculitis",
  "Papilledema",
  "Paresthesia",
  "Patellar Tendon Reflex",
  "Pectus Carinatum",
  "Pectus Excavatum",
  "Pencil Grip Test",
  "Percussion",
  "Peripheral Edema",
  "Peripheral Neuropathy",
  "Pes Planus",
  "Pharyngeal Reflex",
  "Phobia",
  "Phonophobia",
  "Physical Agitation",
  "Plantar Fasciitis",
  "Pneumothorax",
  "Polydipsia",
  "Polyphagia",
  "Polyuria",
  "Positive Antibodies",
  "Positive Affect",
  "Positive Froment's Sign",
  "Positive Gower's Sign",
  "Positive Grasp Reflex",
  "Positive Neck Scratch Test",
  "Positive Ortolani Sign",
  "Positive Phalen's Sign",
  "Positive Phototherapy",
  "Positive Spurling's Test",
  "Pseudobulbar Affect",
  "Ptosis",
  "Purpura",
  "Pulse",
  "Pulsus Paradoxus",
  "Q-Angle",
  "Rales",
  "Redness",
  "Reflex",
  "Reflex Sympathetic Dystrophy",
  "Rhythm",
  "Rigidity",
  "Romberg Test",
  "Rosenbaum Test",
  "Roth Spots",
  "Saddle Nose",
  "Scars",
  "Schamroth's Window Test",
  "Scissoring Gait",
  "Scleral Icterus",
  "Scoliosis",
  "Scrotal Asymmetry",
  "Scrotal Edema",
  "Scrotal Masses",
  "Scrotal Swelling",
  "Seated Flexion Test",
  "Self Mutilation",
  "Senile Purpura",
  "Sensation",
  "Shape of Chest",
  "Shock",
  "Signs",
  "Simple Phobia",
  "Skin Tags",
  "Soft Tissue Crepitus",
  "Somnambulism",
  "Spasmodic Dysphonia",
  "Speech",
  "Splenomegaly",
  "Spongy Gums",
  "Stadium Test",
  "Steady Gait",
  "Stellate Fracture",
  "Sternoclavicular Swelling",
  "Sternal Tenderness",
  "Still's Murmur",
  "Stomatitis",
  "Straight Leg Raising",
  "Striae",
  "Stye",
  "Subacute Granulomatous Thyroiditis",
  "Subclavian Steal Syndrome",
  "Suction Test",
  "Subungual Hematoma",
  "Sugihara's sign",
  "Superior Quadrantanopia",
  "Superior Sulcus Tumor",
  "Swelling",
  "Symmetry",
  "Tachycardia",
  "Tachypnea",
  "Tenesmus",
  "Thickened Nuchal Folds",
  "Thyroid Nodule",
  "Tilted Head",
  "Toe Walking",
  "Tongue Deviation",
  "Tongue Fasciculation",
  "Tongue Tremor",
  "Tonsillar Hypertrophy",
  "Torticollis",
  "Tracheal Deviation",
  "Tracheal Tug",
  "Tremor",
  "Tremor at Rest",
  "Trismus",
  "Tripod Position",
  "Ulcer",
  "Unsteadiness",
  "Upbeating Nystagmus",
  "Uveitis",
  "Varicose Veins",
  "Ventral Hernia",
  "Visual Acuity",
  "Visual Hallucinations",
  "Weakness",
  "Wheeze",
  "Whispered Pectoriloquy",
  "Witzelsucht",
  "Wrist Drop",
];

type FindingItem = {
  id: string;
  name: string;
};

interface FindingsComponentProps {
  findings: FindingItem[];
  setFindings: React.Dispatch<React.SetStateAction<FindingItem[]>>;
  chronicCondition: boolean;
  setChronicCondition: React.Dispatch<React.SetStateAction<boolean>>;
  vitals: {
    temperature: string;
    bloodPressure: string;
    pulse: string;
  };
  setVitals: React.Dispatch<
    React.SetStateAction<{
      temperature: string;
      bloodPressure: string;
      pulse: string;
    }>
  >;
}

export default function FindingsComponent({
  findings,
  setFindings,
  chronicCondition,
  setChronicCondition,
  vitals,
  setVitals,
}: FindingsComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filter findings based on search term
  const filteredFindings = useMemo(() => {
    if (!searchTerm) return [];
    return FINDINGS.filter((finding) =>
      finding.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Adds a finding to the list immediately
  const handleAddItem = (item: string) => {
    if (!findings.some((f) => f.name === item)) {
      const newItem: FindingItem = { id: Date.now().toString(), name: item };
      setFindings((prev) => [...prev, newItem]);
    }
    setSearchTerm("");
    setIsSearching(false);
  };

  // Removes a finding by its ID
  const handleRemoveItem = (id: string) => {
    setFindings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Findings</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-3 text-lg"
            placeholder="Search findings (e.g., Throat Congestion, Fever)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearching(true);
            }}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-10"
          onClick={() => {
            if (searchTerm.trim()) {
              handleAddItem(searchTerm.trim());
            }
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {isSearching && filteredFindings.length > 0 && (
        <ul className="mt-4 space-y-2 absolute z-10 bg-background border rounded-md shadow-lg max-h-60 overflow-auto w-full max-w-[calc(100%-5rem)]">
          {filteredFindings.map((finding) => (
            <li
              key={finding}
              className="p-2 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
              onClick={() => handleAddItem(finding)}
            >
              {finding}
            </li>
          ))}
        </ul>
      )}
      <ScrollArea className="h-[150px] mt-4">
        <div className="flex flex-wrap gap-3">
          {findings.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <button className="flex items-center gap-2 text-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                {item.name}
              </button>
              <X
                className="h-4 w-4 text-red-500 cursor-pointer"
                onClick={() => handleRemoveItem(item.id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Vitals Input Section */}
      <h4 className="text-lg font-semibold mt-6">Vitals</h4>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Temperature"
          value={vitals.temperature}
          onChange={(e) =>
            setVitals({ ...vitals, temperature: e.target.value })
          }
        />
        <Input
          placeholder="Blood Pressure"
          value={vitals.bloodPressure}
          onChange={(e) =>
            setVitals({ ...vitals, bloodPressure: e.target.value })
          }
        />
        <Input
          placeholder="Pulse"
          value={vitals.pulse}
          onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
        />
      </div>

      {/* Chronic Condition Checkbox */}
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="chronicCondition"
          checked={chronicCondition}
          onCheckedChange={(checked) => setChronicCondition(checked as boolean)}
        />
        <Label htmlFor="chronicCondition">Chronic Condition</Label>
      </div>
    </div>
  );
}
