import Hero from "../components/Hero";
import Service from "../components/Service";
import About from "../components/About";
import Portfolio from "../components/Portfolio";
import Testimonials from "../components/Testimonials";

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
