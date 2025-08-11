"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Code,
  Globe,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Website Development",
      description:
        "We design and build responsive, user-friendly websites that reflect your brand and drive engagement. From landing pages to full corporate sites, we ensure performance, accessibility, and modern design standards.",
      features: [
        "Responsive design for all devices",
        "SEO optimization",
        "Fast loading times",
        "Content management system",
        "Analytics integration",
        "Security implementation",
      ],
      image: "/web-dev.png",
    },
    {
      title: "Web App Development",
      description:
        "Our team develops robust and scalable web applications tailored to your business needs. Using modern frameworks and best practices, we create secure, high-performance solutions for everything from dashboards to complex SaaS platforms.",
      features: [
        "Custom functionality",
        "User authentication",
        "Database integration",
        "API development",
        "Real-time updates",
        "Performance optimization",
      ],
      image: "/web-app-dev.png",
    },
    {
      title: "Mobile Development",
      description:
        "We build cross-platform and native mobile apps that deliver smooth user experiences on both iOS and Android. Whether for internal use or public release, we turn your ideas into powerful, intuitive mobile solutions.",
      features: [
        "Native and cross-platform",
        "Offline functionality",
        "Push notifications",
        "App store optimization",
        "Performance monitoring",
        "Regular updates",
      ],
      image: "/mobile-dev.png",
    },
    {
      title: "Training",
      description:
        "We provide hands-on, real-world IT training tailored to teams and individuals. Covering topics from web and mobile development to system administration and security, our programs empower learners to build practical, job-ready skills.",
      features: [
        "Hands-on learning",
        "Real-world projects",
        "Web development training",
        "Mobile development training",
        "System administration",
        "Security training",
      ],
      image: "/training.png",
    },
  ];

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
            Our Services
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Digital solutions that
            <br className="hidden sm:block" />
            drive results
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            From concept to deployment, we provide comprehensive digital
            services that help businesses grow and succeed online.
          </p>
        </motion.div>
      </section>

      {/* Services Overview */}
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
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of digital services is designed to meet
              the evolving needs of modern businesses. We combine technical
              expertise with creative innovation to deliver solutions that make
              a difference.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-black">
                      {service.title}
                    </h3>
                  </div>

                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-6">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  <p className="text-gray-600 mb-6">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://wa.me/6287852819078?text=Hi!%20I'm%20interested%20in%20your%20services%20for%20web%20development"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <button className="flex items-center gap-2 text-[#0061FF] font-semibold hover:gap-3 transition-all duration-200">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
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
              Why Choose Kreatale?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We don&apos;t just build websites and apps – we create digital
              experiences that drive real business results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Team",
                description:
                  "Our team of experienced developers, designers, and strategists bring years of industry expertise to every project.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Quality Assurance",
                description:
                  "Every project undergoes rigorous testing to ensure it meets our high standards and exceeds your expectations.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Fast Delivery",
                description:
                  "We work efficiently to deliver your project on time, without compromising on quality or attention to detail.",
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Modern Technology",
                description:
                  "We use the latest technologies and best practices to ensure your solution is future-proof and scalable.",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Reach",
                description:
                  "We've served clients from around the world, bringing diverse perspectives and innovative solutions.",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Ongoing Support",
                description:
                  "Our relationship doesn't end at launch. We provide ongoing support and maintenance to keep your solution running smoothly.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-[#0061FF] mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
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
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your project requirements and how we can help
              bring your digital vision to life.
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
              <Link href="/about">
                <button className="border-2 border-[#0061FF] text-[#0061FF] px-8 py-3 rounded-full font-semibold hover:bg-[#0061FF] hover:text-white transition-colors duration-200">
                  Learn About Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
