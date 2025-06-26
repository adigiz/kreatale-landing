"use client";

import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <section className="bg-black text-white rounded-t-[2rem] px-6 sm:px-12 lg:px-20 py-16 mt-24">
      <div className="text-center mb-16">
        <p className="uppercase text-sm text-gray-400 mb-2">Contact Us</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          You have got this far. <br /> Ready to get started?
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-full font-semibold text-sm">
          Get in touch
        </button>
      </div>

      <div className="border-t border-gray-800 pt-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-sm">
        <div className="flex-shrink-0">
          <Image
            src="/kreatale-logo-secondary.svg"
            alt="Kreatale Logo"
            width={120}
            height={40}
            className="h-12 w-40"
            priority
          />
        </div>

        <div className="flex gap-4 text-gray-400">
          <a 
            href="https://www.instagram.com/kreatale"
            target="_blank"
            rel="noopener noreferrer">
            <FaInstagram className="hover:text-white cursor-pointer" />
          </a>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <p>Copyright © 2025 Kreatale. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer">FAQ</span>
          <span className="hover:text-white cursor-pointer">
            Terms of service
          </span>
        </div>
      </div>
    </section>
  );
}
