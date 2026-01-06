import { useEffect, useMemo, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

export default function EditorPage({ me }) {
  const [markdown, setMarkdown] = useState('# Hello\n\nWrite your content here.');
  const [template, setTemplate] = useState('resume');
  const [theme, setTheme] = useState('classic');
  const [title, setTitle] = useState('document');
  const [branding, setBranding] = useState({ accentColor: '#2563eb', fontFamily: '', logoUrl: '', subtitle: '' });
  const [previewHtml, setPreviewHtml] = useState('<div/>');
  const iframeRef = useRef(null);

  const liveHtml = useMemo(() => md.render(markdown), [markdown]);

  useEffect(() => {
    const run = async () => {
      const r = await fetch(`${window.__ENV.API_BASE_URL}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ markdown, template, theme, branding })
      });
      const d = await r.json();
      setPreviewHtml(d.html || '<div/>');
    };
    run();
  }, [markdown, template, theme, branding]);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    const doc = el.contentDocument || el.contentWindow.document;
    doc.open();
    doc.write(previewHtml);
    doc.close();
  }, [previewHtml]);

  const downloadPdf = async () => {
    const r = await fetch(`${window.__ENV.API_BASE_URL}/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ markdown, template, theme, branding, title })
    });
    if (!r.ok) return;
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'document'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveHistory = async () => {
    const r = await fetch(`${window.__ENV.API_BASE_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ markdown, template, theme, branding, title })
    });
    if (r.ok) alert('Saved');
    else alert('Login required');
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="title">Editor</div>
        <div className="toolbar">
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <select className="input" value={template} onChange={e => setTemplate(e.target.value)}>
            <option value="resume">Resume</option>
            <option value="invoice">Invoice</option>
          </select>
          <select className="input" value={theme} onChange={e => setTheme(e.target.value)}>
            {template === 'resume' ? (
              <>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
              </>
            ) : (
              <option value="default">Default</option>
            )}
          </select>
          <input className="input" type="color" value={branding.accentColor} onChange={e => setBranding({ ...branding, accentColor: e.target.value })} />
          <input className="input" value={branding.fontFamily} onChange={e => setBranding({ ...branding, fontFamily: e.target.value })} placeholder="Font family" />
          <input className="input" value={branding.logoUrl} onChange={e => setBranding({ ...branding, logoUrl: e.target.value })} placeholder="Logo URL" />
          <input className="input" value={branding.subtitle} onChange={e => setBranding({ ...branding, subtitle: e.target.value })} placeholder="Subtitle" />
          <button className="btn" onClick={downloadPdf}>Download PDF</button>
          {me && <button className="btn" onClick={saveHistory}>Save</button>}
        </div>
        <div className="body">
          <textarea className="editor" value={markdown} onChange={e => setMarkdown(e.target.value)} />
          <div style={{ padding: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Live Markdown Preview</div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8 }} dangerouslySetInnerHTML={{ __html: liveHtml }} />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="title">PDF Preview</div>
        <div className="body">
          <iframe ref={iframeRef} className="preview" title="PDF preview"></iframe>
        </div>
      </div>
    </div>
  );
}
