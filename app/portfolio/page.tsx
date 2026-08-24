import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import PortfolioExperience from "../components/PortfolioExperience";
import { getPortfolioProjects } from "../../lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Portfolio | Assistmyday",
  description: "Selected software, website, brand, and digital marketing work by Assistmyday.",
};

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();
  return <InnerPages active="PORTFOLIO"><PortfolioExperience projects={projects} /></InnerPages>;
}