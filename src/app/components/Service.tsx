"use client";

import Image from "next/image";

const services = [
  {
    title: "Website Development",
    image: "/web-dev.png",
    description:
      "We design and build responsive, user-friendly websites that reflect your brand and drive engagement. From landing pages to full corporate sites, we ensure performance, accessibility, and modern design standards.",
  },
  {
    title: "Web App Development",
    image: "/web-app-dev.png",
    description:
      "Our team develops robust and scalable web applications tailored to your business needs. Using modern frameworks and best practices, we create secure, high-performance solutions for everything from dashboards to complex SaaS platforms.",
  },
  {
    title: "Mobile Development",
    image: "/mobile-dev.png",
    description:
      "We build cross-platform and native mobile apps that deliver smooth user experiences on both iOS and Android. Whether for internal use or public release, we turn your ideas into powerful, intuitive mobile solutions.",
  },
  {
    title: "Training",
    image: "/training.png",
    description:
      "We provide hands-on, real-world IT training tailored to teams and individuals. Covering topics from web and mobile development to system administration and security, our programs empower learners to build practical, job-ready skills.",
  },
];

export default function Service() {
  return (
    <section id="services" className="bg-white text-white py-20 px-4 sm:px-6 md:px-16">
      <div className="bg-black rounded-3xl px-6 md:px-16 py-16 w-full mx-auto flex flex-col items-center gap-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-bold text-gray-400 uppercase text-sm mb-2">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            We help businesses to make their product come to life
          </h2>
        </div>

        <div className="flex flex-col gap-16 w-full max-w-5xl mx-auto">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16"
            >
              <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="lg:w-1/2 flex flex-col gap-4 text-center lg:text-left">
                <h3 className="text-2xl font-bold">{service.title}</h3>
                <p className="text-gray-400 max-w-xl mx-auto lg:mx-0">
                  {service.description}
                </p>
                <button className="w-40 mx-auto lg:mx-0 bg-gray-800 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-blue-200">
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
