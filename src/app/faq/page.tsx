"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "What services does Kreatale offer?",
    answer:
      "We specialize in web development, mobile app development, custom web applications, WordPress customization, and UI/UX design. We create fast, modern, and scalable digital solutions tailored to your business needs.",
    category: "Services",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "Project timelines vary depending on complexity. A simple website typically takes 2-4 weeks, while complex web applications can take 2-6 months. We'll provide a detailed timeline during our initial consultation.",
    category: "Timeline",
  },
  {
    question: "What is your development process?",
    answer:
      "Our process includes discovery & planning, design & prototyping, development & testing, and deployment & maintenance. We maintain clear communication throughout each phase and provide regular updates.",
    category: "Process",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Yes, we offer various support packages including maintenance, updates, security monitoring, and performance optimization. We can also provide training for your team to manage the website.",
    category: "Support",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We use modern technologies including Next.js, React, TypeScript, Tailwind CSS, and other cutting-edge tools. We choose the best technology stack based on your project requirements and goals.",
    category: "Technology",
  },
  {
    question: "Can you work with existing websites?",
    answer:
      "Absolutely! We can redesign, rebuild, or enhance existing websites. We'll analyze your current site and recommend improvements to enhance performance, user experience, and conversion rates.",
    category: "Services",
  },
  {
    question: "How do you handle project communication?",
    answer:
      "We use project management tools, regular video calls, and detailed progress reports. You'll have a dedicated project manager and direct access to our development team throughout the project.",
    category: "Communication",
  },
  {
    question: "What makes Kreatale different from other agencies?",
    answer:
      "We focus on creating high-performance, scalable solutions with clean code and modern design. Our team combines technical expertise with business understanding to deliver solutions that drive real results.",
    category: "Company",
  },
  {
    question: "Do you provide hosting and domain services?",
    answer:
      "Yes, we can help with hosting setup, domain registration, SSL certificates, and ongoing server management. We recommend reliable hosting providers that ensure optimal performance.",
    category: "Services",
  },
  {
    question: "How do you ensure website security?",
    answer:
      "We implement security best practices including HTTPS, secure authentication, regular updates, and security monitoring. We also provide security audits and recommendations for ongoing protection.",
    category: "Security",
  },
];

const categories = [
  "All",
  "Services",
  "Timeline",
  "Process",
  "Support",
  "Technology",
  "Communication",
  "Company",
  "Security",
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0061FF] text-white py-16 px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Find answers to common questions about our web development services,
            process, and what makes us different.
          </p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="px-4 sm:px-8 lg:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="px-4 sm:px-8 lg:px-16 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openItems.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Get in touch with
              our team and we&apos;ll be happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/6287852819078?text=Hi!%20I%20have%20a%20question%20about%20your%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  WhatsApp Us
                </button>
              </a>
              <Link href="/#contact">
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
