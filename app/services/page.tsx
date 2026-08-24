import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import ServicesExperience from "../components/ServicesExperience";
import { getServices } from "../../lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Services | Assistmyday",
  description: "Software development, high-performance websites, digital marketing, branding, and automation services.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return <InnerPages active="SERVICES"><ServicesExperience services={services} /></InnerPages>;
}