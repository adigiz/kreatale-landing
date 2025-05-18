"use client";

import Image from "next/image";

export default function About() {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-10 bg-white gap-8">
      <div className="h-full lg:w-1/2 mb-10 lg:mb-0 lg:px-20">
        <p className="font-bold text-gray-400 uppercase text-sm mb-2">
          About Us
        </p>
        <h2 className="text-black text-4xl lg:text-5xl font-bold mb-6">
          The team will turn your <br /> ideas into reality
        </h2>
        <p className="text-gray-600 mb-6">
          We feel that in this digital age, connection is required to develop a
          successful corporate empire. Having user-focused websites or mobile
          applications that are simple to use can increase your market
          competitiveness.
        </p>
        <button className="bg-blue-100 text-blue-600 px-7 py-3 rounded-full font-semibold text-sm hover:bg-blue-200">
          See all works
        </button>

        {/* Stats Box */}
        <div className="text-center mt-10 grid grid-cols-2 gap-16 px-8 py-16 rounded-xl border border-gray-200 w-full">
          <div>
            <p className="text-4xl font-bold text-gray-800">8</p>
            <p className="text-sm text-gray-500">Operated Years</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-800">200+</p>
            <p className="text-sm text-gray-500">Happy Clients</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-800">40+</p>
            <p className="text-sm text-gray-500">Professionals</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-800">650+</p>
            <p className="text-sm text-gray-500">Amazing Project</p>
          </div>
        </div>
      </div>

      <div className="h-full lg:w-1/2 flex justify-center lg:pr-20">
        <Image
          src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Developer working"
          width={600}
          height={500}
          className="rounded-2xl shadow-lg object-cover w-full"
        />
      </div>
    </section>
  );
}
