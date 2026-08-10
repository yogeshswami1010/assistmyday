import type { Metadata } from "next";
import Image from "next/image";
import InnerPages from "../components/InnerPages";

export const metadata: Metadata = {
  title: "Portfolio | Assistmyday",
  description: "Selected software, website, brand, and digital marketing work by Assistmyday.",
};

const projects = [
  { title: "Signarama Brampton", category: "Lead-generation website", image: "/portfolio-signarama-home.webp" },
  { title: "Signarama Toronto", category: "SEO and content experience", image: "/portfolio-signarama-about.webp" },
  { title: "Rio Immigration", category: "Consultancy web platform", image: "/portfolio-rio-immigration.webp" },
  { title: "Consortium Staffing", category: "Recruitment platform", image: "/portfolio-consortium-staffing.webp" },
  { title: "The Burke Group", category: "Executive search brand platform", image: "/portfolio-burke-group.webp" },
  { title: "AMD Studios", category: "Conversion-focused studio website", image: "/portfolio-amd-studios.webp" },
  { title: "GeoSolar", category: "Sustainability marketing website", image: "/portfolio-geosolar.webp" },
  { title: "Vishal Bangarh", category: "Real estate lead generation", image: "/portfolio-vishal-bangarh.webp" },
];

export default function PortfolioPage() {
  return (
    <InnerPages active="PORTFOLIO">
      <section className="inner-hero">
        <div><p className="inner-kicker">SELECTED WORK / 2026</p><h1>Digital work built to <em>perform.</em></h1></div>
        <p className="inner-hero-copy">A selection of websites, platforms, brands, and growth systems created for ambitious organizations across Canada.</p>
      </section>
      <section className="inner-section">
        <div className="inner-section-head"><h2>Strategy through delivery.</h2><p>Every engagement connects design quality with a clear business objective—from visibility and conversion to operational efficiency.</p></div>
        <div className="portfolio-page-grid">
          {projects.map((project, index) => (
            <article className="portfolio-page-card" key={project.title}>
              <div className="portfolio-page-image"><Image src={project.image} alt={`${project.title} website`} width={1904} height={870} unoptimized /></div>
              <div className="portfolio-page-meta"><h2>{project.title}</h2><p>{project.category}</p><span>{String(index + 1).padStart(2, "0")}</span></div>
            </article>
          ))}
        </div>
      </section>
    </InnerPages>
  );
}
