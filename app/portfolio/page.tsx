import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import PortfolioExperience from "../components/PortfolioExperience";

export const metadata: Metadata = {
  title: "Portfolio | Assistmyday",
  description: "Selected software, website, brand, and digital marketing work by Assistmyday.",
};

export default function PortfolioPage() {
  return (
    <InnerPages active="PORTFOLIO">
      <PortfolioExperience />
    </InnerPages>
  );
}