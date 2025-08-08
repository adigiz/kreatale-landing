"use client";

import Portfolio from "./components/Portfolio";
import Service from "./components/Service";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Portfolio />
      <Service />
      <About />
      <Testimonials />
    </main>
  );
}
