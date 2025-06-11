"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/utils/supabase/client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Add types for nested objects
interface Variations {
    colors: string;
    sizes: string;
    features: string;
}
interface KeyAttributes {
    condition: string;
    brand: string;
    model: string;
    warranty: string;
    certification: string;
    origin: string;
}
interface SupplierInfo {
    yearsInBusiness: string;
    location: string;
    responseTime: string;
    onTimeDelivery: string;
    totalOrders: string;
    reorderRate: string;
}
interface ProductFormState {
    name: string;
    description: string;
    price: string;
    oldPrice: string;
    discount: string;
    image: string;
    category: string;
    inStock: boolean;
    stockCount: string;
    source: string;
    supplier: string;
    supplierLogo: string;
    minOrder: string;
    rating: string;
    reviewCount: string;
    expiryDate: string;
    variations: Variations;
    images: string;
    keyAttributes: KeyAttributes;
    supplierInfo: SupplierInfo;
    reviews: string;
}

const initialForm: ProductFormState = {
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",
    image: "",
    category: "",
    inStock: false,
    stockCount: "",
    source: "",
    supplier: "",
    supplierLogo: "",
    minOrder: "",
    rating: "",
    reviewCount: "",
    expiryDate: "",
    variations: { colors: "", sizes: "", features: "" },
    images: "",
    keyAttributes: { condition: "", brand: "", model: "", warranty: "", certification: "", origin: "" },
    supplierInfo: { yearsInBusiness: "", location: "", responseTime: "", onTimeDelivery: "", totalOrders: "", reorderRate: "" },
    reviews: "",
};

