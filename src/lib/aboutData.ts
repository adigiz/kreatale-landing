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

// Stats data - using the home page version for consistency
export const aboutStats: AboutStats[] = [
  {
    value: "1",
    label: "Operated Years"
  },
  {
    value: "12+",
    label: "Happy Clients"
  },
  {
    value: "6+",
    label: "Professionals"
  },
  {
    value: "12+",
    label: "Amazing Project"
  }
];

// Core values data
export const coreValues: CoreValue[] = [
  {
    iconName: "Code",
    title: "Technical Excellence",
    description: "We write clean, maintainable code and stay current with the latest technologies to deliver robust solutions."
  },
  {
    iconName: "Heart",
    title: "Client-Centric Approach",
    description: "Your success is our success. We listen, understand, and deliver solutions that exceed your expectations."
  },
  {
    iconName: "Users",
    title: "Collaboration",
    description: "We believe in working closely with our clients, fostering open communication and transparency throughout the process."
  },
  {
    iconName: "Globe",
    title: "Innovation",
    description: "We constantly explore new technologies and approaches to provide cutting-edge solutions for your business."
  },
  {
    iconName: "Award",
    title: "Quality Assurance",
    description: "Every project undergoes rigorous testing to ensure it meets our high standards and your requirements."
  },
  {
    iconName: "MessageCircle",
    title: "Transparent Communication",
    description: "We keep you informed at every step, providing regular updates and clear explanations of our progress."
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
  title: "From Startup to Success",
  description1: "We've helped over 50+ businesses launch their digital presence, from local startups to international corporations. Our journey has been marked by continuous learning, adaptation to new technologies, and unwavering commitment to client success.",
  description2: "Today, we're proud to be a trusted partner for businesses seeking to establish a strong online presence, optimize their digital operations, and drive meaningful growth through technology."
};

// Hero section data
export const aboutHero = {
  subtitle: "About Kreatale",
  title: "We turn ideas into digital reality",
  description: "A team of passionate developers, designers, and strategists creating innovative digital solutions that drive business growth."
};
