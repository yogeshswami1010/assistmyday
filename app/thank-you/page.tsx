import type { Metadata } from "next";
import Link from "next/link";
import InnerPages from "../components/InnerPages";

export const metadata: Metadata = {
  title: "Thank You | Assistmyday",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <InnerPages active="CONTACT">
      <section className="inner-hero">
        <div>
          <p className="inner-kicker">MESSAGE RECEIVED</p>
          <h1>Thank you for <em>getting in touch.</em></h1>
        </div>
        <div className="inner-hero-copy">
          <p>We’ve received your message. The Assistmyday team will review it and get back to you.</p>
          <Link className="inner-cta" href="/">
            BACK TO HOME <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </InnerPages>
  );
}
