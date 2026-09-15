import type { Metadata } from "next";
import InnerPages from "../../components/InnerPages";
import CustomSoftwareExperience from "../../components/CustomSoftwareExperience";

export const metadata: Metadata = {
  title: "Custom Software Development | Assistmyday",
  description: "Purpose-built platforms, portals, dashboards, integrations, and automation designed around your business.",
};

export default function CustomSoftwareDevelopmentPage() {
  return <InnerPages active="SERVICES"><CustomSoftwareExperience /></InnerPages>;
}
