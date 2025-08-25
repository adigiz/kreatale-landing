export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+6287852819078";
export const WHATSAPP_BASE_URL = "https://wa.me";

export const WHATSAPP_MESSAGES = {
  GENERAL_INQUIRY: "Hi! I have a question about your services",
  SERVICES_INTEREST: "Hi! I'm interested in your services for web development",
  PROJECT_DISCUSSION: "Hi! I'd like to discuss a project with your team",
} as const;
