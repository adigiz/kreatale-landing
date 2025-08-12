export interface AboutStats {
  value: string;
  label: string;
}

export interface CoreValue {
  iconName: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

// Stats data - updated to reflect new company story
export const aboutStats: AboutStats[] = [
  {
    value: "1",
    label: "Year Founded"
  },
  {
    value: "2",
    label: "Months Active"
  },
  {
    value: "12+",
    label: "New Clients"
  },
  {
    value: "100%",
    label: "Happy Clients"
  }
];

// Core values data
export const coreValues: CoreValue[] = [
  {
    iconName: "Heart",
    title: "Dream Realization",
    description: "Our core mission is to help businesses realize their dreams through technology. We believe every business has a vision, and we're here to make it a digital reality."
  },
  {
    iconName: "Code",
    title: "Technical Excellence",
    description: "We write clean, maintainable code and stay current with the latest technologies to deliver robust solutions that bring your dreams to life."
  },
  {
    iconName: "Users",
    title: "Client Partnership",
    description: "We work as true partners with our clients, understanding their dreams and collaborating closely to turn them into successful digital solutions."
  },
  {
    iconName: "Globe",
    title: "Innovation & Growth",
    description: "As a growing company ourselves, we constantly explore new technologies and approaches to provide cutting-edge solutions for your business growth."
  },
  {
    iconName: "Award",
    title: "Quality & Satisfaction",
    description: "Every project undergoes rigorous testing to ensure it meets our high standards and exceeds your expectations, making your dreams come true."
  },
  {
    iconName: "MessageCircle",
    title: "Transparent Communication",
    description: "We keep you informed at every step, providing regular updates and clear explanations as we work together to realize your business dreams."
  }
];

// Process steps data
export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "We start by understanding your business goals, target audience, and project requirements."
  },
  {
    step: "02",
    title: "Design & Prototyping",
    description: "Our designers create wireframes and prototypes to visualize the user experience."
  },
  {
    step: "03",
    title: "Development & Testing",
    description: "We build your solution using modern technologies and conduct thorough testing."
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "We deploy your project and provide ongoing support and maintenance."
  }
];

// Company story data
export const companyStory = {
  title: "New Beginnings, Rapid Growth",
  description1: "Founded last year, Kreatale has quickly established itself as a dynamic force in the digital landscape. While we're a relatively new company, our passion for technology and commitment to client success has enabled us to secure many new clients in just the past 2 months.",
  description2: "Despite being a young company, we've managed to build a strong foundation of satisfied clients who are all happy with our services. The company is still growing rapidly, and we're excited about the future as we continue to help businesses realize their dreams through technology."
};

// Hero section data
export const aboutHero = {
  subtitle: "About Kreatale",
  title: "We turn dreams into digital reality",
  description: "A young, dynamic team passionate about helping businesses realize their dreams through innovative technology solutions."
};
