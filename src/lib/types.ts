export interface ProjectSection {
  title: string;
  content: string[];
}

export interface ProjectData {
  title: string;
  subtitle: string;
  client: string;
  duration: string;
  timeline: string;
  heroImage: string;
  images: string[];
  techStacks: string[];
  sections: {
    [key: string]: ProjectSection;
  };
}

export interface ProjectsDatabase {
  [key: string]: ProjectData;
}

export interface PortfolioProject {
  title: string;
  description: string;
  image: string;
  link: string;
}
