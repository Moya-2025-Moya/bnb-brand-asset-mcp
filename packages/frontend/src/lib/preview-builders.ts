// Pure functions extracted from preview-panel.tsx for reuse across components.

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

// Official BNB Chain brand colors from MCP data (brand-colors.ts)
export const BNB_TAILWIND_CONFIG = `
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'Fira Code', 'monospace'] },
      colors: {
        'bnb-yellow': '#F0B90B',
        'bnb-yellow-hover': '#D4A20A',
        'bnb-light': '#FCD535',
        'bnb-dark': '#181A20',
        'bnb-gray': '#2B3139',
        'bnb-card': '#1E2329',
        'bnb-text': '#EAECEF',
        'bnb-text-secondary': '#B7BDC6',
        'bnb-muted': '#848E9C',
        'bnb-success': '#0ECB81',
        'bnb-error': '#F6465D',
        'bnb-info': '#1E88E5',
        'bnb-border': '#2B3139',
        'bnb-border-secondary': '#363C46',
      },
      borderRadius: { xl: '12px', '2xl': '16px' },
    }
  }
}`;

// All colors below are from official BNB brand-colors.ts (dark theme)
export const IFRAME_BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; scroll-behavior: smooth; overflow-y: auto; }
  body {
    font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
    background: #181A20;
    color: #EAECEF;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: rgba(240,185,11,0.3); color: #fff; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2B3139; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #363C46; }

  @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fade-up { animation: fadeInUp 0.5s ease-out both; }
  .fade-up-1 { animation: fadeInUp 0.5s 0.1s ease-out both; }
  .fade-up-2 { animation: fadeInUp 0.5s 0.2s ease-out both; }
  .fade-up-3 { animation: fadeInUp 0.5s 0.3s ease-out both; }
  .fade-up-4 { animation: fadeInUp 0.5s 0.4s ease-out both; }
  .fade-in { animation: fadeIn 0.4s ease-out both; }

  .glow-card {
    background: #1E2329;
    border: 1px solid #2B3139;
    border-radius: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .glow-card:hover {
    border-color: rgba(240,185,11,0.3);
    box-shadow: 0 0 30px rgba(240,185,11,0.06);
  }
  .gradient-border {
    background: linear-gradient(135deg, rgba(240,185,11,0.15), rgba(252,213,53,0.05));
    border: 1px solid rgba(240,185,11,0.2);
    border-radius: 16px;
  }
  .stat-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
  }
  .tag { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; }
`;

export function getFileExtension(path: string): string {
  return path.split(".").pop()?.toLowerCase() || "";
}

export function buildHtmlPreview(content: string): string {
  if (content.includes("<html") || content.includes("<!DOCTYPE")) {
    return content.replace(
      "</head>",
      `<script src="https://cdn.tailwindcss.com"></script>
      <script>${BNB_TAILWIND_CONFIG}</script>
      </head>`
    );
  }

  return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${BNB_TAILWIND_CONFIG}</script>
  <style>${IFRAME_BASE_STYLES}</style>
</head>
<body>
  ${content}
</body>
</html>`;
}

