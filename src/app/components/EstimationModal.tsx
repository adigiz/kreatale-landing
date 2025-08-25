"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  X,
  Calculator,
  Clock,
  DollarSign,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_BASE_URL } from "@/lib/constants";

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

type FormFieldKey = keyof FormData;

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

  const [isCalculating, setIsCalculating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const estimateProject = async (data: FormData) => {
    setIsCalculating(true);

    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

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
    const duration = Math.ceil(total / 150);

    setEstimation({
      startingFrom: `$${Math.round(total).toLocaleString()}`,
      duration: `${duration} week${duration > 1 ? "s" : ""}`,
    });
    setIsCalculating(false);
  };

  const fields: {
    key: FormFieldKey;
    label: string;
    options: { value: string; label: string; description: string }[];
  }[] = [
    {
      key: "projectType",
      label: "What type of project?",
      options: [
        {
          value: "website",
          label: "Website",
          description: "Landing page, portfolio, or business site",
        },
        {
          value: "mobile",
          label: "Mobile App",
          description: "iOS/Android native or cross-platform",
        },
        {
          value: "saas",
          label: "SaaS Platform",
          description: "Web application with complex features",
        },
      ],
    },
    {
      key: "features",
      label: "How complex are the features?",
      options: [
        {
          value: "small",
          label: "Simple",
          description: "Basic functionality, few integrations",
        },
        {
          value: "medium",
          label: "Medium",
          description: "Multiple features, some integrations",
        },
        {
          value: "large",
          label: "Complex",
          description: "Advanced features, many integrations",
        },
      ],
    },
    {
      key: "design",
      label: "What level of design do you need?",
      options: [
        {
          value: "basic",
          label: "Standard",
          description: "Clean, professional templates",
        },
        {
          value: "custom",
          label: "Custom",
          description: "Unique design tailored to your brand",
        },
        {
          value: "premium",
          label: "Premium",
          description: "High-end custom design with animations",
        },
      ],
    },
    {
      key: "deadline",
      label: "What's your timeline?",
      options: [
        {
          value: "flexible",
          label: "Flexible",
          description: "No rush, quality is priority",
        },
        {
          value: "normal",
          label: "Standard",
          description: "Reasonable timeline, balanced approach",
        },
        {
          value: "urgent",
          label: "Rush",
          description: "Need it ASAP, expedited delivery",
        },
      ],
    },
  ];

  const isFormComplete = Object.values(formData).every((value) => value !== "");
  const completedFields = Object.values(formData).filter(
    (value) => value !== ""
  ).length;
  const progress = (completedFields / fields.length) * 100;

  const handleClose = () => {
    onClose();
    setEstimation(null);
    setFormData({
      projectType: "",
      features: "",
      design: "",
      deadline: "",
    });
  };

  const openWhatsApp = () => {
    const getOptionLabel = (key: FormFieldKey, value: string) => {
      const field = fields.find((f) => f.key === key);
      const option = field?.options.find((o) => o.value === value);
      return option?.label || value;
    };

    const projectDetails = `*Project Estimation Details*

*Project Type:* ${getOptionLabel("projectType", formData.projectType)}
*Features Complexity:* ${getOptionLabel("features", formData.features)}
*Design Level:* ${getOptionLabel("design", formData.design)}
*Timeline:* ${getOptionLabel("deadline", formData.deadline)}

*Estimated Cost:* ${estimation?.startingFrom}
*Estimated Duration:* ${estimation?.duration}

Hi! I'd like to discuss my project. Here are the details from the estimator.`;

    const encodedMessage = encodeURIComponent(projectDetails);
    const whatsappUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overscroll-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{ touchAction: "none" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
              estimation
                ? "w-[800px] max-md:w-[95vw] max-md:h-[90vh]"
                : "w-[450px] max-md:w-[95vw] max-md:max-h-[85vh]"
            } max-h-[90vh] flex flex-col overscroll-contain`}
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ touchAction: "pan-y" }}
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white relative">
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5" />
                <h3 className="text-lg font-bold">Project Estimator</h3>
              </div>
              <p className="text-blue-100 text-sm mb-3">
                Get an instant estimate for your project
              </p>

              {/* Progress bar */}
              <div className="bg-white/20 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-white h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {completedFields} of {fields.length} questions completed
              </p>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden max-md:flex-col min-h-0">
              {/* Form Section */}
              <div
                className="w-[450px] max-md:w-full flex-1 p-4 max-md:p-3 overflow-y-auto overscroll-contain max-md:overscroll-auto min-h-0"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    estimateProject(formData);
                  }}
                  className="space-y-4 max-md:pb-4"
                >
                  {fields.map(({ key, label, options }, index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-800">
                          {label}
                        </label>
                        {formData[key] && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {options.map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() =>
                              setFormData({ ...formData, [key]: option.value })
                            }
                            className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                              formData[key] === option.value
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-medium text-gray-900 text-sm">
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {option.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  <motion.button
                    type="submit"
                    disabled={!isFormComplete || isCalculating}
                    whileHover={isFormComplete ? { scale: 1.02 } : {}}
                    whileTap={isFormComplete ? { scale: 0.98 } : {}}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isFormComplete
                        ? "bg-blue-600 text-white shadow-lg hover:shadow-xl hover:bg-blue-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isCalculating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Get My Estimate
                      </>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Results Section */}
              <AnimatePresence>
                {estimation && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: isMobile ? 0 : 50,
                      y: isMobile ? 20 : 0,
                    }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: isMobile ? 0 : 50,
                      y: isMobile ? 20 : 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-[350px] max-md:w-full max-md:flex-shrink-0 max-md:border-t max-md:border-blue-500/20 bg-blue-600 text-white p-6 max-md:p-4 flex flex-col justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <DollarSign className="w-8 h-8 text-white" />
                      </motion.div>

                      <h4 className="text-xl font-bold text-white mb-6">
                        Your Project Estimate
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-blue-100">
                              Starting From
                            </span>
                          </div>
                          <div className="text-3xl font-bold text-white">
                            {estimation.startingFrom}
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-blue-100">
                              Duration
                            </span>
                          </div>
                          <div className="text-3xl font-bold text-white">
                            {estimation.duration}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                        <p className="text-xs text-blue-100">
                          Rough estimate. Final pricing may vary.
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={openWhatsApp}
                        className="mt-4 w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Let&apos;s Discuss Your Project
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
