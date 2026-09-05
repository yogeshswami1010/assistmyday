"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { BlogArticle, ContentKind, PortfolioProject, ServiceItem } from "../../lib/content-types";
import styles from "./Admin.module.css";

type ManagedItem = PortfolioProject | ServiceItem | BlogArticle;
type Records = Record<ContentKind, ManagedItem[]>;

const labels: Record<ContentKind, string> = { portfolio: "Portfolio", services: "Services", blogs: "Blog" };

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function articleToHtml(article: BlogArticle) {
  if (article.contentHtml) return article.contentHtml;
  return article.sections.map((section) => {
    const paragraphs = section.paragraphs.map((paragraph) => "<p>" + escapeHtml(paragraph) + "</p>").join("");
    const bullets = section.bullets?.length
      ? "<ul>" + section.bullets.map((bullet) => "<li>" + escapeHtml(bullet) + "</li>").join("") + "</ul>"
      : "";
    return "<h2>" + escapeHtml(section.heading) + "</h2>" + paragraphs + bullets;
  }).join("");
}

function currentDisplayDate() {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .format(new Date()).toUpperCase();
}

function newDraft(kind: ContentKind): Record<string, unknown> {
  if (kind === "portfolio") return { title: "", slug: "", category: "", image: "", projectUrl: "/contact", description: "", size: "large", side: "left", sortOrder: 0, published: true };
  if (kind === "services") return { number: "", title: "", label: "", copy: "", itemsText: "", motif: "rings", sortOrder: 0, published: true };
  return { title: "", slug: "", category: "INSIGHTS", image: "", date: currentDisplayDate(), accent: "#5bb8e8", contentHtml: "<p></p>", sortOrder: 0, published: true };
}

function toDraft(kind: ContentKind, item: ManagedItem) {
  if (kind === "services") return { ...item, itemsText: (item as ServiceItem).items.join("\n") };
  if (kind === "blogs") return { ...item, contentHtml: articleToHtml(item as BlogArticle) };
  return { ...item };
}

export default function AdminPanel({ email, databaseReady, databaseMessage, initialRecords }: { email: string; databaseReady: boolean; databaseMessage: string; initialRecords: Records }) {
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
    if (active === "blogs" && !field("image")) { setError("Select a featured image before saving."); return; }
    setSaving(true); setError("");
    const payload = { ...draft } as Record<string, unknown>;
    if (active === "services") payload.items = field("itemsText").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
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
    <header className={styles.topbar}><Image className={styles.logo} src="/assistmyday-logo-white.png" alt="Assistmyday" width={2424} height={462} priority /><div className={styles.account}><span>{email}</span><a className={styles.ghostButton} href="/" target="_blank">VIEW SITE ↗</a><button className={styles.ghostButton} onClick={logout}>SIGN OUT</button></div></header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}><small>CONTENT</small>{(["portfolio", "services", "blogs"] as ContentKind[]).map((kind, index) => <button key={kind} onClick={() => changeSection(kind)} className={`${styles.navButton} ${active === kind ? styles.navActive : ""}`}><span>{labels[kind]}</span><b>0{index + 1}</b></button>)}<a href="/admin/contacts" className={styles.navButton}><span>Contacts</span><b>04</b></a></aside>
      <main className={styles.main}>
        <header className={styles.heading}><div><p>ASSISTMYDAY / ADMIN</p><h1>Manage <em>{labels[active].toLowerCase()}.</em></h1></div><button className={styles.primaryButton} onClick={openNew} disabled={!databaseReady}>＋ ADD NEW</button></header>
        {!databaseReady && <div className={styles.notice}><strong>MySQL is not connected.</strong><br />{databaseMessage}</div>}
        <section className={styles.stats}><div className={styles.stat}><small>TOTAL RECORDS</small><strong>{activeItems.length}</strong></div><div className={styles.stat}><small>PUBLISHED</small><strong>{publishedCount}</strong></div><div className={styles.stat}><small>DRAFTS</small><strong>{activeItems.length - publishedCount}</strong></div></section>
        <section className={styles.list}>{activeItems.length ? activeItems.map((item) => {
          const image = active === "portfolio" ? (item as PortfolioProject).image : active === "blogs" ? (item as BlogArticle).image || "" : "";
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
          <Field wide label="ARTICLE TITLE" value={field("title")} onChange={(v) => update("title", v)} placeholder="Enter the blog title" required />
          <ImageUploadField value={field("image")} onChange={(value) => update("image", value)} />
          <Field label="PUBLISH DATE" value={field("date")} onChange={(v) => update("date", v)} readOnly hint="Automatically set to today for new posts." />
          <Field label="CATEGORY" value={field("category")} onChange={(v) => update("category", v)} placeholder="INSIGHTS" />
          <div className={[styles.field, styles.wide].join(" ")}>
            <label>DESCRIPTION</label>
            <RichTextEditor value={field("contentHtml")} onChange={(value) => update("contentHtml", value)} />
            <small>Format the article with headings, bold, italic, lists, quotes, links, or switch to HTML mode.</small>
          </div>
        </>}
        <label className={`${styles.check} ${styles.wide}`}><input type="checkbox" checked={Boolean(draft.published)} onChange={(event) => update("published", event.target.checked)} /> Publish this content on the website</label>
      </div>{error && <p className={styles.error}>{error}</p>}<div className={styles.formActions}><button type="button" className={styles.ghostButton} onClick={() => setDraft(null)}>CANCEL</button><button className={styles.primaryButton} disabled={saving}>{saving ? "SAVING…" : editingId ? "SAVE CHANGES" : "CREATE CONTENT"}</button></div></form>
    </section></div>}
  </div>;
}