export function buildSolidityPreview(content: string, filename: string): string {
  const contractName =
    content.match(/contract\s+(\w+)/)?.[1] || filename.replace(".sol", "");
  const inherits = content.match(/contract\s+\w+\s+is\s+([^{]+)/)?.[1]?.trim() || "";
  const functions = [
    ...content.matchAll(/function\s+(\w+)\s*\(([^)]*)\)([^{]*)/g),
  ].map((m) => ({
    name: m[1],
    params: m[2],
    modifiers: m[3].trim().replace(/\s+/g, " "),
  }));
  const events = [...content.matchAll(/event\s+(\w+)\s*\(([^)]*)\)/g)].map(
    (m) => ({ name: m[1], params: m[2] })
  );
  const stateVars = [
    ...content.matchAll(
      /^\s+(uint\w*|int\w*|address|bool|string|bytes\w*|mapping[^;]+)\s+(public\s+|private\s+|internal\s+)?(\w+)/gm
    ),
  ].map((m) => ({ type: m[1], visibility: (m[2] || "").trim(), name: m[3] }));
  const pragmaMatch = content.match(/pragma\s+solidity\s+([^;]+)/);
  const lineCount = content.split("\n").length;

  const publicFns = functions.filter((f) => !f.modifiers.includes("internal") && !f.modifiers.includes("private"));
  const viewFns = functions.filter((f) => f.modifiers.includes("view") || f.modifiers.includes("pure"));

  return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${BNB_TAILWIND_CONFIG}</script>
  <style>${IFRAME_BASE_STYLES}
  body { display: flex; align-items: flex-start; justify-content: center; padding: 32px 24px; }
  </style>
</head>
<body>
  <div class="w-full max-w-xl space-y-4">
    <!-- Header card -->
    <div class="gradient-border p-6 fade-up">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style="background: linear-gradient(135deg, rgba(240,185,11,0.2), rgba(24,220,126,0.1));">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#F0B90B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-bnb-text">${contractName}</h1>
            <div class="flex items-center gap-2 mt-0.5">
              ${pragmaMatch ? `<span class="tag bg-bnb-yellow/10 text-bnb-yellow">Solidity ${pragmaMatch[1].trim()}</span>` : ""}
              ${inherits ? `<span class="tag bg-purple-500/10 text-purple-400">${inherits}</span>` : ""}
            </div>
          </div>
        </div>
      </div>
      <!-- Stats -->
      <div class="flex flex-wrap gap-2">
        <span class="stat-chip bg-bnb-success/10 text-bnb-success">${functions.length} functions</span>
        <span class="stat-chip bg-purple-500/10 text-purple-400">${events.length} events</span>
        <span class="stat-chip bg-blue-500/10 text-blue-400">${stateVars.length} state vars</span>
        <span class="stat-chip bg-bnb-muted/10 text-bnb-muted">${lineCount} lines</span>
      </div>
    </div>

    ${publicFns.length > 0 ? `
    <!-- Functions -->
    <div class="glow-card p-5 fade-up-1">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 17l6-6-6-6M12 19h8" stroke="#0ECB81" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Public Functions
      </h3>
      <div class="space-y-2">
        ${publicFns.map((f) => `
          <div class="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-bnb-success"></span>
              <span class="text-sm font-medium text-bnb-text font-mono">${f.name}</span>
              <span class="text-xs text-bnb-muted font-mono">(${f.params || ""})</span>
            </div>
            ${f.modifiers.includes("view") ? '<span class="tag bg-blue-500/10 text-blue-400">view</span>' :
              f.modifiers.includes("payable") ? '<span class="tag bg-bnb-yellow/10 text-bnb-yellow">payable</span>' : ""}
          </div>`).join("")}
      </div>
    </div>` : ""}

    ${viewFns.length > 0 && publicFns.length === 0 ? `
    <div class="glow-card p-5 fade-up-1">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3">View Functions</h3>
      <div class="space-y-2">
        ${viewFns.map((f) => `
          <div class="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span class="text-sm font-mono text-bnb-text">${f.name}</span>
          </div>`).join("")}
      </div>
    </div>` : ""}

    ${events.length > 0 ? `
    <!-- Events -->
    <div class="glow-card p-5 fade-up-2">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Events
      </h3>
      <div class="flex flex-wrap gap-2">
        ${events.map((e) => `<span class="stat-chip bg-purple-500/10 text-purple-400 font-mono text-xs">${e.name}</span>`).join("")}
      </div>
    </div>` : ""}

    ${stateVars.length > 0 ? `
    <!-- State -->
    <div class="glow-card p-5 fade-up-3">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#60a5fa" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/></svg>
        State Variables
      </h3>
      <div class="space-y-2">
        ${stateVars.map((v) => `
          <div class="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
            <span class="text-sm font-mono text-bnb-text">${v.name}</span>
            <div class="flex gap-1.5">
              <span class="tag bg-blue-500/10 text-blue-400 font-mono">${v.type.length > 20 ? v.type.slice(0, 20) + "…" : v.type}</span>
              ${v.visibility ? `<span class="tag bg-white/5 text-bnb-muted">${v.visibility}</span>` : ""}
            </div>
          </div>`).join("")}
      </div>
    </div>` : ""}
  </div>
</body>
</html>`;
}

export function buildMarkdownPreview(content: string): string {
  let html = content
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre class="bg-[#1E2329] rounded-xl p-4 my-5 overflow-x-auto text-sm font-mono border border-bnb-border fade-in"><code class="text-bnb-muted">$2</code></pre>'
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-bnb-yellow/10 text-bnb-yellow px-1.5 py-0.5 rounded-md text-sm font-mono">$1</code>'
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-semibold text-bnb-text mt-8 mb-3 fade-up">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-bold text-bnb-text mt-10 mb-4 fade-up">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-3xl font-bold mt-8 mb-5 fade-up" style="background:linear-gradient(135deg,#F0B90B,#FCD535);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">$1</h1>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-bnb-text font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-bnb-yellow hover:text-bnb-light underline underline-offset-2 transition-colors">$1</a>'
    )
    .replace(
      /^>\s*(.+)$/gm,
      '<blockquote class="border-l-2 border-bnb-yellow/40 pl-4 py-1 my-4 text-bnb-muted italic">$1</blockquote>'
    )
    .replace(
      /^- (.+)$/gm,
      '<li class="ml-5 list-disc text-bnb-text/80 leading-relaxed">$1</li>'
    )
    .replace(
      /^\d+\. (.+)$/gm,
      '<li class="ml-5 list-decimal text-bnb-text/80 leading-relaxed">$1</li>'
    )
    .replace(
      /^---$/gm,
      '<hr class="my-8 border-0 h-px" style="background:linear-gradient(90deg,transparent,#2B3139,transparent);">'
    )
    .replace(
      /^(?!<[hblpua\d]|<li|<pre|<code|<hr)(.+)$/gm,
      '<p class="my-3 text-bnb-text/80 leading-relaxed">$1</p>'
    );

  return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${BNB_TAILWIND_CONFIG}</script>
  <style>${IFRAME_BASE_STYLES}
  body { padding: 32px 24px; }
  </style>
</head>
<body>
  <div class="max-w-2xl mx-auto">${html}</div>
</body>
</html>`;
}

