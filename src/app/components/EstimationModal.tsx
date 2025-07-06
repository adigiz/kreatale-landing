"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
}

type FormData = {
  projectType: string;
  features: string;
  design: string;
  deadline: string;
};

export default function EstimationModal({ show, onClose }: Props) {
  const [formData, setFormData] = useState<FormData>({
    projectType: "",
    features: "",
    design: "",
    deadline: "",
  });

  const [estimation, setEstimation] = useState<{
    startingFrom: string;
    duration: string;
  } | null>(null);

  const estimateProject = (data: FormData) => {
    let base = 0;

    switch (data.projectType) {
      case "website":
        base = 150;
        break;
      case "mobile":
        base = 300;
        break;
      case "saas":
        base = 600;
        break;
      default:
        base = 150;
    }

    if (data.features === "medium") base += 300;
    else if (data.features === "large") base += 800;

    if (data.design === "custom") base += 200;
    else if (data.design === "premium") base += 400;

    let multiplier = 1;
    if (data.deadline === "normal") multiplier = 1.1;
    else if (data.deadline === "urgent") multiplier = 1.25;

    const total = base * multiplier;
    const duration = Math.ceil(total / 150) * 1;

    return {
      startingFrom: `$${Math.round(total)}`,
      duration: `${duration} week${duration > 1 ? "s" : ""}`,
    };
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              onClick={() => {
                onClose();
                setEstimation(null);
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6">Estimate Your Project</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const result = estimateProject(formData);
                setEstimation(result);
              }}
              className="space-y-4"
            >
              {[
                { key: "projectType", label: "Project Type", options: ["Website", "Mobile", "SaaS"] },
                { key: "features", label: "Features", options: ["Small", "Medium", "Large"] },
                { key: "design", label: "Design", options: ["Basic", "Custom", "Premium"] },
                { key: "deadline", label: "Deadline", options: ["Flexible", "Normal", "Urgent"] },
              ].map(({ key, label, options }) => (
                <div key={key} className="space-y-1">
                  <label className="block text-sm text-gray-700 font-medium">{label}</label>
                  <div className="relative">
                    <select
                      required
                      value={(formData as any)[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select {label}</option>
                      {options.map((opt) => (
                        <option key={opt.toLowerCase()} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Estimate
              </button>
            </form>

            {estimation && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50 text-center border">
                <p className="text-gray-800 font-semibold">
                  💸 Starts From: <span className="text-blue-600">{estimation.startingFrom}</span>
                </p>
                <p className="text-gray-600 mt-1">
                  ⏱ Estimated Duration: {estimation.duration}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