const ProductForm = () => {
    const [form, setForm] = useState<ProductFormState>(initialForm);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [savedProduct, setSavedProduct] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const addProduct = useMutation(api.quickmedi.addProduct);

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

    const handleNestedChange = <T extends keyof ProductFormState>(
        e: React.ChangeEvent<HTMLInputElement>,
        group: T
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [group]: {
                ...(typeof prev[group] === "object" && prev[group] !== null ? prev[group] : {}),
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            // Prepare data for Convex mutation
            const productData = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price) || 0,
                oldPrice: parseFloat(form.oldPrice) || 0,
                discount: parseFloat(form.discount) || 0,
                image: form.image,
                category: form.category,
                inStock: form.inStock,
                stockCount: parseInt(form.stockCount) || 0,
                source: form.source,
                supplier: form.supplier,
                supplierLogo: form.supplierLogo,
                minOrder: form.minOrder || undefined,
                rating: form.rating ? parseFloat(form.rating) : undefined,
                reviewCount: form.reviewCount ? parseInt(form.reviewCount) : undefined,
                expiryDate: form.expiryDate,
                variations: {
                    colors: form.variations.colors.split(",").map((c) => c.trim()).filter(Boolean),
                    sizes: form.variations.sizes.split(",").map((s) => s.trim()).filter(Boolean),
                    features: form.variations.features.split(",").map((f) => f.trim()).filter(Boolean),
                },
                images: form.images ? form.images.split(",").map((img) => img.trim()).filter(Boolean) : undefined,
                keyAttributes: {
                    condition: form.keyAttributes.condition,
                    brand: form.keyAttributes.brand,
                    model: form.keyAttributes.model,
                    warranty: form.keyAttributes.warranty,
                    certification: form.keyAttributes.certification,
                    origin: form.keyAttributes.origin,
                },
                supplierInfo: {
                    yearsInBusiness: form.supplierInfo.yearsInBusiness,
                    location: form.supplierInfo.location,
                    responseTime: form.supplierInfo.responseTime,
                    onTimeDelivery: form.supplierInfo.onTimeDelivery,
                    totalOrders: form.supplierInfo.totalOrders ? parseInt(form.supplierInfo.totalOrders) : 0,
                    reorderRate: form.supplierInfo.reorderRate,
                },
                reviews: [], // For now, reviews can be added later
            };
            const productId = await addProduct(productData);
            // --- Embedding logic ---
            // Combine fields for embedding
            const embeddingInput = [
                productData.name,
                productData.description,
                productData.category,
                productData.supplier,
                productData.supplierInfo?.location ?? "",
                productData.keyAttributes?.brand ?? "",
                productData.keyAttributes?.model ?? "",
                productData.keyAttributes?.certification ?? "",
                productData.variations?.features?.join(", ") ?? "",
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
            const { error: supabaseError } = await supabase.from("products").insert([
                {
                    convex_id: productId,
                    embedding,
                },
            ]);
            if (supabaseError) throw supabaseError;
            setSavedProduct({ ...productData, _id: productId });
            setSuccess(true);
            toast({ title: "Product added!", description: "Product and embedding saved successfully.", variant: "success" });
            setForm(initialForm);
        } catch (err: any) {
            setError(err?.message || "Failed to add product");
            toast({ title: "Error", description: err?.message || "Failed to add product", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Add a New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Product Details */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <h3 className="text-lg font-medium mb-4 border-b pb-2">Product Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" name="name" placeholder="Digital Blood Pressure Monitor" value={form.name} onChange={handleChange} />
                                </div>
                                <div className="lg:col-span-3">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Accurate and easy-to-use digital blood pressure monitor..." value={form.description} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" type="number" placeholder="79.99" value={form.price} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="oldPrice">Old Price</Label>
                                    <Input id="oldPrice" name="oldPrice" type="number" placeholder="99.99" value={form.oldPrice} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="discount">Discount (%)</Label>
                                    <Input id="discount" name="discount" type="number" placeholder="20" value={form.discount} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" name="category" placeholder="Monitoring Devices" value={form.category} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="stockCount">Stock Count</Label>
                                    <Input id="stockCount" name="stockCount" type="number" placeholder="34" value={form.stockCount} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="minOrder">Min. Order</Label>
                                    <Input id="minOrder" name="minOrder" placeholder="1 piece" value={form.minOrder} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="rating">Rating (1-5)</Label>
                                    <Input id="rating" name="rating" type="number" step="0.1" placeholder="4.5" value={form.rating} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="reviewCount">Review Count</Label>
                                    <Input id="reviewCount" name="reviewCount" type="number" placeholder="127" value={form.reviewCount} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="expiryDate">Expiry Date</Label>
                                    <Input id="expiryDate" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <Label htmlFor="image">Main Image URL</Label>
                                    <Input id="image" name="image" type="url" placeholder="https://images.unsplash.com/..." value={form.image} onChange={handleChange} />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <Label htmlFor="images">Additional Image URLs (comma-separated)</Label>
                                    <Input id="images" name="images" type="text" placeholder="https://.../img1.jpg, https://.../img2.jpg" value={form.images} onChange={handleChange} />
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <Input id="inStock" name="inStock" type="checkbox" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} className="h-4 w-4" />
                                    <Label htmlFor="inStock" className="mb-0">In Stock</Label>
                                </div>
                            </div>
                        </div>

                        {/* Variations */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <h3 className="text-lg font-medium mb-4 border-b pb-2">Variations (comma-separated)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="colors">Colors</Label>
                                    <Input id="colors" name="colors" placeholder="White, Black, Blue" value={form.variations.colors} onChange={e => handleNestedChange(e, 'variations')} />
                                </div>
                                <div>
                                    <Label htmlFor="sizes">Sizes</Label>
                                    <Input id="sizes" name="sizes" placeholder="Standard, Large Display" value={form.variations.sizes} onChange={e => handleNestedChange(e, 'variations')} />
                                </div>
                                <div>
                                    <Label htmlFor="features">Features</Label>
                                    <Input id="features" name="features" placeholder="Bluetooth, Memory Storage" value={form.variations.features} onChange={e => handleNestedChange(e, 'variations')} />
                                </div>
                            </div>
                        </div>

                        {/* Key Attributes */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <h3 className="text-lg font-medium mb-4 border-b pb-2">Key Attributes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="condition">Condition</Label>
                                    <Input id="condition" name="condition" placeholder="Brand New" value={form.keyAttributes.condition} onChange={e => handleNestedChange(e, 'keyAttributes')} />
                                </div>
                                <div>
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input id="brand" name="brand" placeholder="OmronTech" value={form.keyAttributes.brand} onChange={e => handleNestedChange(e, 'keyAttributes')} />
                                </div>
                                <div>
                                    <Label htmlFor="model">Model</Label>
                                    <Input id="model" name="model" placeholder="BP-7100" value={form.keyAttributes.model} onChange={e => handleNestedChange(e, 'keyAttributes')} />
                                </div>
                                <div>
                                    <Label htmlFor="warranty">Warranty</Label>
                                    <Input id="warranty" name="warranty" placeholder="2 years" value={form.keyAttributes.warranty} onChange={e => handleNestedChange(e, 'keyAttributes')} />
                                </div>
                                <div>
                                    <Label htmlFor="certification">Certification</Label>
                                    <Input id="certification" name="certification" placeholder="FDA Approved" value={form.keyAttributes.certification} onChange={e => handleNestedChange(e, 'keyAttributes')} />
                                </div>
                                <div>
                                    <Label htmlFor="origin">Country of Origin</Label>
                                    <Input id="origin" name="origin" placeholder="Japan" value={form.keyAttributes.origin} onChange={e => handleNestedChange(e, 'keyAttributes')} />
                                </div>
                            </div>
                        </div>

                        {/* Supplier Info */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <h3 className="text-lg font-medium mb-4 border-b pb-2">Supplier Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="supplier">Supplier Name</Label>
                                    <Input id="supplier" name="supplier" placeholder="HealthTech Solutions" value={form.supplier} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="supplierLogo">Supplier Logo URL</Label>
                                    <Input id="supplierLogo" name="supplierLogo" type="url" placeholder="https://randomuser.me/api/portraits/..." value={form.supplierLogo} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="source">Source URL</Label>
                                    <Input id="source" name="source" type="url" placeholder="https://medequip.com" value={form.source} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="yearsInBusiness">Years in Business</Label>
                                    <Input id="yearsInBusiness" name="yearsInBusiness" placeholder="8 years" value={form.supplierInfo.yearsInBusiness} onChange={e => handleNestedChange(e, 'supplierInfo')} />
                                </div>
                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" placeholder="Tokyo, Japan" value={form.supplierInfo.location} onChange={e => handleNestedChange(e, 'supplierInfo')} />
                                </div>
                                <div>
                                    <Label htmlFor="responseTime">Response Time</Label>
                                    <Input id="responseTime" name="responseTime" placeholder="≤2h" value={form.supplierInfo.responseTime} onChange={e => handleNestedChange(e, 'supplierInfo')} />
                                </div>
                                <div>
                                    <Label htmlFor="onTimeDelivery">On-Time Delivery</Label>
                                    <Input id="onTimeDelivery" name="onTimeDelivery" placeholder="96.8%" value={form.supplierInfo.onTimeDelivery} onChange={e => handleNestedChange(e, 'supplierInfo')} />
                                </div>
                                <div>
                                    <Label htmlFor="totalOrders">Total Orders</Label>
                                    <Input id="totalOrders" name="totalOrders" type="number" placeholder="1250" value={form.supplierInfo.totalOrders} onChange={e => handleNestedChange(e, 'supplierInfo')} />
                                </div>
                                <div>
                                    <Label htmlFor="reorderRate">Reorder Rate</Label>
                                    <Input id="reorderRate" name="reorderRate" placeholder="15%" value={form.supplierInfo.reorderRate} onChange={e => handleNestedChange(e, 'supplierInfo')} />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-4">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                {loading ? "Adding Product..." : "Add Product"}
                            </Button>
                        </div>
                    </form>
                    {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            <div className="font-semibold mb-2">Product added successfully!</div>
                            <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(savedProduct, null, 2)}</pre>
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-2 bg-red-100 border border-red-200 rounded text-red-700">{error}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductForm; 