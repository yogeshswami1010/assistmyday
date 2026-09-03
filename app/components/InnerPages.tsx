import type { ReactNode } from "react";
import styles from "./InnerPages.module.css";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function InnerPages({ children, active }: { children: ReactNode; active: string }) {
  return (
    <div className={styles.shell}>
      <SiteHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}