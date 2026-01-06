import { useEffect, useState } from 'react';

export default function DashboardPage({ me }) {
  const [items, setItems] = useState([]);

  const load = async () => {
    const r = await fetch(`${window.__ENV.API_BASE_URL}/history`, { credentials: 'include' });
    if (r.ok) {
      const d = await r.json();
      setItems(d.items || []);
    }
  };

  useEffect(() => {
    if (me) load();
  }, [me]);

  const del = async (id) => {
    const r = await fetch(`${window.__ENV.API_BASE_URL}/history/${id}`, { method: 'DELETE', credentials: 'include' });
    if (r.ok) load();
  };

  if (!me) return <div>Please login to view history.</div>;

  return (
    <div>
      <div style={{ marginBottom: 8 }}>Saved documents</div>
      <div className="list">
        {items.map(it => (
          <div className="item" key={it.id}>
            <div style={{ fontWeight: 600 }}>{it.title || 'Untitled'}</div>
            <div style={{ color: 'var(--muted)' }}>{new Date(it.created_at).toLocaleString()}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a className="btn" href="#" onClick={async (e) => {
                e.preventDefault();
                const r = await fetch(`${window.__ENV.API_BASE_URL}/pdf`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    markdown: it.markdown,
                    template: it.template,
                    theme: it.theme,
                    branding: JSON.parse(it.branding || '{}'),
                    title: it.title
                  })
                });
                if (r.ok) {
                  const blob = await r.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${it.title || 'document'}.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}>Download</a>
              <button className="btn" onClick={() => del(it.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
