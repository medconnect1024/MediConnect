"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Book,
  Award,
  Star,
  PlayCircle,
  ChevronRight,
  Share2,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import Hls from "hls.js";
interface DoctorProfileProps {
  userId: string;
}

interface Video {
  _id: string;
  userId: string;
  url: string;
  cloudflareId: string;
  status: string;
  metadata: {
    name: string;
    size: number;
    type: string;
  };
  createdAt: string;
}

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      controls
      playsInline
    />
  );
};

export function DoctorProfile({ userId }: DoctorProfileProps) {
  const doctor = useQuery(api.users.getUserDetails, { userId });
  const generateFileUrl = useMutation(api.prescriptions.generateFileUrl);
  const videos = useQuery(api.videos.list, { userId }) || [];

  const [profileImageUrl, setProfileImageUrl] = useState(
    "/placeholder.svg?height=300&width=300"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (doctor && doctor.profileImageUrl) {
        try {
          const fileUrl = await generateFileUrl({
            storageId: doctor.profileImageUrl,
          });
          setProfileImageUrl(fileUrl);
        } catch (error) {
          console.error("Error generating file URL:", error);
        }
      }
    };

    fetchProfileImage();
  }, [doctor, generateFileUrl]);

  if (!doctor) {
    return <div className="text-center py-24">Loading...</div>;
  }

  return (
    <div className=" flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <Link className="flex items-center justify-center" href="#">
          <motion.span
            className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            MyMedirecords
          </motion.span>
        </Link>
        <nav className="hidden md:flex ml-auto gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            Medical Team
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            Blog
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            href="#"
          >
            Login
          </Link>
          <Button className="bg-gradient-to-r from-blue-600 to-sky-400 text-white hover:opacity-90 transition-opacity">
            Sign Up
          </Button>
        </nav>
        <Button
          className="md:hidden ml-auto"
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b p-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                href="#"
              >
                About
              </Link>
              <Link
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                href="#"
              >
                Medical Team
              </Link>
              <Link
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                href="#"
              >
                Blog
              </Link>
              <Link
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                href="#"
              >
                Login
              </Link>
              <Button className="bg-gradient-to-r from-blue-600 to-sky-400 text-white hover:opacity-90 transition-opacity w-full">
                Sign Up
              </Button>
            </nav>
          </div>
        )}
      </header>
      <div className="container mx-auto px-4 py-8 mt-10">
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <Image
                    src={profileImageUrl}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    width={300}
                    height={300}
                    className="rounded-full w-40 h-40 object-cover mx-auto border-4 border-white shadow-md"
                  />
                  <Badge className="absolute bottom-2 right-1/3 bg-green-500 text-white">
                    Available
                  </Badge>
                </div>
                <h1 className="text-3xl font-serif text-center mb-2 text-gray-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="text-xl text-center text-gray-600 mb-4">
                  {doctor.role || "Medical Professional"}
                </p>
                <div className="flex justify-center space-x-2 mb-6">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {doctor.specialization || "Specialist"}
                  </Badge>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{doctor.address || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{doctor.phone || "Phone number not available"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{doctor.email || "Email not available"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
              Book Appointment
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Education & Training
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {educationAndTraining.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Book className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{item.degree}</p>
                      <p className="text-gray-600">{item.institution}</p>
                      <p className="text-gray-500">{item.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Awards & Honors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {awardsAndHonors.map((award, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{award.title}</p>
                      <p className="text-gray-600">{award.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1 text-gray-900">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {event.date} | {event.time}
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif mb-4 text-gray-900">
                  About Dr. {doctor.firstName} {doctor.lastName}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {doctor.bio || "Bio not available"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-gray-900">
                  Patient Q&A Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Featured Videos
                  </h3>
                  <Button
                    variant="outline"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    View All Videos
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video: Video) => (
                    <Card
                      key={video._id}
                      className="overflow-hidden hover:shadow-md transition-shadow h-full"
                    >
                      <div className="flex flex-col h-full">
                        <div className="relative h-40">
                          <VideoPlayer src={video.url} />
                        </div>
                        <div className="flex justify-end space-x-2 p-2 bg-gray-100">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Bookmark className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                        <CardContent className="p-4 flex-grow">
                          <div className="flex flex-col justify-between h-full">
                            <div>
                              <h3 className="text-base font-medium mb-1 text-gray-900">
                                {video.metadata.name}
                              </h3>
                              <p className="text-xs text-gray-600">
                                Uploaded on{" "}
                                {new Date(video.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 self-end"
                            >
                              <PlayCircle className="h-5 w-5 mr-1" />
                              Watch
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-gray-900">
                  Patient Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {patientTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="italic mb-2 text-gray-700">
                      "{testimonial.comment}"
                    </p>
                    <p className="text-gray-600 text-sm">
                      - {testimonial.name}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-gray-900">
                  Recent Publications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPublications.map((pub, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                  >
                    <h3 className="font-medium text-lg mb-1 text-gray-900">
                      {pub.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{pub.authors}</p>
                    <p className="text-gray-500 text-sm">{pub.journal}</p>
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-800 p-0 h-auto mt-2"
                    >
                      Read More <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const educationAndTraining = [
  {
    degree: "Fellowship in Reproductive Endocrinology and Infertility",
    institution: "Johns Hopkins University School of Medicine",
    year: "2018 - 2021",
  },
  {
    degree: "Residency in Obstetrics and Gynecology",
    institution: "University of Maryland School of Medicine",
    year: "2014 - 2018",
  },
  {
    degree: "Doctor of Medicine (MD)",
    institution: "University of Missouri-Kansas City School of Medicine",
    year: "2008 - 2014",
  },
];

const awardsAndHonors = [
  {
    title: "Rising Star in Reproductive Medicine",
    year: "2023",
    organization: "American Society for Reproductive Medicine",
  },
  {
    title: "Excellence in Research Award",
    year: "2022",
    organization: "Johns Hopkins University School of Medicine",
  },
  {
    title: "Best Clinical Paper Award",
    year: "2021",
    organization: "Society for Reproductive Endocrinology and Infertility",
  },
];

const recentPublications = [
  {
    title:
      "CRISPR-Cas9 Applications in Reproductive Endocrinology: A Comprehensive Review",
    authors: "Cayton Vaught K.C., Smith J.R., Johnson A.M.",
    journal: "Journal of Reproductive Medicine, 2023",
  },
  {
    title:
      "Fertility Preservation Outcomes in Women with Sickle Cell Disease: A Multi-Center Study",
    authors: "Cayton Vaught K.C., Brown L.T., Davis R.E., et al.",
    journal: "Fertility and Sterility, 2022",
  },
  {
    title: "Genetic Markers for Predicting Ovarian Response in IVF Patients",
    authors: "Johnson A.M., Cayton Vaught K.C., Williams P.L.",
    journal: "Human Reproduction, 2021",
  },
];

const questions = [
  {
    title: "What causes PCOS?",
    category: "PCOS",
    description:
      "Dr. Cayton Vaught explains the underlying causes of Polycystic Ovary Syndrome (PCOS) and its impact on hormonal balance.",
  },
  {
    title: "What are the most common menstrual symptoms with PCOS?",
    category: "PCOS",
    description:
      "Learn about the typical menstrual irregularities associated with PCOS and how they affect your reproductive health.",
  },
  {
    title: "What is lean PCOS?",
    category: "PCOS",
    description:
      "A deeper look into the characteristics and implications of lean PCOS, a less common form of the condition.",
  },
  {
    title:
      "How are the cysts in PCOS similar to or different from other ovarian cysts?",
    category: "PCOS",
    description:
      "Comparison of PCOS cysts with other types of ovarian cysts, and their impact on fertility.",
  },
  {
    title: "How is PCOS diagnosed?",
    category: "PCOS",
    description:
      "Explanation of the diagnostic process for PCOS, including common tests and criteria used by doctors.",
  },
  {
    title: "What does IVF look like if I have PCOS?",
    category: "Fertility",
    description:
      "Overview of IVF procedures tailored for individuals with PCOS, including potential challenges and success rates.",
  },
  {
    title: "What lifestyle changes should I make with PCOS?",
    category: "PCOS",
    description:
      "Recommendations for lifestyle modifications to manage PCOS symptoms and improve overall health.",
  },
  {
    title: "How does PCOS impact fertility?",
    category: "Fertility",
    description:
      "Discussion on the effects of PCOS on fertility and potential treatment options to improve conception chances.",
  },
  {
    title: "What are the success rates for IVF treatment?",
    category: "Fertility",
    description:
      "Statistics and factors influencing IVF success rates, including age, health conditions, and treatment protocols.",
  },
  {
    title: "How long does the IVF process typically take?",
    category: "Fertility",
    description:
      "Timeline of the IVF process, from initial consultation to embryo transfer and pregnancy test.",
  },
  {
    title: "What are the risks associated with fertility treatments?",
    category: "Fertility",
    description:
      "Potential risks and complications of fertility treatments, including medication side effects and multiple pregnancies.",
  },
  {
    title: "How can I improve my chances of conceiving naturally?",
    category: "Fertility",
    description:
      "Tips and strategies to enhance natural conception, including lifestyle changes and timing of intercourse.",
  },
];

const upcomingEvents = [
  {
    title: "Webinar: Understanding PCOS and Fertility",
    date: "July 15, 2024",
    time: "2:00 PM - 3:30 PM EST",
    description:
      "Join Dr. Cayton Vaught for an informative session on the latest advancements in PCOS management and its impact on fertility.",
  },
  {
    title: "Q&A Session: Fertility Preservation Options",
    date: "August 5, 2024",
    time: "6:00 PM - 7:00 PM EST",
    description:
      "An open discussion on various fertility preservation methods, ideal for patients considering their future family planning options.",
  },
];

const patientTestimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    comment:
      "Dr. Cayton Vaught's expertise and compassionate care made our fertility journey so much easier. We're now proud parents of twins!",
  },
  {
    name: "Michael L.",
    rating: 5,
    comment:
      "The personalized treatment plan Dr. Cayton Vaught developed for my wife's PCOS has dramatically improved her quality of life.",
  },
  {
    name: "Emily R.",
    rating: 5,
    comment:
      "Dr. Cayton Vaught's knowledge of the latest fertility treatments gave us hope when we thought we had run out of options. We're forever grateful.",
  },
];

const videoDurations = {
  "What causes PCOS?": "5:23",
  "What are the most common menstrual symptoms with PCOS?": "4:17",
  "What is lean PCOS?": "3:45",
  "How are the cysts in PCOS similar to or different from other ovarian cysts?":
    "6:02",
  "How is PCOS diagnosed?": "7:30",
  "What does IVF look like if I have PCOS?": "8:15",
  "What lifestyle changes should I make with PCOS?": "5:50",
  "How does PCOS impact fertility?": "6:40",
  "What are the success rates for IVF treatment?": "4:55",
  "How long does the IVF process typically take?": "7:20",
  "What are the risks associated with fertility treatments?": "6:10",
  "How can I improve my chances of conceiving naturally?": "5:35",
};
