import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import styles from "./PrivacyPolicy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Assistmyday",
  description: "Learn how Assist My Day collects, uses, protects, and manages personal information.",
};

const sections = [
  ["definitions", "Interpretation and definitions"], ["data", "Information we collect"],
  ["cookies", "Cookies and tracking"], ["use", "How we use information"],
  ["sharing", "How we share information"], ["retention", "Retention and transfers"],
  ["disclosure", "Disclosure and security"], ["rights", "Your rights"],
  ["links", "External links"], ["changes", "Policy changes"], ["contact", "Contact us"],
] as const;

export default function PrivacyPolicyPage() {
  return (
    <InnerPages active="">
      <section className={styles.hero}>
        <p>LEGAL / PRIVACY</p>
        <h1>Privacy <em>Policy.</em></h1>
        <div><span>LAST UPDATED</span><strong>February 14, 2024</strong></div>
      </section>

      <section className={styles.policy}>
        <aside>
          <p>ON THIS PAGE</p>
          <nav aria-label="Privacy policy sections">
            {sections.map(([id, label], index) => <a href={`#${id}`} key={id}><small>{String(index + 1).padStart(2, "0")}</small>{label}</a>)}
          </nav>
        </aside>

        <article>
          <div className={styles.intro}>
            <p>This Privacy Policy describes how Assist My Day collects, uses, and discloses your information when you use our website and services. It also explains your privacy rights and how the law protects you.</p>
            <p>We use personal data to provide and improve our services. By using the website, you agree to the collection and use of information in accordance with this policy.</p>
          </div>

          <section id="definitions">
            <span>01</span><h2>Interpretation and definitions</h2>
            <p>Capitalized words have the meanings described below, whether they appear in singular or plural form.</p>
            <dl>
              <div><dt>You</dt><dd>The person using the service, or the business or legal entity on whose behalf that person is acting.</dd></div>
              <div><dt>Company</dt><dd>Assist My Day, 111 Fourth Ave, Suite 168, St. Catharines, ON L2S 3P5, referred to as “the Company,” “we,” “us,” or “our.”</dd></div>
              <div><dt>Affiliate</dt><dd>An entity that controls, is controlled by, or is under common control with another party.</dd></div>
              <div><dt>Account</dt><dd>A unique account created for you to access our service or parts of it.</dd></div>
              <div><dt>Website and Service</dt><dd>The Assist My Day website, accessible at <a href="https://www.assistmyday.com">www.assistmyday.com</a>.</dd></div>
              <div><dt>Service Provider</dt><dd>A person or company that processes data on our behalf to provide, support, or analyze the service.</dd></div>
              <div><dt>Personal Data</dt><dd>Information relating to an identified or identifiable individual.</dd></div>
              <div><dt>Cookies</dt><dd>Small files placed on a computer, mobile device, or other device that store browsing information.</dd></div>
              <div><dt>Device</dt><dd>Any device that can access the service, including a computer, mobile phone, or tablet.</dd></div>
              <div><dt>Usage Data</dt><dd>Information collected automatically through use of the service or its infrastructure.</dd></div>
            </dl>
          </section>

          <section id="data">
            <span>02</span><h2>Information we collect</h2>
            <h3>Personal data</h3>
            <p>When you use our service, we may ask for information that can be used to contact or identify you, including:</p>
            <ul><li>Email address</li><li>First and last name</li><li>Phone number</li><li>Address, city, province or state, and postal or ZIP code</li></ul>
            <h3>Usage data</h3>
            <p>Usage Data may be collected automatically. It can include your device’s IP address, browser type and version, pages visited, visit dates and times, time spent on pages, unique device identifiers, and diagnostic data.</p>
            <p>When you access the service through a mobile device, we may also receive the device type, unique mobile ID, mobile IP address, operating system, mobile browser type, and related diagnostics.</p>
          </section>

          <section id="cookies">
            <span>03</span><h2>Cookies and tracking technologies</h2>
            <p>We use cookies and similar technologies, including beacons, tags, and scripts, to track activity, store information, improve the service, and understand how it is used. You can tell your browser to refuse cookies or notify you when a cookie is sent, although some site features may then be unavailable.</p>
            <div className={styles.cards}>
              <div><h3>Necessary cookies</h3><p>Session cookies used to provide requested services, authenticate users, and help prevent fraudulent account use.</p></div>
              <div><h3>Cookie preference cookies</h3><p>Persistent cookies used to remember whether you accepted the website’s cookie notice.</p></div>
              <div><h3>Functionality cookies</h3><p>Persistent cookies used to remember choices such as login details or language preferences.</p></div>
            </div>
          </section>

          <section id="use"><span>04</span><h2>How we use personal data</h2><p>We may use personal data to:</p><ul><li>Provide, maintain, monitor, and improve our service.</li><li>Manage your account and access to available features.</li><li>Perform contracts for products or services you purchase.</li><li>Contact you by email, phone, SMS, or similar communications about services, updates, and security notices.</li><li>Provide news, offers, and information about similar services unless you opt out.</li><li>Attend to and manage your requests.</li></ul></section>

          <section id="sharing"><span>05</span><h2>How we share information</h2><p>We may share personal information with service providers that support or analyze our service; during business transfers such as a merger, financing, or sale; with affiliates required to honor this policy; with business partners offering relevant services or promotions; and with other users when you choose to share information in public areas or through connected social media services.</p></section>

          <section id="retention"><span>06</span><h2>Retention and international transfers</h2><p>We retain personal data only as long as necessary for the purposes in this policy and as needed to meet legal obligations, resolve disputes, and enforce agreements. Usage Data is generally retained for a shorter period unless needed for security, service improvements, or legal compliance.</p><p>Your information may be processed in locations where the parties involved operate, including jurisdictions with different data-protection laws. We take reasonable steps to ensure your data is handled securely and is not transferred without appropriate controls.</p></section>

          <section id="disclosure"><span>07</span><h2>Disclosure and security</h2><p>If the Company is involved in a merger, acquisition, or asset sale, personal data may be transferred. We will provide notice before it becomes subject to a different privacy policy.</p><p>We may disclose information when required by law or in response to valid public-authority requests, and when reasonably necessary to comply with legal obligations, protect Company rights or property, investigate wrongdoing, protect users or the public, or guard against legal liability.</p><p>We use commercially reasonable safeguards, but no internet transmission or electronic storage method is completely secure, so we cannot guarantee absolute security.</p></section>

          <section id="rights"><span>08</span><h2>Your privacy rights</h2><p>Depending on applicable law, you may have the right to access, correct, erase, or receive a copy of your personal data; restrict or object to processing; request data portability; withdraw consent; and complain to a regulatory authority.</p><p>To exercise your rights or opt out of direct marketing and related profiling, email <a href="mailto:assistmyday@gmail.com">assistmyday@gmail.com</a>. We will respond in accordance with applicable law. If required information cannot be collected or processed, some requested services may not be available.</p></section>

          <section id="links"><span>09</span><h2>Links to other websites</h2><p>Our service may link to websites that we do not operate. We recommend reviewing each third party’s privacy policy. We do not control and are not responsible for third-party content, policies, or practices.</p></section>

          <section id="changes"><span>10</span><h2>Changes to this policy</h2><p>We may update this Privacy Policy from time to time. Changes will be posted on this page, and the “Last updated” date will be revised. Where appropriate, we may also provide notice by email or through a prominent service notice before a change takes effect.</p></section>

          <section id="contact" className={styles.contact}><span>11</span><h2>Contact us</h2><p>If you have questions about this Privacy Policy, contact Assist My Day:</p><ul><li>Email: <a href="mailto:assistmyday@gmail.com">assistmyday@gmail.com</a></li><li>Phone: <a href="tel:+19053748878">+1 (905) 374-8878</a></li><li>Online: <a href="/contact">Contact us</a></li></ul></section>
        </article>
      </section>
    </InnerPages>
  );
}
