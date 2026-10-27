import type { Metadata } from "next";
import InnerPages from "../../components/InnerPages";
import CustomSoftwareExperience from "../../components/CustomSoftwareExperience";

export const metadata: Metadata = {
  title: "Custom Software Development | Assistmyday",
  description: "Purpose-built platforms, portals, dashboards, integrations, and automation designed around your business.",
};

// This page contains interactive client-side sections and should not be
// statically prerendered during the production build. Keeping it dynamic also
// avoids Next.js attempting to evaluate client macros in the prerender worker.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function CustomSoftwareDevelopmentPage() {
  return <InnerPages active="SERVICES"><CustomSoftwareExperience /></InnerPages>;
}
