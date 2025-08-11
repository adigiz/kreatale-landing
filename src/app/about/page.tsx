"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  aboutHero,
  companyStory,
  coreValues,
  processSteps,
  aboutStats,
} from "@/lib/aboutData";
import { Code, Heart, Users, Globe, Award, MessageCircle } from "lucide-react";

// Icon mapping function
const getIcon = (iconName: string) => {
  const iconMap = {
    Code: <Code className="w-8 h-8" />,
    Heart: <Heart className="w-8 h-8" />,
    Users: <Users className="w-8 h-8" />,
    Globe: <Globe className="w-8 h-8" />,
    Award: <Award className="w-8 h-8" />,
    MessageCircle: <MessageCircle className="w-8 h-8" />,
  };
  return (
    iconMap[iconName as keyof typeof iconMap] || <Code className="w-8 h-8" />
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#0061FF] text-white py-20 px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="font-bold text-blue-100 uppercase text-xs sm:text-sm mb-4">
            {aboutHero.subtitle}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {aboutHero.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {aboutHero.description}
          </p>
        </motion.div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Founded in 2017, Kreatale began with a simple mission: to help
              businesses thrive in the digital age through innovative web
              solutions. What started as a small team of passionate developers
              has grown into a full-service digital agency serving clients
              worldwide.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-black mb-4">
                {companyStory.title}
              </h3>
              <p className="text-gray-600 mb-6">{companyStory.description1}</p>
              <p className="text-gray-600">{companyStory.description2}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gray-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {aboutStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-[#0061FF] mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from how we approach
              projects to how we build relationships with our clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-[#0061FF] mb-4">
                  {getIcon(value.iconName)}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              How We Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our proven development process ensures your project is delivered
              on time, within budget, and exceeds expectations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#0061FF] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to work with us?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help bring your digital vision to
              life and drive real business results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/6287852819078?text=Hi!%20I'd%20like%20to%20discuss%20a%20project%20with%20your%20team"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0061FF] text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Start a Project
              </a>
              <Link href="/faq">
                <button className="border-2 border-[#0061FF] text-[#0061FF] px-8 py-3 rounded-full font-semibold hover:bg-[#0061FF] hover:text-white transition-colors duration-200">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
