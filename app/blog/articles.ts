export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogArticle = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  accent: string;
  intro: string;
  sections: ArticleSection[];
};

export const articles: BlogArticle[] = [
  {
    slug: "when-custom-software-makes-sense",
    category: "SOFTWARE",
    title: "When custom software becomes the smarter business decision",
    excerpt: "A practical framework for deciding when off-the-shelf tools are holding your operations back.",
    date: "AUG 14, 2026",
    readTime: "7 MIN READ",
    accent: "#5bb8e8",
    intro: "Custom software is not automatically the better answer. It becomes the better answer when the cost of forcing your operation into generic tools is greater than the cost of building around the way your business creates value.",
    sections: [
      { heading: "The real cost of the workaround", paragraphs: ["Most software problems do not begin as software problems. They begin as spreadsheets, duplicate entry, manual handoffs, and small exceptions that accumulate as a company grows.", "The subscription price of an off-the-shelf tool rarely captures the full cost. Teams also pay through slower decisions, avoidable errors, limited reporting, and processes that depend on individual knowledge."], bullets: ["Repeated manual data entry", "Disconnected customer and operational records", "Reporting that takes days instead of minutes", "Critical processes owned by one person"] },
      { heading: "Look for strategic difference", paragraphs: ["Custom software creates the most value when it supports something distinctive: a proprietary workflow, a better customer journey, or an operating model competitors cannot easily copy.", "If the process is standard and unlikely to change, a proven platform is usually the right choice. If the process is central to your advantage, ownership and flexibility become more important."] },
      { heading: "Start with the smallest useful system", paragraphs: ["A successful custom platform does not begin with every possible feature. It begins with one measurable bottleneck, a clear user group, and a release that makes daily work meaningfully better.", "That approach produces evidence early, reduces risk, and creates a foundation that can expand as the business learns."], bullets: ["Define one operational outcome", "Map the people and decisions involved", "Launch the smallest complete workflow", "Measure adoption before adding complexity"] },
    ],
  },
  {
    slug: "high-performance-website-strategy",
    category: "WEB STRATEGY",
    title: "Why a high-performance website is more than a redesign",
    excerpt: "How positioning, user journeys, speed, and conversion architecture work together.",
    date: "AUG 08, 2026",
    readTime: "6 MIN READ",
    accent: "#6268eb",
    intro: "A visual refresh can make a website feel current. A high-performance redesign changes how clearly the company communicates, how quickly visitors find relevance, and how consistently attention becomes action.",
    sections: [
      { heading: "Begin with the decision", paragraphs: ["Every important page should help a specific visitor make a specific decision. Without that clarity, even excellent visual design becomes decoration.", "Good web strategy identifies the questions, objections, and proof required at each stage of the journey, then organizes content around those needs."], bullets: ["Who is this page for?", "What are they trying to understand?", "What evidence reduces uncertainty?", "What is the most useful next step?"] },
      { heading: "Performance is part of trust", paragraphs: ["Speed, accessibility, and responsive behavior shape credibility before a visitor reads a word. A slow or unstable experience quietly weakens every marketing campaign sending traffic to it.", "Technical performance should be treated as a product requirement, measured before launch, and monitored as content evolves."] },
      { heading: "Design a conversion system", paragraphs: ["Conversion is not one button color. It is the combined effect of positioning, information order, proof, friction, and a clear action that matches the visitor’s readiness.", "The best websites connect analytics to that system so teams can see where interest grows, where uncertainty appears, and what to improve next."] },
    ],
  },
  {
    slug: "workflows-to-automate-first",
    category: "AUTOMATION",
    title: "Five workflows worth automating before you add more headcount",
    excerpt: "Where growing teams can remove repetitive work and create more reliable operations.",
    date: "JUL 29, 2026",
    readTime: "8 MIN READ",
    accent: "#5bb8e8",
    intro: "Automation works best when it removes predictable coordination work, not when it tries to replace judgment. The right first workflows create capacity, reduce errors, and make service more consistent.",
    sections: [
      { heading: "Choose repetition over complexity", paragraphs: ["The strongest automation candidates happen frequently, follow stable rules, and move information between people or systems. They are usually easy to describe and frustrating to perform.", "Start with volume and predictability. A modest task repeated hundreds of times can produce more value than automating a rare, complicated process."], bullets: ["Lead routing and follow-up", "Client onboarding checklists", "Approval notifications", "Recurring reporting", "Document and invoice preparation"] },
      { heading: "Keep a human at the decision point", paragraphs: ["Automation should prepare decisions, enforce the process, and surface exceptions. It should not hide uncertainty or make irreversible choices without appropriate oversight.", "A well-designed workflow gives people better context and more time for the moments where expertise matters."] },
      { heading: "Measure capacity returned", paragraphs: ["Track time saved, error reduction, cycle time, and service consistency. Those measures reveal whether the automation is creating useful capacity or simply moving work somewhere less visible.", "Once the first workflow is trusted, reuse its integrations and patterns to automate the next adjacent process."] },
    ],
  },
  {
    slug: "search-visibility-customer-intent",
    category: "SEO",
    title: "Building search visibility around real customer intent",
    excerpt: "A better approach to connecting technical SEO, useful content, and commercial priorities.",
    date: "JUL 18, 2026",
    readTime: "7 MIN READ",
    accent: "#6268eb",
    intro: "Search visibility grows when a company becomes the clearest useful answer to questions its customers genuinely ask. Rankings are the outcome of that relevance—not the strategy by themselves.",
    sections: [
      { heading: "Map intent to the customer journey", paragraphs: ["A search phrase signals more than a topic. It signals what someone is trying to accomplish and how close they may be to choosing a solution.", "Organize opportunities around learning, comparing, validating, and acting. That keeps content connected to commercial reality without turning every page into a sales pitch."], bullets: ["Problem and educational searches", "Solution and category searches", "Comparison and proof searches", "Local or transactional searches"] },
      { heading: "Build connected authority", paragraphs: ["Strong sites connect detailed supporting articles to clear service and product pages. Internal links help search engines understand the relationship, while visitors can move naturally from education to evaluation.", "Depth matters when it is useful. Publishing many isolated articles without a clear subject structure usually creates more maintenance than authority."] },
      { heading: "Fix the technical foundation", paragraphs: ["Useful content still needs to be discoverable, fast, accessible, and structurally clear. Technical SEO removes barriers so relevance can be understood and rewarded.", "Measure qualified organic visits, assisted conversions, and visibility across priority themes—not only a collection of individual keyword positions."] },
    ],
  },
  {
    slug: "paid-media-business-outcomes",
    category: "PAID MEDIA",
    title: "From campaign metrics to meaningful business outcomes",
    excerpt: "How to structure reporting around qualified demand, revenue, and better decisions.",
    date: "JUL 07, 2026",
    readTime: "6 MIN READ",
    accent: "#5bb8e8",
    intro: "Clicks, impressions, and platform conversions describe campaign activity. They do not automatically describe business value. Better reporting connects media decisions to lead quality, sales movement, and profitable growth.",
    sections: [
      { heading: "Build the measurement chain", paragraphs: ["Start with the business outcome and work backward through the events that reliably predict it. This creates a measurement chain from revenue or qualified opportunity to campaign, audience, and creative.", "Each metric should answer a decision. If a number cannot change what the team does next, it belongs in diagnostic detail rather than the executive scorecard."], bullets: ["Revenue or qualified pipeline", "Opportunity and lead quality", "Conversion rate by journey stage", "Cost to create the outcome"] },
      { heading: "Separate signal from platform credit", paragraphs: ["Advertising platforms are designed to claim influence. Compare their reporting with analytics and CRM data, and use consistent definitions for qualified demand.", "No attribution model is perfect. The objective is a stable decision framework that makes budget allocation less dependent on one platform’s version of the journey."] },
      { heading: "Report the next move", paragraphs: ["A useful report explains what changed, why it likely changed, and what the team will do because of it. Charts without interpretation create visibility but not direction.", "Connect creative learning, audience quality, landing-page performance, and sales feedback into one operating rhythm."] },
    ],
  },
  {
    slug: "design-systems-for-growth",
    category: "BRAND",
    title: "Design systems that help growing companies move faster",
    excerpt: "Why a practical identity system improves consistency across teams, channels, and campaigns.",
    date: "JUN 26, 2026",
    readTime: "7 MIN READ",
    accent: "#6268eb",
    intro: "A brand system is valuable when it helps people create good work consistently. It should reduce repeated decisions, protect what makes the company recognizable, and still leave room for ideas.",
    sections: [
      { heading: "Move beyond the logo package", paragraphs: ["A logo, typeface, and color palette establish ingredients. Teams also need rules for composition, voice, imagery, motion, and how those ingredients adapt across real channels.", "The system should reflect the work people produce every week—from proposals and product screens to social campaigns and event materials."], bullets: ["Core identity and usage rules", "Layout and typography patterns", "Content voice and messaging", "Reusable digital components"] },
      { heading: "Create constraints that generate consistency", paragraphs: ["Useful constraints make decisions faster. They define what remains constant and where teams can explore, preventing every new asset from becoming a reinvention.", "The right level of governance depends on team size, channels, and production pace. A system should be strong enough to guide and simple enough to use."] },
      { heading: "Treat the system as a product", paragraphs: ["Brand systems improve through real use. Assign ownership, collect recurring questions, and update components when the organization’s needs change.", "A living system turns brand quality from a specialist task into a shared capability across marketing, product, and sales."] },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
