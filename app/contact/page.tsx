import type { Metadata } from "next";
import InnerPages from "../components/InnerPages";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Assistmyday",
  description: "Talk to Assistmyday about your software, website, automation, or digital marketing project.",
};

export default function ContactPage() {
  return (
    <InnerPages active="CONTACT">
      <section className="inner-hero">
        <div><p className="inner-kicker">START A CONVERSATION</p><h1>Bring us the challenge. We&apos;ll build the <em>way forward.</em></h1></div>
        <p className="inner-hero-copy">Tell us what you are trying to improve, launch, automate, or grow. We will help turn it into a focused digital plan.</p>
      </section>
      <section className="inner-section">
        <div className="contact-layout">
          <div className="contact-details">
            <h2>Let&apos;s talk about what comes next.</h2>
            <p><strong>Email</strong><br /><a href="mailto:info@assistmyday.com">info@assistmyday.com</a></p>
            <p><strong>Call</strong><br /><a href="tel:+19053748878">+1 (905) 374-8878</a></p>
            <p><strong>Visit</strong><br />110 James St, Suite 411<br />St. Catharines, ON L2R 7E8</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </InnerPages>
  );
}