function ImageUploadField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const body = new FormData();
    body.append("image", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json().catch(() => ({})) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to upload image.");
      onChange(data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <div className={[styles.field, styles.wide].join(" ")}>
    <label>FEATURED IMAGE</label>
    <div className={styles.imagePicker}>
      <div className={styles.imagePreview}>
        {value ? <Image src={value} alt="Selected featured image" fill sizes="600px" unoptimized /> : <span>NO IMAGE SELECTED</span>}
      </div>
      <div className={styles.imagePickerActions}>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => upload(event.target.files?.[0])} hidden />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>{uploading ? "UPLOADING…" : value ? "REPLACE IMAGE" : "SELECT IMAGE"}</button>
        <small>JPEG, PNG, WebP, or GIF. Maximum file size: 5 MB.</small>
      </div>
    </div>
    {uploadError && <small className={styles.uploadError}>{uploadError}</small>}
  </div>;
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [sourceMode, setSourceMode] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!sourceMode && editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [sourceMode, value]);

  const sync = () => onChange(editorRef.current?.innerHTML || "");

  function run(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    sync();
  }

  function addLink() {
    const url = window.prompt("Paste the link URL:");
    if (url) run("createLink", url);
  }

  const keepSelection = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  return <div className={styles.richText}>
    <div className={styles.richToolbar} role="toolbar" aria-label="Description formatting">
      <select aria-label="Text style" defaultValue="p" disabled={sourceMode} onChange={(event) => run("formatBlock", event.target.value)}>
        <option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option>
      </select>
      <button type="button" title="Bold" aria-label="Bold" disabled={sourceMode} onMouseDown={keepSelection} onClick={() => run("bold")}><strong>B</strong></button>
      <button type="button" title="Italic" aria-label="Italic" disabled={sourceMode} onMouseDown={keepSelection} onClick={() => run("italic")}><em>I</em></button>
      <button type="button" title="Bulleted list" aria-label="Bulleted list" disabled={sourceMode} onMouseDown={keepSelection} onClick={() => run("insertUnorderedList")}>• List</button>
      <button type="button" title="Numbered list" aria-label="Numbered list" disabled={sourceMode} onMouseDown={keepSelection} onClick={() => run("insertOrderedList")}>1. List</button>
      <button type="button" title="Add link" aria-label="Add link" disabled={sourceMode} onMouseDown={keepSelection} onClick={addLink}>Link</button>
      <button type="button" title="Clear formatting" aria-label="Clear formatting" disabled={sourceMode} onMouseDown={keepSelection} onClick={() => run("removeFormat")}>Clear</button>
      <button type="button" className={sourceMode ? styles.toolbarActive : ""} title="Edit HTML" aria-label="Edit HTML" onClick={() => setSourceMode((current) => !current)}>HTML</button>
    </div>
    {sourceMode
      ? <textarea className={styles.htmlSource} value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} />
      : <div ref={editorRef} className={styles.richEditor} contentEditable suppressContentEditableWarning onInput={sync} data-placeholder="Write your article description..." />}
  </div>;
}

function Field({ label, value, onChange, area, tall, wide, hint, ...props }: { label: string; value: string; onChange: (value: string) => void; area?: boolean; tall?: boolean; wide?: boolean; hint?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return <div className={`${styles.field} ${wide ? styles.wide : ""}`}><label>{label}</label>{area ? <textarea style={tall ? { minHeight: 260 } : undefined} value={value} onChange={(event) => onChange(event.target.value)} required={props.required} placeholder={props.placeholder} /> : <input {...props} value={value} onChange={(event) => onChange(event.target.value)} />}{hint && <small>{hint}</small>}</div>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className={styles.field}><label>{label}</label><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option.toUpperCase()}</option>)}</select></div>;
}
