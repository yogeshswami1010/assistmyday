import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import styles from "../privacy-policy/PrivacyPolicy.module.css";

export const metadata: Metadata = {
  title: "Terms and Conditions | Assist My Day",
  description: "Terms governing use of the Assist My Day website and digital, creative, marketing, and technology services.",
};

const sections = [
  ["acceptance", "Acceptance of terms"], ["services", "Our services"], ["agreements", "Proposals and agreements"],
  ["payments", "Pricing and payments"], ["delivery", "Delivery and client responsibilities"], ["marketing", "Marketing disclaimer"],
  ["development", "Website and software development"], ["ownership", "Intellectual property"], ["privacy", "Privacy and data protection"],
  ["ai", "Artificial intelligence"], ["use", "Website use"], ["liability", "Disclaimers and liability"],
  ["termination", "Cancellation and termination"], ["sms", "SMS messaging terms"], ["law", "Governing law"], ["contact", "Contact"],
] as const;

export default function TermsAndConditionsPage() {
  return <InnerPages active="">
    <section className={styles.hero}>
      <p>LEGAL / TERMS</p>
      <h1>Terms <em>and Conditions.</em></h1>
      <div><span>LAST UPDATED</span><strong>October 28, 2026</strong></div>
    </section>
    <section className={styles.policy}>
      <aside><p>ON THIS PAGE</p><nav aria-label="Terms and conditions sections">
        {sections.map(([id, label], index) => <a href={`#${id}`} key={id}><small>{String(index + 1).padStart(2, "0")}</small>{label}</a>)}
      </nav></aside>
      <article>
        <div className={styles.intro}><p>Welcome to Assist My Day. These Terms and Conditions govern access to <a href="https://assistmyday.com/">assistmyday.com</a> and the professional digital, creative, marketing, and technology services offered by Assist My Day in St. Catharines, Ontario.</p><p>By using this website, submitting an enquiry, requesting a quotation, or engaging our services, you agree to these Terms. A separate signed proposal, statement of work, or service agreement takes precedence where it conflicts with these Terms.</p></div>

        <section id="acceptance"><span>01</span><h2>Acceptance of terms</h2><p>You confirm that you are legally able to accept these Terms and, when acting for a business or organization, have authority to bind it. These Terms apply to visitors, prospective clients, clients, and anyone interacting with our website or services.</p></section>
        <section id="services"><span>02</span><h2>Our services</h2><p>We provide website design and development, e-commerce, custom software, web applications, CRM and API integrations, automation, SEO, digital advertising, social media, branding, content, analytics, and related consulting. The applicable proposal describes the scope, deliverables, schedule, fees, and responsibilities. We may modify or discontinue offerings subject to existing commitments.</p></section>
        <section id="agreements"><span>03</span><h2>Proposals and service agreements</h2><p>Proposals are based on information available at consultation and are valid for 30 calendar days unless stated otherwise. Work begins after acceptance and any required initial payment. Timelines are estimates unless expressly guaranteed in writing. Scope changes, substantial redesigns, new features, and additional pages or integrations may require written approval and additional fees.</p></section>
        <section id="payments"><span>04</span><h2>Pricing, payments, deposits, and refunds</h2><p>Prices are in Canadian dollars and applicable taxes, including HST, are added where required. Payment schedules and recurring billing are set out in the applicable agreement. Approved third-party costs may be billed separately. Overdue invoices may result in suspension of non-essential work after notice. Deposits and refunds depend on the agreement, work completed, committed expenses, and applicable law; completed services are not refundable except where required by law or agreed in writing.</p></section>
        <section id="delivery"><span>05</span><h2>Delivery and client responsibilities</h2><p>Clients must provide accurate information, content, branding, approvals, account access, payments, and timely feedback. Supplied materials must be lawful and must not infringe third-party rights. Delays in content, approvals, payment, or access may adjust the schedule. Revisions are limited to the agreed review stages; unlimited revisions are not included unless expressly agreed.</p></section>
        <section id="marketing"><span>06</span><h2>Digital marketing and advertising disclaimer</h2><p>Marketing outcomes depend on algorithms, platform policies, competition, budgets, consumer behaviour, market conditions, website performance, and the client’s sales process. We do not guarantee rankings, traffic, leads, sales, conversion rates, advertising returns, follower growth, or revenue. Advertising platform charges are separate unless expressly included, and third-party platforms may change or restrict accounts.</p></section>
        <section id="development"><span>07</span><h2>Website and software development</h2><p>We make commercially reasonable efforts to deliver solutions matching agreed specifications. Hosting, domains, premium plugins, subscriptions, maintenance, updates, and support are separate unless included in writing. New features outside scope may cost extra. No website, application, or digital system can be guaranteed to operate without interruption, vulnerabilities, or defects under all circumstances.</p></section>
        <section id="ownership"><span>08</span><h2>Intellectual property and ownership</h2><p>Assist My Day retains its pre-existing software, frameworks, reusable code, templates, methods, and general know-how. Ownership or licensing of final client deliverables transfers only as stated in the applicable agreement and, unless otherwise agreed, after all applicable payments are received. Third-party fonts, stock, plugins, software, and other assets remain subject to their licenses.</p></section>
        <section id="privacy"><span>09</span><h2>Confidentiality and data protection</h2><p>Each party will use reasonable measures to protect non-public business, technical, financial, and marketing information. Personal information is handled under applicable Canadian privacy laws, including PIPEDA where applicable. See our <a href="/privacy-policy">Privacy Policy</a> for details. Service providers may process information to host, communicate, analyze, or deliver services.</p></section>
        <section id="ai"><span>10</span><h2>Artificial intelligence and automation</h2><p>AI-assisted outputs may be inaccurate, incomplete, or unexpected. Clients must review outputs before relying on them for material business, financial, legal, employment, or other consequential decisions. Third-party AI terms and data-processing conditions may apply.</p></section>
        <section id="use"><span>11</span><h2>Website use and prohibited activities</h2><p>You must not attempt unauthorized access, introduce malicious code, interfere with availability or security, scrape content where prohibited, impersonate others, submit fraudulent enquiries, infringe rights, or use the website unlawfully. We may restrict access where reasonably necessary to protect users, systems, or legal rights.</p></section>
        <section id="liability"><span>12</span><h2>Warranties and limitation of liability</h2><p>The website and public information are provided on an “as available” basis except as expressly stated in writing or required by law. To the maximum extent permitted, Assist My Day is not liable for indirect, incidental, special, consequential, lost-profit, or lost-opportunity damages. Nothing excludes liability or statutory rights that cannot legally be excluded.</p></section>
        <section id="termination"><span>13</span><h2>Cancellation, termination, and publicity</h2><p>Termination follows the applicable agreement. Clients remain responsible for completed work, approved expenses, and amounts properly payable. Paid deliverables and access are transitioned as agreed. Completed projects may be shown in our portfolio only subject to the client agreement, confidentiality obligations, and any required consent.</p></section>
        <section id="sms"><span>14</span><h2>SMS messaging terms</h2><p>By opting in to SMS messages, you confirm that you are 18 years of age or older and authorize Assist My Day to send the message type you selected, including marketing messages or non-marketing service updates and reminders. Message frequency may vary.</p><p>To stop receiving messages, reply <strong>STOP</strong> to any text message. Text <strong>HELP</strong> for assistance. Message and data rates may apply; check with your carrier for details. Carriers are not liable for delayed or undelivered messages.</p></section>
        <section id="law"><span>15</span><h2>Governing law and changes</h2><p>These Terms are governed by Ontario law and applicable federal Canadian law. The parties will first try to resolve disputes in good faith. We may update these Terms by publishing a revised version and effective date. If a provision is unenforceable, the remaining provisions continue to apply.</p></section>
        <section id="contact" className={styles.contact}><span>16</span><h2>Contact</h2><p>Questions about these Terms may be sent to Assist My Day:</p><ul><li>73 Ontario Street, Unit 103 A, St. Catharines, Ontario, L2R 5J5, Canada</li><li>Phone: <a href="tel:+19053748878">+1 (905) 374-8878</a></li><li>Website: <a href="/contact">Contact us</a></li></ul></section>
      </article>
    </section>
  </InnerPages>;
}
