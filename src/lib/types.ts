export interface ProjectSection {
  title: string;
  content: string[];
}

export interface ProjectData {
  title: string;
  subtitle: string;
  country: string;
  client: string;
  duration: string;
  timeline: string;
  heroImage: string;
  images: string[];
  techStacks: string[];
  sections: {
    [key: string]: ProjectSection;
  };
  demoUrl?: string;
  portfolioImage?: string;
  projectType?: string;
}

export interface ProjectsDatabase {
  [key: string]: ProjectData;
}

export interface PortfolioProject {
  title: string;
  description: string;
  image: string;
  country: string;
  link: string;
  slug: string;
}
