"use client";

import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-sm px-6 py-4 md:px-16 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-6 md:gap-16">
        <Image
          alt="logo"
          height={150}
          width={70}
          src="/kreatale-logo-primary.svg"
        />
        <div className="hidden md:flex gap-8 text-black">
          <a href="#works" className="hover:text-blue-600 hover:font-bold">
            Our Works
          </a>
          <a href="#services" className="hover:text-blue-600 hover:font-bold">
            Services
          </a>
          <a href="#about" className="hover:text-blue-600 hover:font-bold">
            About
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:flex bg-blue-50 text-blue-500 px-5 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
          Project Estimation
        </button>

        <button
          className="md:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="text-black absolute top-full left-0 w-full bg-white shadow-md px-6 py-4 flex flex-col gap-4 md:hidden">
          <a href="#works" className="hover:underline">
            Works
          </a>
          <a href="#services" className="hover:underline">
            Services
          </a>
          <a href="#about" className="hover:underline">
            About
          </a>
          <button className="bg-blue-50 text-blue-500 px-5 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition w-fit">
            Project Estimation
          </button>
        </div>
      )}
    </nav>
  );
}
