import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import ServicesExperience from "../components/ServicesExperience";

export const metadata: Metadata = {
  title: "Services | Assistmyday",
  description: "Software development, high-performance websites, digital marketing, branding, and automation services.",
};

export default function ServicesPage() {
  return (
    <InnerPages active="SERVICES">
      <ServicesExperience />
    </InnerPages>
  );
}