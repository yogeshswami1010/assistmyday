"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import type { BlogArticle, ContentKind, PortfolioProject, ServiceItem } from "../../lib/content-types";
import styles from "./Admin.module.css";

type ManagedItem = PortfolioProject | ServiceItem | BlogArticle;
type Records = Record<ContentKind, ManagedItem[]>;

const labels: Record<ContentKind, string> = { portfolio: "Portfolio", services: "Services", blogs: "Blog" };

function articleToText(sections: BlogArticle["sections"]) {
  return sections.map((section) => [
    `## ${section.heading}`,
    ...section.paragraphs,
    ...(section.bullets || []).map((bullet) => `- ${bullet}`),
  ].join("\n\n")).join("\n\n");
}

function textToSections(value: string): BlogArticle["sections"] {
  const result: BlogArticle["sections"] = [];
  let current = { heading: "Overview", paragraphs: [] as string[], bullets: [] as string[] };
  const flush = () => {
    if (current.paragraphs.length || current.bullets.length || current.heading !== "Overview") {
      result.push({ heading: current.heading, paragraphs: current.paragraphs, ...(current.bullets.length ? { bullets: current.bullets } : {}) });
    }
  };
  value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => {
    if (line.startsWith("## ")) {
      flush(); current = { heading: line.slice(3).trim() || "Section", paragraphs: [], bullets: [] };
    } else if (line.startsWith("- ")) current.bullets.push(line.slice(2).trim());
    else current.paragraphs.push(line);
  });
  flush();
  return result.length ? result : [{ heading: "Overview", paragraphs: [value.trim()] }];
}

function newDraft(kind: ContentKind): Record<string, unknown> {
  if (kind === "portfolio") return { title: "", slug: "", category: "", image: "", projectUrl: "/contact", description: "", size: "large", side: "left", sortOrder: 0, published: true };
  if (kind === "services") return { number: "", title: "", label: "", copy: "", itemsText: "", motif: "rings", sortOrder: 0, published: true };
  return { title: "", slug: "", category: "", excerpt: "", date: "", readTime: "6 MIN READ", accent: "#5bb8e8", intro: "", articleBody: "", sortOrder: 0, published: true };
}

function toDraft(kind: ContentKind, item: ManagedItem) {
  if (kind === "services") return { ...item, itemsText: (item as ServiceItem).items.join("\n") };
  if (kind === "blogs") return { ...item, articleBody: articleToText((item as BlogArticle).sections) };
  return { ...item };
}

