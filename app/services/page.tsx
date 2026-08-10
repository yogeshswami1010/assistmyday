import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";

export const metadata: Metadata = {
  title: "Services | Assistmyday",
  description: "Software development, high-performance websites, digital marketing, branding, and automation services.",
};

const services = [
  { title: "Custom Software Development", copy: "Purpose-built web applications, portals, dashboards, API integrations, and workflow automation designed around how your organization operates.", items: ["Web applications", "Business portals", "API integrations", "Automation"] },
  { title: "Websites & E-commerce", copy: "Fast, accessible, conversion-focused websites and commerce experiences that communicate clearly and support measurable growth.", items: ["UX strategy", "Web design", "Development", "E-commerce"] },
  { title: "Performance Marketing", copy: "Connected search, paid media, content, conversion optimization, and analytics programs that turn attention into qualified demand.", items: ["SEO", "Paid media", "Content", "Analytics"] },
  { title: "Brand, Content & Social", copy: "Distinctive identities and channel-ready creative systems that build recognition, trust, and long-term audience engagement.", items: ["Brand strategy", "Visual identity", "Campaigns", "Social content"] },
];

const process = [
  ["01", "Discover", "Clarify the challenge, audience, operational context, and success measures."],
  ["02", "Define", "Translate the opportunity into a practical roadmap, scope, and delivery plan."],
  ["03", "Build", "Design, develop, launch, and measure with one accountable multidisciplinary team."],
  ["04", "Grow", "Optimize performance, expand capabilities, and improve results over time."],
];

export default function ServicesPage() {
  return (
    <InnerPages active="SERVICES">
      <section className="inner-hero">
        <div><p className="inner-kicker">OUR SERVICES</p><h1>One team for software, web, and <em>growth.</em></h1></div>
        <p className="inner-hero-copy">We combine strategy, design, engineering, content, and performance marketing to solve the complete digital challenge.</p>
      </section>
      <section className="inner-section">
        <div className="inner-section-head"><h2>Connected capabilities.</h2><p>Choose a focused service or bring us a broader growth objective. We assemble the right senior team around the outcome.</p></div>
        <div className="services-page-grid">
          {services.map((service, index) => <article className="service-page-card" key={service.title}><div><small>{String(index + 1).padStart(2, "0")} / SERVICE</small><h2>{service.title}</h2><p>{service.copy}</p></div><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
        </div>
        <div className="process-strip">{process.map(([number, title, copy]) => <article className="process-step" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
    </InnerPages>
  );
}
