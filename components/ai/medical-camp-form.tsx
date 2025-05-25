"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/utils/supabase/client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const initialForm = {
    title: "",
    city: "",
    state: "",
    pincode: "",
    category: "",
    shortDescription: "",
    address: "",
    startDateTime: "",
    endDateTime: "",
    bannerImageUrl: "",
    latitude: "",
    longitude: "",
    doctors: "",
    services: "",
    organizerName: "",
    organizerContact: "",
    organizerEmail: "",
    additionalFacilities: "",
    additionalRequirements: "",
    additionalSpecialInstructions: "",
    registrationDeadline: "",
    registrationIsRequired: false,
    registrationLink: "",
    registrationPhone: "",
};

export default function MedicalCampForm() {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [savedCamp, setSavedCamp] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const createMedicalCamp = useMutation(api.medicalCamps.createMedicalCamp);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setForm({
                ...form,
                [name]: e.target.checked,
            });
        } else {
            setForm({
                ...form,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            // Prepare data for Convex mutation
            const campData = {
                title: form.title,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
                category: form.category,
                shortDescription: form.shortDescription,
                address: form.address,
                startDateTime: form.startDateTime ? new Date(form.startDateTime).getTime() : Date.now(),
                endDateTime: form.endDateTime ? new Date(form.endDateTime).getTime() : Date.now(),
                bannerImageUrl: form.bannerImageUrl,
                latitude: form.latitude ? parseFloat(form.latitude) : 0,
                longitude: form.longitude ? parseFloat(form.longitude) : 0,
                doctors: form.doctors ? form.doctors.split(",").map((d) => d.trim()).filter(Boolean) : [],
                services: form.services ? form.services.split(",").map((s) => s.trim()).filter(Boolean) : [],
                organizerName: form.organizerName,
                organizerContact: form.organizerContact,
                organizerEmail: form.organizerEmail,
                additionalInfo: {
                    facilities: form.additionalFacilities ? form.additionalFacilities.split(",").map((f) => f.trim()).filter(Boolean) : [],
                    requirements: form.additionalRequirements ? form.additionalRequirements.split(",").map((r) => r.trim()).filter(Boolean) : [],
                    specialInstructions: form.additionalSpecialInstructions,
                },
                registration: {
                    deadline: form.registrationDeadline,
                    isRequired: form.registrationIsRequired,
                    link: form.registrationLink,
                    phone: form.registrationPhone,
                },
            };
            const campId = await createMedicalCamp(campData);
            // --- Embedding logic ---
            // Combine fields for embedding
            const embeddingInput = [
                campData.title,
                campData.shortDescription,
                campData.city,
                campData.state,
                campData.category,
                campData.address,
                campData.services.join(", "),
                campData.doctors.join(", "),
                campData.organizerName,
                campData.organizerContact,
                campData.organizerEmail,
                campData.additionalInfo?.facilities?.join(", ") ?? "",
                campData.additionalInfo?.requirements?.join(", ") ?? "",
                campData.additionalInfo?.specialInstructions ?? "",
            ].join(". ");
            // Get embedding from OpenAI
            const embeddingRes = await fetch("/api/getEmbeddings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: embeddingInput }),
            });
            if (!embeddingRes.ok) throw new Error("Failed to generate embedding");
            const embeddingJson = await embeddingRes.json();
            const embedding = embeddingJson.data[0].embedding;
            // Save to Supabase
            const { error: supabaseError } = await supabase.from("medical_camp_embeddings").insert([
                {
                    camp_id: campId,
                    embedding,
                    // content: embeddingInput,
                },
            ]);
            if (supabaseError) throw supabaseError;
            setSavedCamp({ ...campData, _id: campId });
            setSuccess(true);
            toast({ title: "Camp added!", description: "Medical camp and embedding saved successfully.", variant: "success" });
            setForm(initialForm);
        } catch (err: any) {
            setError(err?.message || "Failed to add camp");
            toast({ title: "Error", description: err?.message || "Failed to add camp", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-blue-700 text-2xl text-center">Add Medical Camp</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" value={form.category} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" value={form.city} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <Input id="state" name="state" value={form.state} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" value={form.address} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="bannerImageUrl">Banner Image URL</Label>
                                <Input id="bannerImageUrl" name="bannerImageUrl" value={form.bannerImageUrl} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input id="latitude" name="latitude" value={form.latitude} onChange={handleChange} type="number" step="any" />
                            </div>
                            <div>
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input id="longitude" name="longitude" value={form.longitude} onChange={handleChange} type="number" step="any" />
                            </div>
                            <div>
                                <Label htmlFor="doctors">Doctors (comma-separated)</Label>
                                <Input id="doctors" name="doctors" value={form.doctors} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="services">Services (comma-separated or text)</Label>
                                <Input id="services" name="services" value={form.services} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="shortDescription">Short Description</Label>
                            <Textarea id="shortDescription" name="shortDescription" value={form.shortDescription} onChange={handleChange} required />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Label htmlFor="startDateTime">Start Date/Time</Label>
                                <Input id="startDateTime" type="datetime-local" name="startDateTime" value={form.startDateTime} onChange={handleChange} required />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="endDateTime">End Date/Time</Label>
                                <Input id="endDateTime" type="datetime-local" name="endDateTime" value={form.endDateTime} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="organizerName">Organizer Name</Label>
                                <Input id="organizerName" name="organizerName" value={form.organizerName} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="organizerContact">Organizer Contact</Label>
                                <Input id="organizerContact" name="organizerContact" value={form.organizerContact} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="organizerEmail">Organizer Email</Label>
                                <Input id="organizerEmail" name="organizerEmail" value={form.organizerEmail} onChange={handleChange} required />
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div>
                            <h2 className="font-semibold text-blue-700 mb-2">Additional Info</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="additionalFacilities">Facilities (comma-separated)</Label>
                                    <Input id="additionalFacilities" name="additionalFacilities" value={form.additionalFacilities} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="additionalRequirements">Requirements (comma-separated)</Label>
                                    <Input id="additionalRequirements" name="additionalRequirements" value={form.additionalRequirements} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="additionalSpecialInstructions">Special Instructions</Label>
                                    <Input id="additionalSpecialInstructions" name="additionalSpecialInstructions" value={form.additionalSpecialInstructions} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div>
                            <h2 className="font-semibold text-blue-700 mb-2">Registration</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div>
                                    <Label htmlFor="registrationDeadline">Deadline</Label>
                                    <Input id="registrationDeadline" type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="registrationLink">Registration Link</Label>
                                    <Input id="registrationLink" name="registrationLink" value={form.registrationLink} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="registrationPhone">Registration Phone</Label>
                                    <Input id="registrationPhone" name="registrationPhone" value={form.registrationPhone} onChange={handleChange} />
                                </div>
                                <div className="flex items-center gap-2 mt-6 md:mt-0">
                                    <Checkbox id="registrationIsRequired" name="registrationIsRequired" checked={form.registrationIsRequired} onCheckedChange={(checked: boolean | "indeterminate") => setForm(f => ({ ...f, registrationIsRequired: !!checked }))} />
                                    <Label htmlFor="registrationIsRequired">Is Required</Label>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Add Camp"}
                        </Button>
                    </form>
                    {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            <div className="font-semibold mb-2">Camp added successfully!</div>
                            <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(savedCamp, null, 2)}</pre>
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-2 bg-red-100 border border-red-200 rounded text-red-700">{error}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 