export function buildJsonPreview(content: string, filename: string): string {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return "";
  }

  const isPackageJson = filename.endsWith("package.json");

  if (isPackageJson) {
    const name = (parsed.name as string) || "package";
    const version = (parsed.version as string) || "";
    const description = (parsed.description as string) || "";
    const deps = parsed.dependencies as Record<string, string> | undefined;
    const devDeps = parsed.devDependencies as Record<string, string> | undefined;
    const scripts = parsed.scripts as Record<string, string> | undefined;
    const totalDeps = Object.keys(deps || {}).length + Object.keys(devDeps || {}).length;

    return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${BNB_TAILWIND_CONFIG}</script>
  <style>${IFRAME_BASE_STYLES}
  body { display: flex; align-items: flex-start; justify-content: center; padding: 32px 24px; }
  </style>
</head>
<body>
  <div class="w-full max-w-xl space-y-4">
    <!-- Header -->
    <div class="gradient-border p-6 fade-up">
      <div class="flex items-center gap-4 mb-3">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, rgba(240,185,11,0.15), rgba(24,220,126,0.08));">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#F0B90B" stroke-width="1.5"/></svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-bnb-text">${name}</h1>
          <div class="flex items-center gap-2 mt-1">
            ${version ? `<span class="tag bg-bnb-yellow/10 text-bnb-yellow">v${version}</span>` : ""}
            <span class="tag bg-bnb-success/10 text-bnb-success">${totalDeps} deps</span>
            <span class="tag bg-blue-500/10 text-blue-400">${Object.keys(scripts || {}).length} scripts</span>
          </div>
        </div>
      </div>
      ${description ? `<p class="text-sm text-bnb-muted leading-relaxed">${description}</p>` : ""}
    </div>

    ${scripts ? `
    <!-- Scripts -->
    <div class="glow-card p-5 fade-up-1">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 17l6-6-6-6M12 19h8" stroke="#F0B90B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Scripts
      </h3>
      <div class="space-y-1.5">
        ${Object.entries(scripts).map(([k, v]) => `
          <div class="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#1E2329] font-mono text-xs">
            <span class="text-bnb-yellow font-semibold">$ ${k}</span>
            <span class="text-bnb-muted truncate">${v}</span>
          </div>`).join("")}
      </div>
    </div>` : ""}

    ${deps ? `
    <!-- Dependencies -->
    <div class="glow-card p-5 fade-up-2">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3">Dependencies</h3>
      <div class="flex flex-wrap gap-1.5">
        ${Object.entries(deps).map(([k, v]) => `
          <span class="stat-chip bg-bnb-success/8 text-bnb-success font-mono text-[11px] border border-bnb-success/10">${k} <span class="text-bnb-muted">${v}</span></span>
        `).join("")}
      </div>
    </div>` : ""}

    ${devDeps ? `
    <!-- Dev Dependencies -->
    <div class="glow-card p-5 fade-up-3">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3">Dev Dependencies</h3>
      <div class="flex flex-wrap gap-1.5">
        ${Object.entries(devDeps).map(([k, v]) => `
          <span class="stat-chip bg-blue-500/8 text-blue-400 font-mono text-[11px] border border-blue-500/10">${k} <span class="text-bnb-muted">${v}</span></span>
        `).join("")}
      </div>
    </div>` : ""}
  </div>
