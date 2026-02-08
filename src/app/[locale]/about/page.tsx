import { getPublishedProjects } from "@/lib/cms/queries/projects";
import { getAboutStats } from "@/lib/aboutData";
import AboutContent from "./AboutContent";

export default async function AboutPage() {
  const dbProjects = await getPublishedProjects();

  // Build a simple record for aboutData helpers
  const projectRecord = Object.fromEntries(
    dbProjects.map((p) => [p.slug, { country: p.country || "" }])
  );
  const aboutStats = getAboutStats(projectRecord);

  return <AboutContent aboutStats={aboutStats} />;
}
