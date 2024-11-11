"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  Hospital,
  Image,
  Stethoscope,
  Upload,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  step: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture: File | null;
  };
  professionalInfo: {
    specialization: string;
    licenseNumber: string;
    yearsOfPractice: string;
    practiceType: string;
    bio: string;
  };
  practiceInfo: {
    clinicName: string;
    logo: File | null;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    website: string;
  };
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    step: 1,
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profilePicture: null,
    },
    professionalInfo: {
      specialization: "",
      licenseNumber: "",
      yearsOfPractice: "",
      practiceType: "",
      bio: "",
    },
    practiceInfo: {
      clinicName: "",
      logo: null,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      website: "",
    },
  });

  const updateFormData = (
    section: keyof FormData,
    field: string,
    value: string | File | null
  ) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   [section]: {
    //     ...prev[section as keyof typeof prev],
    //     [field]: value,
    //   },
    // }));
  };

  const handleFileUpload = (
    section: keyof FormData,
    field: string,
    file: File | null
  ) => {
    updateFormData(section, field, file);
  };

  const nextStep = () => {
    setFormData((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const prevStep = () => {
    setFormData((prev) => ({
      ...prev,
      step: prev.step - 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  formData.step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <UserCircle className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm">Personal Info</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  formData.step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm">Professional Info</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  formData.step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <Hospital className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm">Practice Info</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          {formData.step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Please provide your basic contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.personalInfo.firstName}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "firstName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.personalInfo.lastName}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "lastName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      updateFormData("personalInfo", "email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) =>
                      updateFormData("personalInfo", "phone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    {formData.personalInfo.profilePicture && (
                      <Image
                        // src={URL.createObjectURL(
                        //   formData.personalInfo.profilePicture
                        // )}
                        // alt="Profile"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    )}
                    <Label
                      htmlFor="profilePicture"
                      className="flex cursor-pointer items-center space-x-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Picture</span>
                      <Input
                        id="profilePicture"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            "personalInfo",
                            "profilePicture",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </Label>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {formData.step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Tell us about your medical practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    value={formData.professionalInfo.specialization}
                    onValueChange={(value) =>
                      updateFormData(
                        "professionalInfo",
                        "specialization",
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Medical License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.professionalInfo.licenseNumber}
                    onChange={(e) =>
                      updateFormData(
                        "professionalInfo",
                        "licenseNumber",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfPractice">Years of Practice</Label>
                  <Input
                    id="yearsOfPractice"
                    type="number"
                    value={formData.professionalInfo.yearsOfPractice}
                    onChange={(e) =>
                      updateFormData(
                        "professionalInfo",
                        "yearsOfPractice",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Practice Type</Label>
                  <RadioGroup
                    value={formData.professionalInfo.practiceType}
                    onValueChange={(value) =>
                      updateFormData("professionalInfo", "practiceType", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private Practice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hospital" id="hospital" />
                      <Label htmlFor="hospital">Hospital</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="clinic" id="clinic" />
                      <Label htmlFor="clinic">Clinic</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your experience and expertise..."
                    value={formData.professionalInfo.bio}
                    onChange={(e) =>
                      updateFormData("professionalInfo", "bio", e.target.value)
                    }
                    className="h-32"
                  />
                </div>
              </CardContent>
            </>
          )}

          {formData.step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Practice Information</CardTitle>
                <CardDescription>
                  Enter your practice location details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                  <Input
                    id="clinicName"
                    value={formData.practiceInfo.clinicName}
                    onChange={(e) =>
                      updateFormData(
                        "practiceInfo",
                        "clinicName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Practice Logo</Label>
                  <div className="flex items-center space-x-4">
                    {formData.practiceInfo.logo && (
                      <Image
                        // src={URL.createObjectURL(formData.practiceInfo.logo)}
                        // alt="Logo"
                        className="h-16 w-16 rounded object-contain"
                      />
                    )}
                    <Label
                      htmlFor="logo"
                      className="flex cursor-pointer items-center space-x-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Logo</span>
                      <Input
                        id="logo"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            "practiceInfo",
                            "logo",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.practiceInfo.address}
                    onChange={(e) =>
                      updateFormData("practiceInfo", "address", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.practiceInfo.city}
                      onChange={(e) =>
                        updateFormData("practiceInfo", "city", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.practiceInfo.state}
                      onChange={(e) =>
                        updateFormData("practiceInfo", "state", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.practiceInfo.zipCode}
                    onChange={(e) =>
                      updateFormData("practiceInfo", "zipCode", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Practice Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://"
                    value={formData.practiceInfo.website}
                    onChange={(e) =>
                      updateFormData("practiceInfo", "website", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </>
          )}

          {formData.step === 4 && (
            <>
              <CardHeader>
                <CardTitle>All Set!</CardTitle>
                <CardDescription>
                  Your account has been created successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 rounded-full bg-green-100 p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Welcome to MyMediRecords
                </h3>
                <p className="text-center text-muted-foreground">
                  You can now access your dashboard and start using our
                  AI-powered features to enhance your medical practice.
                </p>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-between">
            {formData.step > 1 && formData.step < 4 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            {formData.step < 4 ? (
              <Button className="ml-auto" onClick={nextStep}>
                {formData.step === 3 ? "Complete" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="ml-auto"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
