import Image from "next/image";
import FooterNavigation from "./FooterNavigation";

export default function SiteFooter({ id, topHref = "#" }: { id?: string; topHref?: string }) {
  return (
    <footer id={id} className="footer scene-dark footer-has-nav">
      <div className="footer-head">
        <p className="footer-kicker">BUILD THE PRODUCT. GROW THE AUDIENCE.</p>
        <a href="/contact" className="footer-mail">START A PROJECT <span>↗</span></a>
      </div>
      <FooterNavigation />
      <div className="footer-hero">
        <h2>Ready to create<br /><em>your digital advantage?</em></h2>
        <p className="footer-intro">Bring us the growth target, the product idea, or the operational bottleneck. We&apos;ll turn it into a focused digital roadmap and build it with you.</p>
      </div>
      <div className="footer-meta">
        <div className="footer-brand-lockup"><Image src="/assistmyday-logo.webp" alt="Assistmyday" width={1827} height={444} unoptimized className="footer-logo" /></div>
        <div className="footer-info">
          <div><small>CALL ANYTIME</small><p><a href="tel:+19053748878">+1 (905) 374-8878</a><br />St. Catharines, Ontario</p></div>
          <div><small>VISIT US</small><p>110 James St, Suite 411<br />St. Catharines, ON L2R 7E8</p></div>
        </div>
      </div>
      <div className="footer-base">
        <p className="copyright">© ASSISTMYDAY® 2026</p>
        <p>ST. CATHARINES — CANADA</p>
        <a href={topHref}>BACK TO TOP <span>↑</span></a>
      </div>
    </footer>
  );
}