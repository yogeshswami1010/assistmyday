import Image from "next/image";
import { requireAdminSession } from "../../../lib/admin-auth";
import { describeDatabaseError, getContactSubmissions, isDatabaseConfigured } from "../../../lib/content-store";
import styles from "../Admin.module.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Contact Submissions | Assistmyday", robots: { index: false, follow: false } };

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto",
  }).format(date);
}

export default async function AdminContactsPage() {
  const session = await requireAdminSession();
  let databaseReady = isDatabaseConfigured();
  let databaseMessage = databaseReady ? "" : "Database environment variables are missing.";
  let contacts: Awaited<ReturnType<typeof getContactSubmissions>> = [];

  if (databaseReady) {
    try {
      contacts = await getContactSubmissions();
    } catch (error) {
      console.error("Unable to load contact submissions.", error);
      databaseMessage = describeDatabaseError(error);
      databaseReady = false;
    }
  }

  const delivered = contacts.filter((contact) => contact.emailSent).length;
  return <div className={styles.shell}>
    <header className={styles.topbar}><Image className={styles.logo} src="/assistmyday-logo-white.png" alt="Assistmyday" width={2424} height={462} priority /><div className={styles.account}><span>{session.email}</span><a className={styles.ghostButton} href="/" target="_blank">VIEW SITE ↗</a><a className={styles.ghostButton} href="/admin">CONTENT ADMIN</a></div></header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}><small>CONTENT</small><a className={styles.navButton} href="/admin"><span>Portfolio</span><b>01</b></a><a className={styles.navButton} href="/admin"><span>Services</span><b>02</b></a><a className={styles.navButton} href="/admin"><span>Blog</span><b>03</b></a><a className={`${styles.navButton} ${styles.navActive}`} href="/admin/contacts"><span>Contacts</span><b>04</b></a></aside>
      <main className={styles.main}>
        <header className={styles.heading}><div><p>ASSISTMYDAY / ADMIN</p><h1>Contact <em>submissions.</em></h1></div></header>
        {!databaseReady && <div className={styles.notice}><strong>MySQL is not connected.</strong><br />{databaseMessage}</div>}
        <section className={styles.stats}><div className={styles.stat}><small>TOTAL ENTRIES</small><strong>{contacts.length}</strong></div><div className={styles.stat}><small>EMAIL DELIVERED</small><strong>{delivered}</strong></div><div className={styles.stat}><small>EMAIL FAILED</small><strong>{contacts.length - delivered}</strong></div></section>
        <section className={styles.contactList}>{contacts.length ? contacts.map((contact) => <article className={styles.contactEntry} key={contact.id}>
          <header><div><small>#{contact.id} · {displayDate(contact.createdAt)} ET</small><h2>{contact.name}</h2></div><span className={`${styles.contactDelivery} ${contact.emailSent ? "" : styles.contactDeliveryFailed}`}>{contact.emailSent ? "Email delivered" : "Saved · Email failed"}</span></header>
          <div className={styles.contactMeta}><p><small>EMAIL</small><a href={`mailto:${contact.email}`}>{contact.email}</a></p><p><small>PHONE</small>{contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : <span>Not provided</span>}</p><p><small>COMPANY</small><span>{contact.company || "Not provided"}</span></p></div>
          <div className={styles.contactMessage}><small>MESSAGE</small><p>{contact.message}</p></div>
          <footer><a className={styles.editButton} href={`mailto:${contact.email}?subject=${encodeURIComponent("Re: Your Assistmyday enquiry")}`}>REPLY BY EMAIL ↗</a>{contact.emailError && <small title={contact.emailError}>SMTP: {contact.emailError}</small>}</footer>
        </article>) : <div className={styles.empty}>{databaseReady ? "No contact submissions yet." : "Connect the database to view submissions."}</div>}</section>
      </main>
    </div>
  </div>;
}