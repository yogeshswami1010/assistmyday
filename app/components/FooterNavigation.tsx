import styles from "./FooterNavigation.module.css";

const footerLinks = [
  { label: "HOME", href: "/" },
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "SERVICES", href: "/services" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT US", href: "/contact" },
];

export default function FooterNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Footer navigation">
      {footerLinks.map((item, index) => (
        <a href={item.href} key={item.label}>
          <small>{String(index + 1).padStart(2, "0")}</small>
          <span>{item.label}</span>
          <b aria-hidden="true">↗</b>
        </a>
      ))}
    </nav>
  );
}
