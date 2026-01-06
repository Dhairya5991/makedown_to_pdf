import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import puppeteer from 'puppeteer';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
});

function baseStyles({ template, theme, branding }) {
  const accent = branding?.accentColor || '#2563eb';
  const fontFamily = branding?.fontFamily || (template === 'resume' ? 'Inter, sans-serif' : 'Merriweather, serif');
  const logoUrl = branding?.logoUrl || '';
  const googleFonts = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Merriweather:wght@400;700&display=swap');";
  const common = `
    ${googleFonts}
    :root {
      --accent: ${accent};
      --text: #111827;
      --muted: #6b7280;
      --bg: #ffffff;
      --border: #e5e7eb;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${fontFamily};
      color: var(--text);
      background: var(--bg);
    }
    .page {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      padding: 32px;
    }
    h1,h2,h3 { color: var(--text); margin: 0 0 8px; }
    h1 { font-size: 28px; }
    h2 { font-size: 22px; border-bottom: 2px solid var(--border); padding-bottom: 6px; margin-top: 18px; }
    h3 { font-size: 18px; color: var(--muted); }
    p, li { font-size: 14px; line-height: 1.6; }
    a { color: var(--accent); text-decoration: none; }
    ul { padding-left: 18px; }
    .logo { height: 48px; margin-bottom: 16px; }
    .header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .section { margin-top: 16px; }
    .tag { display: inline-block; background: var(--accent); color: white; padding: 2px 8px; border-radius: 9999px; font-size: 12px; }
  `;
  const resumeClassic = `
    .page { border: 1px solid var(--border); }
    .header-title { font-size: 26px; font-weight: 600; }
    .sub { color: var(--muted); }
  `;
  const resumeModern = `
    .page { border-top: 6px solid var(--accent); }
    .header-title { font-size: 28px; font-weight: 700; letter-spacing: 0.2px; }
    .sub { color: var(--muted); }
  `;
  const resumeMinimal = `
    .page { }
    .header-title { font-size: 24px; font-weight: 600; }
    .sub { color: var(--muted); }
  `;
  const invoiceDefault = `
    .page { border: 1px solid var(--border); }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border-bottom: 1px solid var(--border); padding: 8px; text-align: left; font-size: 14px; }
    th { background: #f9fafb; }
    .total { text-align: right; font-size: 16px; margin-top: 8px; }
  `;
  let themeCss = '';
  if (template === 'resume') {
    if (theme === 'modern') themeCss = resumeModern;
    else if (theme === 'minimalist' || theme === 'minimal') themeCss = resumeMinimal;
    else themeCss = resumeClassic;
  } else {
    themeCss = invoiceDefault;
  }
  return common + themeCss + (branding?.extraCss || '');
}

export function renderHtml({ markdown, template = 'resume', theme = 'classic', branding = {} }) {
  const contentHtml = md.render(markdown || '');
  const safeHtml = sanitizeHtml(contentHtml, {
    allowedTags: false,
    allowedAttributes: false
  });
  const styles = baseStyles({ template, theme, branding });
  const logoTag = branding?.logoUrl ? `<img class="logo" src="${branding.logoUrl}" />` : '';
  const headerTitle = branding?.title || (template === 'resume' ? 'Resume' : 'Invoice');
  const body = `
    <div class="page">
      <div class="header">
        ${logoTag}
        <div>
          <div class="header-title">${headerTitle}</div>
          <div class="sub">${branding?.subtitle || ''}</div>
        </div>
      </div>
      <div class="section">${safeHtml}</div>
    </div>
  `;
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>${styles}</style>
      </head>
      <body>${body}</body>
    </html>
  `;
  return html;
}

export async function htmlToPdfBuffer(html, options = {}) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', right: '16mm', bottom: '16mm', left: '16mm' },
      ...options
    });
    return buffer;
  } finally {
    await browser.close();
  }
}
