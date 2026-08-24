import HomeExperience from "./components/HomeExperience";
import { getPortfolioProjects, getServices } from "../lib/content-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const [services, portfolio] = await Promise.all([getServices(), getPortfolioProjects()]);
  return <HomeExperience services={services} portfolio={portfolio} />;
}