</body>
</html>`;
  }

  // Generic JSON
  const renderValue = (val: unknown, depth: number): string => {
    if (val === null) return '<span class="text-bnb-muted/50">null</span>';
    if (typeof val === "boolean") return `<span class="text-bnb-yellow">${val}</span>`;
    if (typeof val === "number") return `<span class="text-bnb-success">${val}</span>`;
    if (typeof val === "string") return `<span class="text-blue-400">"${val.length > 60 ? val.slice(0, 60) + "…" : val}"</span>`;
    if (Array.isArray(val)) {
      if (val.length === 0) return '<span class="text-bnb-muted">[]</span>';
      return `<div class="ml-4 pl-3 border-l border-bnb-border">${val.map((v, i) => `<div class="py-0.5"><span class="text-bnb-muted text-[10px]">${i}</span> ${renderValue(v, depth + 1)}</div>`).join("")}</div>`;
    }
    if (typeof val === "object") {
      const entries = Object.entries(val as Record<string, unknown>);
      if (depth > 3) return '<span class="text-bnb-muted">{…}</span>';
      return `<div class="ml-4 pl-3 border-l border-bnb-border">${entries.map(([k, v]) => `<div class="py-0.5"><span class="text-bnb-yellow">${k}</span><span class="text-bnb-muted">: </span>${renderValue(v, depth + 1)}</div>`).join("")}</div>`;
    }
    return String(val);
  };

  return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${BNB_TAILWIND_CONFIG}</script>
  <style>${IFRAME_BASE_STYLES}
  body { display: flex; align-items: flex-start; justify-content: center; padding: 32px 24px; }
  </style>
</head>
<body>
  <div class="w-full max-w-2xl glow-card p-6 text-sm font-mono fade-up">
    ${renderValue(parsed, 0)}
  </div>
</body>
</html>`;
}