export default function AdminPanel({ email, databaseReady, initialRecords }: { email: string; databaseReady: boolean; initialRecords: Records }) {
  const router = useRouter();
  const [active, setActive] = useState<ContentKind>("portfolio");
  const [records, setRecords] = useState<Records>(initialRecords);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const activeItems = records[active];
  const publishedCount = useMemo(() => activeItems.filter((item) => item.published).length, [activeItems]);
  const field = (name: string) => String(draft?.[name] ?? "");
  const update = (name: string, value: unknown) => setDraft((current) => current ? { ...current, [name]: value } : current);

  function openNew() { setEditingId(undefined); setDraft(newDraft(active)); setError(""); }
  function openEdit(item: ManagedItem) { setEditingId(item.id); setDraft(toDraft(active, item)); setError(""); }

  async function refresh() {
    const response = await fetch(`/api/admin/content/${active}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to refresh content.");
    setRecords((current) => ({ ...current, [active]: data.items }));
  }

  async function save(event: FormEvent) {
    event.preventDefault(); if (!draft) return;
    setSaving(true); setError("");
    const payload = { ...draft } as Record<string, unknown>;
    if (active === "services") payload.items = field("itemsText").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
    if (active === "blogs") payload.sections = textToSections(field("articleBody"));
    const response = await fetch(`/api/admin/content/${active}${editingId ? `/${editingId}` : ""}`, {
      method: editingId ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Unable to save content."); setSaving(false); return; }
    await refresh(); setDraft(null); setSaving(false); router.refresh();
  }

  async function remove(item: ManagedItem) {
    if (!item.id || !window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/content/${active}/${item.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { window.alert(data.error || "Unable to delete content."); return; }
    await refresh(); router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); router.refresh();
  }

  function changeSection(kind: ContentKind) { setActive(kind); setDraft(null); setError(""); }

  return <div className={styles.shell}>
    <header className={styles.topbar}><Image className={styles.logo} src="/assistmyday-logo.webp" alt="Assistmyday" width={350} height={84} priority /><div className={styles.account}><span>{email}</span><a className={styles.ghostButton} href="/" target="_blank">VIEW SITE ↗</a><button className={styles.ghostButton} onClick={logout}>SIGN OUT</button></div></header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}><small>CONTENT</small>{(["portfolio", "services", "blogs"] as ContentKind[]).map((kind, index) => <button key={kind} onClick={() => changeSection(kind)} className={`${styles.navButton} ${active === kind ? styles.navActive : ""}`}><span>{labels[kind]}</span><b>0{index + 1}</b></button>)}</aside>
      <main className={styles.main}>
        <header className={styles.heading}><div><p>ASSISTMYDAY / ADMIN</p><h1>Manage <em>{labels[active].toLowerCase()}.</em></h1></div><button className={styles.primaryButton} onClick={openNew} disabled={!databaseReady}>＋ ADD NEW</button></header>
        {!databaseReady && <div className={styles.notice}>The admin interface is ready, but MySQL is not connected. Add <code>DB_HOST</code>, <code>DB_USER</code>, <code>DB_PASSWORD</code>, and <code>DB_NAME</code> in Hostinger, then redeploy.</div>}
        <section className={styles.stats}><div className={styles.stat}><small>TOTAL RECORDS</small><strong>{activeItems.length}</strong></div><div className={styles.stat}><small>PUBLISHED</small><strong>{publishedCount}</strong></div><div className={styles.stat}><small>DRAFTS</small><strong>{activeItems.length - publishedCount}</strong></div></section>
        <section className={styles.list}>{activeItems.length ? activeItems.map((item) => {
          const image = active === "portfolio" ? (item as PortfolioProject).image : "";
          const subtitle = active === "portfolio" ? (item as PortfolioProject).category : active === "services" ? (item as ServiceItem).label : `${(item as BlogArticle).category} · ${(item as BlogArticle).date}`;
          return <article className={styles.card} key={`${active}-${item.id || item.title}`}>
            {image ? <Image className={styles.thumb} src={image} alt="" width={78} height={58} unoptimized /> : <div className={styles.thumbText}>{active === "services" ? (item as ServiceItem).number : (item as BlogArticle).category.slice(0, 2)}</div>}
            <div><h2>{item.title}<span className={`${styles.status} ${!item.published ? styles.draftStatus : ""}`}>{item.published ? "Published" : "Draft"}</span></h2><p>{subtitle}</p></div>
            <div className={styles.actions}><button className={styles.editButton} onClick={() => openEdit(item)}>EDIT</button><button className={styles.dangerButton} onClick={() => remove(item)}>DELETE</button></div>
          </article>;
        }) : <div className={styles.empty}>{databaseReady ? `No ${labels[active].toLowerCase()} content yet.` : "Connect the database to begin managing content."}</div>}</section>
      </main>
    </div>
    {draft && <div className={styles.editorBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setDraft(null)}><section className={styles.editor} role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <header className={styles.editorHeader}><div><p>{editingId ? "EDIT RECORD" : "NEW RECORD"}</p><h2 id="editor-title">{editingId ? `Edit ${labels[active]}` : `Add ${labels[active]}`}</h2></div><button className={styles.close} onClick={() => setDraft(null)} aria-label="Close editor">×</button></header>
      <form onSubmit={save}><div className={styles.formGrid}>
        {active === "portfolio" && <>
          <Field label="PROJECT TITLE" value={field("title")} onChange={(v) => update("title", v)} required /><Field label="SLUG" value={field("slug")} onChange={(v) => update("slug", v)} placeholder="generated-from-title" />
          <Field label="CATEGORY" value={field("category")} onChange={(v) => update("category", v)} required /><Field label="SORT ORDER" type="number" value={field("sortOrder")} onChange={(v) => update("sortOrder", v)} />
          <Field wide label="IMAGE URL OR /PUBLIC PATH" value={field("image")} onChange={(v) => update("image", v)} required /><Field wide label="PROJECT LINK" value={field("projectUrl")} onChange={(v) => update("projectUrl", v)} required />
          <Field wide area label="SHORT DESCRIPTION" value={field("description")} onChange={(v) => update("description", v)} />
          <Select label="CARD SIZE" value={field("size")} onChange={(v) => update("size", v)} options={["medium", "large", "xlarge"]} /><Select label="CARD POSITION" value={field("side")} onChange={(v) => update("side", v)} options={["left", "right", "center"]} />
        </>}
        {active === "services" && <>
          <Field label="NUMBER" value={field("number")} onChange={(v) => update("number", v)} required /><Field label="SORT ORDER" type="number" value={field("sortOrder")} onChange={(v) => update("sortOrder", v)} />
          <Field wide label="SERVICE TITLE" value={field("title")} onChange={(v) => update("title", v)} required /><Field wide label="EYEBROW LABEL" value={field("label")} onChange={(v) => update("label", v)} required />
          <Field wide area label="DESCRIPTION" value={field("copy")} onChange={(v) => update("copy", v)} required /><Field wide area label="CAPABILITIES — ONE PER LINE" value={field("itemsText")} onChange={(v) => update("itemsText", v)} />
          <Select label="VISUAL MOTIF" value={field("motif")} onChange={(v) => update("motif", v)} options={["rings", "frame", "signal", "orbit"]} />
        </>}
        {active === "blogs" && <>
          <Field wide label="ARTICLE TITLE" value={field("title")} onChange={(v) => update("title", v)} required /><Field label="SLUG" value={field("slug")} onChange={(v) => update("slug", v)} placeholder="generated-from-title" /><Field label="CATEGORY" value={field("category")} onChange={(v) => update("category", v)} required />
          <Field label="DISPLAY DATE" value={field("date")} onChange={(v) => update("date", v)} placeholder="AUG 24, 2026" required /><Field label="READ TIME" value={field("readTime")} onChange={(v) => update("readTime", v)} required />
          <Field wide area label="EXCERPT" value={field("excerpt")} onChange={(v) => update("excerpt", v)} required /><Field wide area label="INTRODUCTION" value={field("intro")} onChange={(v) => update("intro", v)} required />
          <Field wide area tall label="ARTICLE CONTENT" value={field("articleBody")} onChange={(v) => update("articleBody", v)} required hint="Use ## before section headings and - before bullet points. Put each paragraph on a new line." />
          <Field label="ACCENT COLOR" type="color" value={field("accent")} onChange={(v) => update("accent", v)} /><Field label="SORT ORDER" type="number" value={field("sortOrder")} onChange={(v) => update("sortOrder", v)} />
        </>}
        <label className={`${styles.check} ${styles.wide}`}><input type="checkbox" checked={Boolean(draft.published)} onChange={(event) => update("published", event.target.checked)} /> Publish this content on the website</label>
      </div>{error && <p className={styles.error}>{error}</p>}<div className={styles.formActions}><button type="button" className={styles.ghostButton} onClick={() => setDraft(null)}>CANCEL</button><button className={styles.primaryButton} disabled={saving}>{saving ? "SAVING…" : editingId ? "SAVE CHANGES" : "CREATE CONTENT"}</button></div></form>
    </section></div>}
  </div>;
}

function Field({ label, value, onChange, area, tall, wide, hint, ...props }: { label: string; value: string; onChange: (value: string) => void; area?: boolean; tall?: boolean; wide?: boolean; hint?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <div className={`${styles.field} ${wide ? styles.wide : ""}`}><label>{label}</label>{area ? <textarea style={tall ? { minHeight: 260 } : undefined} value={value} onChange={(event) => onChange(event.target.value)} required={props.required} placeholder={props.placeholder} /> : <input {...props} value={value} onChange={(event) => onChange(event.target.value)} />}{hint && <small>{hint}</small>}</div>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className={styles.field}><label>{label}</label><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option.toUpperCase()}</option>)}</select></div>;
}
