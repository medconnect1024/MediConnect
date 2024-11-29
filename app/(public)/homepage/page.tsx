"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Search,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ExpertsSection } from "@/components/sections/experts-section";
import CTASection from "@/components/sections/cta-section";
import { motion } from "framer-motion";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
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
        <nav className="ml-auto flex gap-4 sm:gap-6">
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
      </header>
      <main className="flex-1 pt-16">
        <section className="w-full min-h-[calc(100vh-4rem)] py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-10 text-center">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                  Top doctors answer your health questions
                </h1>
                <p className="mx-auto max-w-[600px] text-blue-600 md:text-xl italic">
                  Watch expert video answers from certified medical
                  professionals. Get reliable health information instantly.
                </p>
              </motion.div>
              <motion.div
                className="w-full max-w-md space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <Select>
                      <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm pl-10 pr-4 py-2 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-full">
                        <SelectValue placeholder="I am navigating..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="symptoms">My Symptoms</SelectItem>
                        <SelectItem value="conditions">
                          Medical Conditions
                        </SelectItem>
                        <SelectItem value="medications">Medications</SelectItem>
                        <SelectItem value="procedures">
                          Medical Procedures
                        </SelectItem>
                        <SelectItem value="mental-health">
                          Mental Health
                        </SelectItem>
                        <SelectItem value="nutrition">
                          Diet & Nutrition
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-blue-600 to-sky-400 text-white rounded-full hover:opacity-90 transition-opacity"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="relative w-full max-w-5xl h-[600px] mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {/* First (back) screen */}
                <motion.div
                  className="absolute left-[10%] top-10 w-[280px] h-[560px] bg-gradient-to-br from-blue-600/5 via-sky-400/5 to-indigo-300/5 rounded-[40px] shadow-xl overflow-hidden"
                  initial={{ rotate: -12, x: -50 }}
                  animate={{ rotate: -12, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="grid grid-cols-2 gap-4 p-6">
                    {[
                      "Basics",
                      "Diagnosis",
                      "Symptoms",
                      "Treatment",
                      "Clinical trials",
                      "Life hacks",
                      "Mental health",
                      "Prevention",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="aspect-square bg-white/80 rounded-2xl flex items-center justify-center p-4 text-sm font-medium text-blue-600 italic"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Middle screen */}
                <motion.div
                  className="absolute left-[30%] top-20 w-[300px] h-[560px] bg-blue-900 rounded-[40px] shadow-xl overflow-hidden"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="p-6 bg-blue-900 text-white h-full">
                    <div className="flex items-center gap-2 mb-6">
                      <ChevronLeft className="h-5 w-5" />
                      <span className="text-xl font-semibold italic">
                        Diagnosis
                      </span>
                    </div>
                    <p className="text-sm text-sky-200 mb-8 italic">
                      When you first receive a new diagnosis, it can be hard to
                      remember the conversation that follows from your doctor.
                      Here, we'll teach you what the diagnosis means and what to
                      do about it.
                    </p>
                    <div className="grid gap-4">
                      {[
                        "Early Symptoms",
                        "Testing",
                        "Labs & bloodwork",
                        "Imaging",
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="bg-blue-800/50 p-4 rounded-xl flex items-center justify-between"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                        >
                          <span>{item}</span>
                          <span className="text-xs text-sky-300 italic">
                            12 Q&As
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Front screen */}
                <motion.div
                  className="absolute right-[10%] top-30 w-[320px] h-[580px] bg-black rounded-[40px] shadow-xl overflow-hidden"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="relative h-full">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      poster="/placeholder.svg?height=580&width=320"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8" />
                        )}
                      </Button>
                    </div>
                    {isHovering && (
                      <Button
                        size="icon"
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 italic">
                        What is the best treatment for my diagnosis?
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-sky-200" />
                        <div>
                          <p className="font-semibold">Dr. Sarah Johnson</p>
                          <p className="text-sm text-sky-300 italic">
                            Reproductive Endocrinologist
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        <ExpertsSection />
        <CTASection />
      </main>
    </div>
  );
}