export function buildCssPreview(content: string, filename: string): string {
  const customProps = [...content.matchAll(/--([a-zA-Z-]+)\s*:\s*([^;]+)/g)]
    .map((m) => ({ name: m[1], value: m[2].trim() }));
  const colorProps = customProps.filter((p) =>
    p.value.startsWith("#") || p.value.startsWith("rgb") || p.value.startsWith("hsl") || p.value.startsWith("oklch")
  );
  const classes = [...content.matchAll(/\.([a-zA-Z_-][\w-]*)\s*\{/g)]
    .map((m) => m[1])
    .filter((c, i, arr) => arr.indexOf(c) === i);

  return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${BNB_TAILWIND_CONFIG}</script>
  <style>${IFRAME_BASE_STYLES}
  body { display: flex; align-items: flex-start; justify-content: center; padding: 32px 24px; }
  </style>
</head>
<body>
  <div class="w-full max-w-xl space-y-4">
    <div class="gradient-border p-6 fade-up">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.15));">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h7" stroke="#ec4899" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div>
          <h1 class="text-lg font-bold text-bnb-text">${filename.split("/").pop()}</h1>
          <div class="flex gap-2 mt-0.5">
            ${colorProps.length > 0 ? `<span class="tag bg-pink-500/10 text-pink-400">${colorProps.length} colors</span>` : ""}
            <span class="tag bg-purple-500/10 text-purple-400">${classes.length} classes</span>
          </div>
        </div>
      </div>
    </div>

    ${colorProps.length > 0 ? `
    <div class="glow-card p-5 fade-up-1">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3">Color Variables</h3>
      <div class="grid grid-cols-2 gap-2">
        ${colorProps.slice(0, 12).map((p) => `
          <div class="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[#1E2329]">
            <div class="w-5 h-5 rounded-md border border-white/10 shrink-0" style="background:${p.value}"></div>
            <span class="text-xs font-mono text-bnb-muted truncate">--${p.name}</span>
          </div>`).join("")}
      </div>
    </div>` : ""}

    ${classes.length > 0 ? `
    <div class="glow-card p-5 fade-up-2">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-3">Classes</h3>
      <div class="flex flex-wrap gap-1.5">
        ${classes.slice(0, 20).map((c) => `<span class="stat-chip bg-purple-500/8 text-purple-400 font-mono text-[11px] border border-purple-500/10">.${c}</span>`).join("")}
      </div>
    </div>` : ""}
  </div>
