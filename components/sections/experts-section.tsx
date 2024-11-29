"use client";

import { ExpertCard } from "@/components/expert-card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ExpertsSection() {
  const experts = [
    {
      name: "Dr. Kamaria Cayton Vaught",
      title: "MD, FACOG",
      specialty: "Reproductive Medicine",
      imageUrl:
        "https://media.istockphoto.com/id/177373093/photo/indian-male-doctor.jpg?s=612x612&w=0&k=20&c=5FkfKdCYERkAg65cQtdqeO_D0JMv6vrEdPw3mX1Lkfg=",
      bio: "Specializing in fertility treatments and reproductive health.",
    },
    {
      name: "Carolyn Clevenger",
      title: "DNP, RN, GNP-BC",
      specialty: "Geriatrics",
      imageUrl:
        "https://t4.ftcdn.net/jpg/07/07/89/33/360_F_707893394_5DEhlBjWOmse1nyu0rC9T7ZRvsAFDkYC.jpg",
      bio: "Expert in elderly care and age-related health issues.",
    },
    {
      name: "Dr. Goutami Goldman",
      title: "MD, FACOG",
      specialty: "Reproductive Endocrinology",
      imageUrl:
        "https://png.pngtree.com/png-vector/20240528/ourmid/pngtree-indian-doctor-woman-smiling-at-camera-png-image_12531120.png",
      bio: "Focused on hormonal disorders and infertility treatments.",
    },
    {
      name: "Dr. Michael Stanley",
      title: "MD, PhD",
      specialty: "Neurology",
      imageUrl:
        "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEyL3Jhd3BpeGVsX29mZmljZV8zNl9pbmRpYW5fd29tYW5fZG9jdG9yX2lzb2xhdGVkX3doaXRlX2JhY2tncm91bl8xNWU0YmZjYi05ZjNkLTRmNTgtODJhZC1kOGQyZjczMmVjZmVfMS5qcGc.jpg",
      bio: "Researching and treating complex neurological disorders.",
    },
  ];

  return (
    <section className="w-full py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-navy-900 mb-4">
            Our Medical Experts
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-inter">
            Trusted professionals at the forefront of healthcare
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
          {experts.map((expert, index) => (
            <motion.div
              key={expert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ExpertCard {...expert} />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl p-6 flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-2xl font-playfair text-navy-900 mb-2">
                Apply to be a Content Creator
              </h3>
              {/* <p className="text-gray-600 mb-6">
                Share your expertise and help others on MyMedirecords
              </p> */}
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Apply to be a content creator"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
