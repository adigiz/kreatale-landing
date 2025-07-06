"use client";

import Portfolio from "./components/Portfolio";
import Service from "./components/Service";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header/>
      <Hero />
      <Portfolio />
      <Service />
      <About />
      <Testimonials />
      <Footer />
    </main>
  );
}