</body>
</html>`;
}

export function buildProjectOverview(allFiles: GeneratedFile[]): string {
  const filesByType: Record<string, { count: number; color: string; icon: string; files: string[] }> = {};
  const typeConfig: Record<string, { color: string; icon: string }> = {
    tsx: { color: "#3b82f6", icon: "⚛" },
    ts: { color: "#3b82f6", icon: "TS" },
    sol: { color: "#a78bfa", icon: "◆" },
    css: { color: "#ec4899", icon: "🎨" },
    json: { color: "#f59e0b", icon: "{}" },
    md: { color: "#9ca3af", icon: "📝" },
    html: { color: "#f97316", icon: "🌐" },
    js: { color: "#fbbf24", icon: "JS" },
  };
  allFiles.forEach((f) => {
    const ext = getFileExtension(f.path);
    const cfg = typeConfig[ext] || { color: "#6b7280", icon: "📄" };
    if (!filesByType[ext]) filesByType[ext] = { count: 0, ...cfg, files: [] };
    filesByType[ext].count++;
    filesByType[ext].files.push(f.path.split("/").pop() || f.path);
  });

  const totalLines = allFiles.reduce((sum, f) => sum + f.content.split("\n").length, 0);
  const contractFile = allFiles.find((f) => getFileExtension(f.path) === "sol");
  const contractName = contractFile ? (contractFile.content.match(/contract\s+(\w+)/)?.[1] || "Contract") : null;
  const hasUI = allFiles.some((f) => ["tsx", "jsx", "html"].includes(getFileExtension(f.path)));

  return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${BNB_TAILWIND_CONFIG}</script>
  <style>${IFRAME_BASE_STYLES}
  body { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 32px 24px; }
  @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .scale-in { animation: scaleIn 0.5s ease-out both; }
  .scale-in-1 { animation: scaleIn 0.5s 0.1s ease-out both; }
  .scale-in-2 { animation: scaleIn 0.5s 0.2s ease-out both; }
  </style>
</head>
<body>
  <div class="w-full max-w-lg space-y-5">
    <!-- Hero card -->
    <div class="relative overflow-hidden rounded-2xl p-8 text-center scale-in" style="background: linear-gradient(135deg, #1E2329 0%, #181A20 100%); border: 1px solid #2B3139;">
      <div class="absolute inset-0" style="background: radial-gradient(circle at 30% 20%, rgba(240,185,11,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(24,220,126,0.06) 0%, transparent 50%);"></div>
      <div class="relative z-10">
        <div class="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style="background: linear-gradient(135deg, rgba(240,185,11,0.2), rgba(24,220,126,0.1)); box-shadow: 0 0 40px rgba(240,185,11,0.1);">
          <svg width="36" height="36" viewBox="0 0 126 126" fill="none"><path d="M63 0L15.75 26.25V78.75L63 126l47.25-47.25V26.25L63 0z" fill="#F0B90B"/><path d="M63 36.75L40.95 47.25 63 57.75l22.05-10.5L63 36.75zM31.5 57.75l22.05 10.5v21l-22.05-10.5v-21zm41.45 10.5L95 57.75v21l-22.05 10.5v-21z" fill="#fff"/></svg>
        </div>
        <div class="flex items-center justify-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#0ECB81" stroke-width="2" stroke-linecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="#0ECB81" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="text-sm font-medium text-bnb-success">Generation Complete</span>
        </div>
        <h1 class="text-3xl font-bold text-bnb-text mb-1">${contractName || "BNB Project"}</h1>
        <p class="text-sm text-bnb-muted">${hasUI ? "Smart Contract + UI" : "Smart Contract Project"}</p>
        <div class="flex justify-center gap-3 mt-6">
          <div class="px-4 py-2 rounded-xl" style="background: rgba(240,185,11,0.1);">
            <div class="text-2xl font-bold text-bnb-yellow">${allFiles.length}</div>
            <div class="text-[10px] text-bnb-muted uppercase tracking-wider">Files</div>
          </div>
          <div class="px-4 py-2 rounded-xl" style="background: rgba(24,220,126,0.08);">
            <div class="text-2xl font-bold text-bnb-success">${totalLines.toLocaleString()}</div>
            <div class="text-[10px] text-bnb-muted uppercase tracking-wider">Lines</div>
          </div>
          <div class="px-4 py-2 rounded-xl" style="background: rgba(59,130,246,0.08);">
            <div class="text-2xl font-bold text-blue-400">${Object.keys(filesByType).length}</div>
            <div class="text-[10px] text-bnb-muted uppercase tracking-wider">Types</div>
          </div>
        </div>
      </div>
    </div>

    <!-- File breakdown -->
    <div class="glow-card p-5 scale-in-1">
      <h3 class="text-xs font-semibold text-bnb-muted uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="#F0B90B" stroke-width="1.5" stroke-linecap="round"/></svg>
        Project Files
      </h3>
      <div class="space-y-2">
        ${Object.entries(filesByType)
          .sort((a, b) => b[1].count - a[1].count)
          .map(
            ([ext, info]) => `
            <div class="rounded-xl p-3 transition-colors" style="background: ${info.color}08;">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style="background:${info.color}18; color:${info.color}">${info.icon}</span>
                  <span class="text-sm font-semibold text-bnb-text">.${ext}</span>
                </div>
                <span class="text-xs font-medium px-2.5 py-1 rounded-full" style="background:${info.color}12; color:${info.color}">${info.count} file${info.count > 1 ? "s" : ""}</span>
              </div>
              <div class="flex flex-wrap gap-1 ml-[42px]">
                ${info.files.map((name: string) => `<span class="text-[11px] font-mono px-2 py-0.5 rounded-md text-bnb-muted" style="background: rgba(255,255,255,0.03);">${name}</span>`).join("")}
              </div>
            </div>`
          )
          .join("")}
      </div>
    </div>
  </div>
</body>
</html>`;
}
