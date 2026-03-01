export interface DesignTemplate {
  type: "token" | "nft" | "landing" | "dashboard";
  name: string;
  description: string;
  html: string;
}

const BNB_LOGO_SVG = `<svg width="32" height="32" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="48" cy="48" r="48" fill="#F0B90B"/><path d="M34.5355 42.4676L48.0002 29.0032L61.4717 42.4747L69.3063 34.6397L48.0002 13.3333L26.7007 34.6328L34.5355 42.4676Z" fill="white"/><path d="M21.1683 40.1646L29.003 47.9993L21.1679 55.8344L13.3333 47.9997L21.1683 40.1646Z" fill="white"/><path d="M34.5355 53.5322L48.0002 66.9962L61.4714 53.5254L69.3105 61.3562L69.3063 61.3602L48.0002 82.6666L26.7004 61.3672L26.6895 61.3564L34.5355 53.5322Z" fill="white"/><path d="M82.6674 48.0007L74.8327 55.8353L66.9981 48.0007L74.8327 40.166L82.6674 48.0007Z" fill="white"/><path d="M55.9466 47.996H55.9502L47.9999 40.0456L40.0457 47.9998L40.0565 48.0109L47.9999 55.9543L55.9539 47.9998L55.9466 47.996Z" fill="white"/></svg>`;

const SHARED_HEAD = `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            bnb: '#F0B90B',
            'bnb-dark': '#1E2329',
            'bnb-hover': '#D4A20A',
          },
          fontFamily: {
            heading: ['Space Grotesk', 'sans-serif'],
            body: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; color: #1E2329; }
    h1, h2, h3, h4, h5 { font-family: 'Space Grotesk', sans-serif; }
    .gradient-bg { background: linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 50%, #F0FFF4 100%); }
    .card { background: white; border: 1px solid #F0F0F0; border-radius: 16px; padding: 32px; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); position: relative; }
    .card:hover { border-color: #F0B90B; box-shadow: 0 8px 32px rgba(240,185,11,0.12), 0 2px 8px rgba(0,0,0,0.04); transform: translateY(-2px); }
    .card-glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(240,185,11,0.12); border-radius: 20px; padding: 32px; transition: all 0.3s; }
    .card-glass:hover { border-color: rgba(240,185,11,0.3); box-shadow: 0 16px 48px rgba(240,185,11,0.1); }
    .btn-primary { background: linear-gradient(135deg, #F0B90B 0%, #FCD535 100%); color: #1E2329; font-weight: 600; padding: 14px 32px; border-radius: 14px; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); border: none; cursor: pointer; font-family: 'Space Grotesk', sans-serif; box-shadow: 0 4px 16px rgba(240,185,11,0.25); position: relative; overflow: hidden; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(240,185,11,0.4); }
    .btn-primary::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent); opacity: 0; transition: opacity 0.3s; }
    .btn-primary:hover::after { opacity: 1; }
    .btn-outline { border: 2px solid rgba(240,185,11,0.3); color: #F0B90B; font-weight: 600; padding: 12px 32px; border-radius: 14px; transition: all 0.3s; background: transparent; cursor: pointer; font-family: 'Space Grotesk', sans-serif; }
    .btn-outline:hover { background: rgba(240,185,11,0.06); border-color: #F0B90B; box-shadow: 0 0 24px rgba(240,185,11,0.1); }
    .section-label { font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #F0B90B; display: inline-flex; align-items: center; gap: 8px; }
    .section-label::before { content: ''; width: 20px; height: 2px; background: linear-gradient(90deg, #F0B90B, transparent); border-radius: 1px; }
    .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 700; color: #1E2329; }
    .stat-label { font-size: 0.875rem; color: #707A8A; margin-top: 4px; }
    .yellow-dot { width: 8px; height: 8px; border-radius: 50%; background: #F0B90B; display: inline-block; box-shadow: 0 0 8px rgba(240,185,11,0.4); }
    .hero-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(120px); opacity: 0.08; pointer-events: none; }
    .feature-icon { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #FFF9E6, #FFFDF5); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(240,185,11,0.08); }
    .gradient-text { background: linear-gradient(135deg, #1E2329 30%, #F0B90B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .dot-pattern { background-image: radial-gradient(circle, #F0B90B 0.5px, transparent 0.5px); background-size: 24px 24px; opacity: 0.04; position: absolute; inset: 0; pointer-events: none; }
    .shimmer { position: relative; overflow: hidden; }
    .shimmer::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(240,185,11,0.06), transparent); animation: shimmer 3s infinite; }
    @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(240,185,11,0.15); } 50% { box-shadow: 0 0 40px rgba(240,185,11,0.25); } }
    .animate-in { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale { animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .delay-1 { animation-delay: 0.1s; opacity: 0; }
    .delay-2 { animation-delay: 0.2s; opacity: 0; }
    .delay-3 { animation-delay: 0.3s; opacity: 0; }
    .delay-4 { animation-delay: 0.4s; opacity: 0; }
    .delay-5 { animation-delay: 0.5s; opacity: 0; }
  </style>`;

const SHARED_NAV = `<nav style="position:fixed;top:0;width:100%;background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(240,185,11,0.08);z-index:50;">
    <div style="max-width:1120px;margin:0 auto;padding:0 24px;height:68px;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        ${BNB_LOGO_SVG}
        <span class="font-heading" style="font-weight:700;font-size:1.125rem;color:#1E2329;">{{PROJECT_NAME}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:28px;font-size:0.875rem;color:#707A8A;">
        <a href="#features" style="color:#707A8A;text-decoration:none;transition:color 0.2s;font-weight:500;" onmouseover="this.style.color='#F0B90B'" onmouseout="this.style.color='#707A8A'">Features</a>
        <a href="#about" style="color:#707A8A;text-decoration:none;transition:color 0.2s;font-weight:500;" onmouseover="this.style.color='#F0B90B'" onmouseout="this.style.color='#707A8A'">About</a>
        <button class="btn-primary" style="padding:10px 24px;font-size:0.875rem;">Get Started</button>
      </div>
    </div>
  </nav>`;

const SHARED_FOOTER = `<footer style="background:#1E2329;color:#EAECEF;padding:56px 24px 40px;position:relative;overflow:hidden;">
    <div class="dot-pattern" style="opacity:0.03;"></div>
    <div style="max-width:1120px;margin:0 auto;position:relative;z-index:1;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="display:flex;align-items:center;gap:12px;">
          ${BNB_LOGO_SVG}
          <span class="font-heading" style="font-weight:600;">{{PROJECT_NAME}}</span>
        </div>
        <div style="display:flex;gap:20px;">
          <a href="#" style="color:#707A8A;text-decoration:none;font-size:0.875rem;transition:color 0.2s;" onmouseover="this.style.color='#F0B90B'" onmouseout="this.style.color='#707A8A'">Docs</a>
          <a href="#" style="color:#707A8A;text-decoration:none;font-size:0.875rem;transition:color 0.2s;" onmouseover="this.style.color='#F0B90B'" onmouseout="this.style.color='#707A8A'">GitHub</a>
          <a href="#" style="color:#707A8A;text-decoration:none;font-size:0.875rem;transition:color 0.2s;" onmouseover="this.style.color='#F0B90B'" onmouseout="this.style.color='#707A8A'">Community</a>
        </div>
      </div>
      <div style="margin-top:24px;font-size:0.8rem;color:#5E6673;display:flex;justify-content:space-between;align-items:center;">
        <span>Built on <span style="color:#F0B90B;font-weight:600;">BNB Chain</span> &mdash; Powered by BNB Dev Suite</span>
        <span>&copy; 2025 {{PROJECT_NAME}}</span>
      </div>
    </div>
  </footer>`;

// ─── Template 1: Token Showcase ───────────────────────────────

const TOKEN_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{TOKEN_NAME}} ({{TOKEN_SYMBOL}}) — BNB Chain Token</title>
  ${SHARED_HEAD}
</head>
<body style="margin:0;background:#FAFAFA;">
  ${SHARED_NAV.replace(/\{\{PROJECT_NAME\}\}/g, '{{TOKEN_NAME}}')}

  <!-- Hero -->
  <section class="gradient-bg" style="padding:140px 24px 100px;text-align:center;position:relative;overflow:hidden;">
    <div class="dot-pattern"></div>
    <div class="hero-glow" style="top:-200px;left:50%;transform:translateX(-50%);background:#F0B90B;"></div>
    <div style="max-width:720px;margin:0 auto;position:relative;z-index:1;" class="animate-in">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);border:1px solid rgba(240,185,11,0.15);border-radius:100px;padding:8px 20px;margin-bottom:28px;box-shadow:0 2px 12px rgba(240,185,11,0.06);">
        <span class="yellow-dot"></span>
        <span style="font-size:0.875rem;color:#707A8A;font-weight:500;">Live on BNB Smart Chain</span>
      </div>
      <h1 class="font-heading" style="font-size:3.75rem;font-weight:700;line-height:1.08;margin:0 0 20px;">
        <span class="gradient-text">{{TOKEN_NAME}}</span>
        <span style="color:#F0B90B;">{{TOKEN_SYMBOL}}</span>
      </h1>
      <p style="font-size:1.25rem;color:#707A8A;margin:0 0 44px;line-height:1.7;max-width:560px;margin-left:auto;margin-right:auto;">
        {{TOKEN_DESCRIPTION}}
      </p>
      <div style="display:flex;gap:16px;justify-content:center;">
        <button class="btn-primary" style="font-size:1rem;">Buy {{TOKEN_SYMBOL}}</button>
        <button class="btn-outline">View Contract</button>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section style="padding:0 24px;margin-top:-48px;position:relative;z-index:10;">
    <div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;" class="animate-in delay-1">
      <div class="card-glass shimmer" style="text-align:center;padding:28px 24px;">
        <div class="stat-value" style="font-size:1.75rem;">{{TOTAL_SUPPLY}}</div>
        <div class="stat-label">Total Supply</div>
      </div>
      <div class="card-glass shimmer" style="text-align:center;padding:28px 24px;">
        <div class="stat-value" style="font-size:1.75rem;">{{HOLDERS}}</div>
        <div class="stat-label">Holders</div>
      </div>
      <div class="card-glass shimmer" style="text-align:center;padding:28px 24px;">
        <div class="stat-value" style="font-size:1.75rem;color:#F0B90B;">{{PRICE}}</div>
        <div class="stat-label">Price</div>
      </div>
      <div class="card-glass shimmer" style="text-align:center;padding:28px 24px;">
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
          <span class="yellow-dot"></span>
          <span class="stat-value" style="font-size:1.75rem;">BSC</span>
        </div>
        <div class="stat-label">Network</div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section id="features" style="padding:96px 24px;position:relative;">
    <div style="max-width:1120px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:56px;" class="animate-in delay-2">
        <span class="section-label">Features</span>
        <h2 class="font-heading" style="font-size:2.5rem;font-weight:700;margin:16px 0 0;">Token Capabilities</h2>
        <p style="color:#707A8A;margin:12px 0 0;font-size:1.05rem;">Everything you need for a production-grade token on BNB Chain</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
        <div class="card animate-in delay-2" style="padding:36px 32px;">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>
          </div>
          <h3 class="font-heading" style="font-size:1.25rem;font-weight:600;margin:0 0 10px;">Mintable</h3>
          <p style="color:#707A8A;margin:0;line-height:1.7;font-size:0.95rem;">Owner can mint new tokens to any address. Controlled supply expansion for project growth.</p>
        </div>
        <div class="card animate-in delay-3" style="padding:36px 32px;">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" stroke-width="2"><path d="M3 6h18M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>
          </div>
          <h3 class="font-heading" style="font-size:1.25rem;font-weight:600;margin:0 0 10px;">Burnable</h3>
          <p style="color:#707A8A;margin:0;line-height:1.7;font-size:0.95rem;">Token holders can burn their tokens, reducing total supply. Deflationary mechanism built-in.</p>
        </div>
        <div class="card animate-in delay-4" style="padding:36px 32px;">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 class="font-heading" style="font-size:1.25rem;font-weight:600;margin:0 0 10px;">Secure</h3>
          <p style="color:#707A8A;margin:0;line-height:1.7;font-size:0.95rem;">Built on OpenZeppelin contracts with pausable transfers and owner-only admin functions.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Tokenomics -->
  <section id="about" style="padding:80px 24px;background:white;">
    <div style="max-width:1120px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:48px;">
        <span class="section-label">Tokenomics</span>
        <h2 class="font-heading" style="font-size:2.25rem;font-weight:700;margin:12px 0 0;">Distribution</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:48px;align-items:center;">
        <div>
          <div style="margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="font-weight:500;">Public Sale</span><span style="color:#F0B90B;font-weight:600;">40%</span>
            </div>
            <div style="height:8px;background:#F0F0F0;border-radius:100px;"><div style="height:100%;width:40%;background:#F0B90B;border-radius:100px;"></div></div>
          </div>
          <div style="margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="font-weight:500;">Liquidity Pool</span><span style="color:#F0B90B;font-weight:600;">25%</span>
            </div>
            <div style="height:8px;background:#F0F0F0;border-radius:100px;"><div style="height:100%;width:25%;background:#1E2329;border-radius:100px;"></div></div>
          </div>
          <div style="margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="font-weight:500;">Team & Advisors</span><span style="color:#F0B90B;font-weight:600;">20%</span>
            </div>
            <div style="height:8px;background:#F0F0F0;border-radius:100px;"><div style="height:100%;width:20%;background:#707A8A;border-radius:100px;"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="font-weight:500;">Ecosystem Fund</span><span style="color:#F0B90B;font-weight:600;">15%</span>
            </div>
            <div style="height:8px;background:#F0F0F0;border-radius:100px;"><div style="height:100%;width:15%;background:#B7BDC6;border-radius:100px;"></div></div>
          </div>
        </div>
        <div class="card" style="background:#FAFAFA;">
          <h3 class="font-heading" style="font-size:1.5rem;font-weight:600;margin:0 0 24px;">Contract Details</h3>
          <div style="margin-bottom:16px;">
            <div style="font-size:0.75rem;color:#707A8A;margin-bottom:4px;">Network</div>
            <div style="font-weight:500;">BNB Smart Chain (BSC)</div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:0.75rem;color:#707A8A;margin-bottom:4px;">Standard</div>
            <div style="font-weight:500;">BEP-20</div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:0.75rem;color:#707A8A;margin-bottom:4px;">Decimals</div>
            <div style="font-weight:500;">18</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#707A8A;margin-bottom:4px;">Audit Status</div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="yellow-dot"></span>
              <span style="font-weight:500;color:#F0B90B;">OpenZeppelin-based</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${SHARED_FOOTER.replace(/\{\{PROJECT_NAME\}\}/g, '{{TOKEN_NAME}}')}
</body>
</html>`;

// ─── Template 2: NFT Collection ───────────────────────────────

const NFT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{COLLECTION_NAME}} — NFT Collection on BNB Chain</title>
  ${SHARED_HEAD}
  <style>
    .nft-card { border-radius: 16px; overflow: hidden; background: white; border: 1px solid #F0F0F0; transition: all 0.3s; }
    .nft-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(240,185,11,0.15); }
    .nft-img { width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, #FFF9E6 0%, #F0FFF4 100%); display: flex; align-items: center; justify-content: center; }
    .mint-box { background: white; border: 2px solid #F0B90B; border-radius: 20px; padding: 40px; }
    .counter-btn { width: 44px; height: 44px; border-radius: 12px; border: 1px solid #F0F0F0; background: white; font-size: 1.25rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
    .counter-btn:hover { border-color: #F0B90B; background: #FFF9E6; }
  </style>
</head>
<body style="margin:0;background:#FAFAFA;">
  ${SHARED_NAV.replace(/\{\{PROJECT_NAME\}\}/g, '{{COLLECTION_NAME}}')}

  <!-- Hero -->
  <section class="gradient-bg" style="padding:140px 24px 100px;position:relative;overflow:hidden;">
    <div class="dot-pattern"></div>
    <div class="hero-glow" style="top:-100px;right:10%;background:#F0B90B;"></div>
    <div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;position:relative;z-index:1;">
      <div class="animate-in">
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);border:1px solid rgba(240,185,11,0.15);border-radius:100px;padding:8px 20px;margin-bottom:28px;box-shadow:0 2px 12px rgba(240,185,11,0.06);">
          <span class="yellow-dot"></span>
          <span style="font-size:0.875rem;color:#707A8A;font-weight:500;">{{TOTAL_SUPPLY}} Items</span>
        </div>
        <h1 class="font-heading" style="font-size:3.25rem;font-weight:700;line-height:1.08;margin:0 0 20px;">
          <span class="gradient-text">{{COLLECTION_NAME}}</span>
        </h1>
        <p style="font-size:1.125rem;color:#707A8A;margin:0 0 36px;line-height:1.7;">
          {{COLLECTION_DESCRIPTION}}
        </p>
        <div style="display:flex;gap:24px;margin-bottom:40px;">
          <div style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);padding:16px 24px;border-radius:16px;border:1px solid rgba(240,185,11,0.1);">
            <div class="stat-value" style="font-size:1.5rem;color:#F0B90B;">{{MINT_PRICE}}</div>
            <div class="stat-label">Mint Price</div>
          </div>
          <div style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);padding:16px 24px;border-radius:16px;border:1px solid rgba(240,185,11,0.1);">
            <div class="stat-value" style="font-size:1.5rem;">{{MINTED}}/{{TOTAL_SUPPLY}}</div>
            <div class="stat-label">Minted</div>
          </div>
        </div>
      </div>
      <div class="animate-scale delay-2">
        <div class="mint-box" style="text-align:center;position:relative;">
          <div style="width:200px;height:200px;margin:0 auto 24px;border-radius:20px;background:linear-gradient(135deg,#FFF9E6,#F0FFF4);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(240,185,11,0.12);">
            ${BNB_LOGO_SVG.replace('width="32" height="32"', 'width="64" height="64"')}
          </div>
          <h3 class="font-heading" style="font-size:1.25rem;font-weight:600;margin:0 0 20px;">Mint Your NFT</h3>
          <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:24px;">
            <button class="counter-btn">-</button>
            <span class="font-heading" style="font-size:1.5rem;font-weight:700;min-width:32px;">1</span>
            <button class="counter-btn">+</button>
          </div>
          <div style="font-size:0.875rem;color:#707A8A;margin-bottom:20px;">
            Total: <span style="color:#1E2329;font-weight:600;">{{MINT_PRICE}} BNB</span>
          </div>
          <button class="btn-primary" style="width:100%;padding:14px;animation:pulse-glow 3s infinite;">Mint Now</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Gallery -->
  <section id="features" style="padding:80px 24px;">
    <div style="max-width:1120px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:48px;">
        <span class="section-label">Gallery</span>
        <h2 class="font-heading" style="font-size:2.25rem;font-weight:700;margin:12px 0 0;">Collection Preview</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;">
        <div class="nft-card">
          <div class="nft-img"><span style="font-size:2rem;">#1</span></div>
          <div style="padding:16px;">
            <div style="font-weight:600;">{{COLLECTION_NAME}} #1</div>
            <div style="font-size:0.875rem;color:#707A8A;">{{MINT_PRICE}} BNB</div>
          </div>
        </div>
        <div class="nft-card">
          <div class="nft-img"><span style="font-size:2rem;">#2</span></div>
          <div style="padding:16px;">
            <div style="font-weight:600;">{{COLLECTION_NAME}} #2</div>
            <div style="font-size:0.875rem;color:#707A8A;">{{MINT_PRICE}} BNB</div>
          </div>
        </div>
        <div class="nft-card">
          <div class="nft-img"><span style="font-size:2rem;">#3</span></div>
          <div style="padding:16px;">
            <div style="font-weight:600;">{{COLLECTION_NAME}} #3</div>
            <div style="font-size:0.875rem;color:#707A8A;">{{MINT_PRICE}} BNB</div>
          </div>
        </div>
        <div class="nft-card">
          <div class="nft-img"><span style="font-size:2rem;">#4</span></div>
          <div style="padding:16px;">
            <div style="font-weight:600;">{{COLLECTION_NAME}} #4</div>
            <div style="font-size:0.875rem;color:#707A8A;">{{MINT_PRICE}} BNB</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Roadmap -->
  <section id="about" style="padding:80px 24px;background:white;">
    <div style="max-width:720px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:48px;">
        <span class="section-label">Roadmap</span>
        <h2 class="font-heading" style="font-size:2.25rem;font-weight:700;margin:12px 0 0;">What's Next</h2>
      </div>
      <div style="position:relative;padding-left:32px;">
        <div style="position:absolute;left:11px;top:8px;bottom:8px;width:2px;background:#F0F0F0;"></div>
        <div style="position:relative;margin-bottom:40px;">
          <div style="position:absolute;left:-32px;top:4px;width:24px;height:24px;border-radius:50%;background:#F0B90B;display:flex;align-items:center;justify-content:center;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h4 class="font-heading" style="font-size:1.125rem;font-weight:600;margin:0 0 4px;">Phase 1 — Launch</h4>
          <p style="color:#707A8A;margin:0;">Smart contract deployment, minting site launch, community building</p>
        </div>
        <div style="position:relative;margin-bottom:40px;">
          <div style="position:absolute;left:-32px;top:4px;width:24px;height:24px;border-radius:50%;background:#F0B90B;display:flex;align-items:center;justify-content:center;">
            <div style="width:8px;height:8px;border-radius:50%;background:white;"></div>
          </div>
          <h4 class="font-heading" style="font-size:1.125rem;font-weight:600;margin:0 0 4px;">Phase 2 — Growth</h4>
          <p style="color:#707A8A;margin:0;">Marketplace integration, holder rewards, collaborative events</p>
        </div>
        <div style="position:relative;">
          <div style="position:absolute;left:-32px;top:4px;width:24px;height:24px;border-radius:50%;border:2px solid #F0F0F0;background:white;"></div>
          <h4 class="font-heading" style="font-size:1.125rem;font-weight:600;margin:0 0 4px;">Phase 3 — Expansion</h4>
          <p style="color:#707A8A;margin:0;">Metaverse integration, token utility, cross-project partnerships</p>
        </div>
      </div>
    </div>
  </section>

  ${SHARED_FOOTER.replace(/\{\{PROJECT_NAME\}\}/g, '{{COLLECTION_NAME}}')}
</body>
</html>`;

// ─── Template 3: General Landing ──────────────────────────────

const LANDING_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{PROJECT_NAME}} — Built on BNB Chain</title>
  ${SHARED_HEAD}
</head>
<body style="margin:0;background:#FAFAFA;">
  ${SHARED_NAV}

  <!-- Hero -->
  <section class="gradient-bg" style="padding:140px 24px 100px;text-align:center;position:relative;overflow:hidden;">
    <div class="dot-pattern"></div>
    <div class="hero-glow" style="top:-200px;left:50%;transform:translateX(-50%);background:#F0B90B;"></div>
    <div style="max-width:720px;margin:0 auto;position:relative;z-index:1;" class="animate-in">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);border:1px solid rgba(240,185,11,0.15);border-radius:100px;padding:8px 20px;margin-bottom:28px;box-shadow:0 2px 12px rgba(240,185,11,0.06);">
        <span class="yellow-dot"></span>
        <span style="font-size:0.875rem;color:#707A8A;font-weight:500;">Powered by BNB Chain</span>
      </div>
      <h1 class="font-heading" style="font-size:3.75rem;font-weight:700;line-height:1.08;margin:0 0 20px;">
        <span class="gradient-text">{{PROJECT_HEADLINE}}</span>
      </h1>
      <p style="font-size:1.25rem;color:#707A8A;margin:0 0 44px;line-height:1.7;max-width:560px;margin-left:auto;margin-right:auto;">
        {{PROJECT_DESCRIPTION}}
      </p>
      <div style="display:flex;gap:16px;justify-content:center;">
        <button class="btn-primary" style="font-size:1rem;">Launch App</button>
        <button class="btn-outline">Documentation</button>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section style="padding:0 24px;margin-top:-48px;position:relative;z-index:10;">
    <div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;" class="animate-in delay-1">
      <div class="card-glass shimmer" style="text-align:center;padding:28px 24px;">
        <div class="stat-value" style="font-size:1.75rem;">{{STAT_1_VALUE}}</div>
        <div class="stat-label">{{STAT_1_LABEL}}</div>
      </div>
      <div class="card-glass shimmer" style="text-align:center;padding:28px 24px;">
        <div class="stat-value" style="font-size:1.75rem;">{{STAT_2_VALUE}}</div>
        <div class="stat-label">{{STAT_2_LABEL}}</div>
      </div>
      <div class="card-glass shimmer" style="text-align:center;padding:28px 24px;">
        <div class="stat-value" style="font-size:1.75rem;">{{STAT_3_VALUE}}</div>
        <div class="stat-label">{{STAT_3_LABEL}}</div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section id="features" style="padding:96px 24px;position:relative;">
    <div style="max-width:1120px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:56px;" class="animate-in delay-2">
        <span class="section-label">Why {{PROJECT_NAME}}</span>
        <h2 class="font-heading" style="font-size:2.5rem;font-weight:700;margin:16px 0 0;">Built for Performance</h2>
        <p style="color:#707A8A;margin:12px 0 0;font-size:1.05rem;">Enterprise-grade infrastructure on BNB Chain</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
        <div class="card animate-in delay-2" style="padding:36px 32px;">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <h3 class="font-heading" style="font-size:1.25rem;font-weight:600;margin:0 0 10px;">{{FEATURE_1_TITLE}}</h3>
          <p style="color:#707A8A;margin:0;line-height:1.7;font-size:0.95rem;">{{FEATURE_1_DESC}}</p>
        </div>
        <div class="card animate-in delay-3" style="padding:36px 32px;">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 class="font-heading" style="font-size:1.25rem;font-weight:600;margin:0 0 10px;">{{FEATURE_2_TITLE}}</h3>
          <p style="color:#707A8A;margin:0;line-height:1.7;font-size:0.95rem;">{{FEATURE_2_DESC}}</p>
        </div>
        <div class="card animate-in delay-4" style="padding:36px 32px;">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <h3 class="font-heading" style="font-size:1.25rem;font-weight:600;margin:0 0 10px;">{{FEATURE_3_TITLE}}</h3>
          <p style="color:#707A8A;margin:0;line-height:1.7;font-size:0.95rem;">{{FEATURE_3_DESC}}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section id="about" style="padding:80px 24px;background:white;">
    <div style="max-width:1120px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:48px;">
        <span class="section-label">How It Works</span>
        <h2 class="font-heading" style="font-size:2.25rem;font-weight:700;margin:12px 0 0;">Get Started in 3 Steps</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
        <div style="text-align:center;">
          <div style="width:56px;height:56px;border-radius:50%;background:#F0B90B;color:white;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.25rem;">1</div>
          <h3 class="font-heading" style="font-size:1.125rem;font-weight:600;margin:0 0 8px;">{{STEP_1_TITLE}}</h3>
          <p style="color:#707A8A;margin:0;">{{STEP_1_DESC}}</p>
        </div>
        <div style="text-align:center;">
          <div style="width:56px;height:56px;border-radius:50%;background:#F0B90B;color:white;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.25rem;">2</div>
          <h3 class="font-heading" style="font-size:1.125rem;font-weight:600;margin:0 0 8px;">{{STEP_2_TITLE}}</h3>
          <p style="color:#707A8A;margin:0;">{{STEP_2_DESC}}</p>
        </div>
        <div style="text-align:center;">
          <div style="width:56px;height:56px;border-radius:50%;background:#F0B90B;color:white;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.25rem;">3</div>
          <h3 class="font-heading" style="font-size:1.125rem;font-weight:600;margin:0 0 8px;">{{STEP_3_TITLE}}</h3>
          <p style="color:#707A8A;margin:0;">{{STEP_3_DESC}}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section style="padding:96px 24px;">
    <div style="max-width:800px;margin:0 auto;text-align:center;background:linear-gradient(135deg,#1E2329,#2B3139);border-radius:28px;padding:72px 48px;position:relative;overflow:hidden;">
      <div class="dot-pattern" style="opacity:0.04;"></div>
      <div class="hero-glow" style="top:-100px;left:50%;transform:translateX(-50%);background:#F0B90B;width:400px;height:400px;opacity:0.06;"></div>
      <div style="position:relative;z-index:1;">
        <h2 class="font-heading" style="font-size:2.25rem;font-weight:700;color:white;margin:0 0 16px;">Ready to Get Started?</h2>
        <p style="color:#B7BDC6;margin:0 0 36px;font-size:1.125rem;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.6;">Join the growing {{PROJECT_NAME}} ecosystem on BNB Chain.</p>
        <button class="btn-primary" style="font-size:1rem;animation:pulse-glow 3s infinite;">Launch App</button>
      </div>
    </div>
  </section>

  ${SHARED_FOOTER}
</body>
</html>`;

// ─── Template 4: dApp Dashboard ───────────────────────────────

const DASHBOARD_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{PROJECT_NAME}} — Dashboard</title>
  ${SHARED_HEAD}
  <style>
    .sidebar { width: 260px; background: white; border-right: 1px solid #F0F0F0; height: 100vh; position: fixed; top: 0; left: 0; padding: 24px 16px; }
    .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 12px; color: #707A8A; text-decoration: none; font-size: 0.875rem; transition: all 0.2s; cursor: pointer; }
    .sidebar-link:hover { background: #FFF9E6; color: #1E2329; }
    .sidebar-link.active { background: linear-gradient(135deg, rgba(240,185,11,0.1), rgba(240,185,11,0.05)); color: #F0B90B; font-weight: 600; border: 1px solid rgba(240,185,11,0.15); }
    .main-content { margin-left: 260px; padding: 32px; background: #FAFAFA; min-height: 100vh; }
    .stat-card { background: white; border: 1px solid #F0F0F0; border-radius: 16px; padding: 24px; transition: all 0.3s; position: relative; overflow: hidden; }
    .stat-card:hover { border-color: rgba(240,185,11,0.2); box-shadow: 0 4px 20px rgba(240,185,11,0.06); }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; font-weight: 600; color: #707A8A; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #F0F0F0; }
    .data-table td { padding: 16px; border-bottom: 1px solid #F0F0F0; font-size: 0.875rem; }
    .data-table tr:hover { background: rgba(240,185,11,0.02); }
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 500; }
    .badge-success { background: #E8FFF3; color: #02C076; }
    .badge-pending { background: #FFF9E6; color: #F0B90B; }
  </style>
</head>
<body style="margin:0;background:#FAFAFA;">
  <!-- Sidebar -->
  <aside class="sidebar">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;padding:0 16px;">
      ${BNB_LOGO_SVG}
      <span class="font-heading" style="font-weight:700;font-size:1rem;color:#1E2329;">{{PROJECT_NAME}}</span>
    </div>
    <div style="margin-bottom:8px;padding:0 16px;font-size:0.7rem;font-weight:600;color:#B7BDC6;text-transform:uppercase;letter-spacing:0.1em;">Main</div>
    <div class="sidebar-link active">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      Dashboard
    </div>
    <div class="sidebar-link">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
      Swap
    </div>
    <div class="sidebar-link">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 010 4h4"/></svg>
      Portfolio
    </div>
    <div class="sidebar-link">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      History
    </div>
    <div style="margin-top:24px;margin-bottom:8px;padding:0 16px;font-size:0.7rem;font-weight:600;color:#B7BDC6;text-transform:uppercase;letter-spacing:0.1em;">Settings</div>
    <div class="sidebar-link">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      Settings
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    <!-- Top Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;">
      <div>
        <h1 class="font-heading" style="font-size:1.75rem;font-weight:700;margin:0;">Dashboard</h1>
        <p style="color:#707A8A;margin:4px 0 0;font-size:0.875rem;">Welcome back. Here's your overview.</p>
      </div>
      <button class="btn-primary" style="display:flex;align-items:center;gap:8px;padding:10px 20px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 010 4h4"/></svg>
        Connect Wallet
      </button>
    </div>

    <!-- Stats Grid -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;">
      <div class="stat-card">
        <div style="font-size:0.8rem;color:#707A8A;margin-bottom:8px;">Total Value</div>
        <div class="font-heading" style="font-size:1.75rem;font-weight:700;">{{TOTAL_VALUE}}</div>
        <div style="font-size:0.8rem;color:#02C076;margin-top:4px;">+{{CHANGE_PERCENT}} today</div>
      </div>
      <div class="stat-card">
        <div style="font-size:0.8rem;color:#707A8A;margin-bottom:8px;">{{TOKEN_SYMBOL}} Balance</div>
        <div class="font-heading" style="font-size:1.75rem;font-weight:700;">{{TOKEN_BALANCE}}</div>
        <div style="font-size:0.8rem;color:#707A8A;margin-top:4px;">{{TOKEN_USD}} USD</div>
      </div>
      <div class="stat-card">
        <div style="font-size:0.8rem;color:#707A8A;margin-bottom:8px;">BNB Balance</div>
        <div class="font-heading" style="font-size:1.75rem;font-weight:700;">{{BNB_BALANCE}}</div>
        <div style="font-size:0.8rem;color:#707A8A;margin-top:4px;">{{BNB_USD}} USD</div>
      </div>
      <div class="stat-card">
        <div style="font-size:0.8rem;color:#707A8A;margin-bottom:8px;">Transactions</div>
        <div class="font-heading" style="font-size:1.75rem;font-weight:700;">{{TX_COUNT}}</div>
        <div style="font-size:0.8rem;color:#707A8A;margin-top:4px;">Lifetime</div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div style="background:white;border:1px solid #F0F0F0;border-radius:16px;overflow:hidden;">
      <div style="padding:20px 24px;border-bottom:1px solid #F0F0F0;display:flex;justify-content:space-between;align-items:center;">
        <h3 class="font-heading" style="font-size:1.125rem;font-weight:600;margin:0;">Recent Transactions</h3>
        <button style="font-size:0.8rem;color:#F0B90B;background:none;border:none;cursor:pointer;font-weight:500;">View All</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Address</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:500;">Transfer</td>
            <td>1,000 {{TOKEN_SYMBOL}}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem;color:#707A8A;">0x1a2b...3c4d</td>
            <td><span class="badge badge-success">Confirmed</span></td>
            <td style="color:#707A8A;">2 min ago</td>
          </tr>
          <tr>
            <td style="font-weight:500;">Swap</td>
            <td>0.5 BNB</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem;color:#707A8A;">0x5e6f...7g8h</td>
            <td><span class="badge badge-success">Confirmed</span></td>
            <td style="color:#707A8A;">15 min ago</td>
          </tr>
          <tr>
            <td style="font-weight:500;">Approve</td>
            <td>Unlimited {{TOKEN_SYMBOL}}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem;color:#707A8A;">0x9i0j...1k2l</td>
            <td><span class="badge badge-pending">Pending</span></td>
            <td style="color:#707A8A;">1 hr ago</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</body>
</html>`;

// ─── Export ───────────────────────────────────────────────────

export const designTemplates: Record<string, DesignTemplate> = {
  token: {
    type: "token",
    name: "Token Showcase Page",
    description: "Landing page for a BEP20 token with hero, stats, features, and tokenomics sections.",
    html: TOKEN_TEMPLATE,
  },
  nft: {
    type: "nft",
    name: "NFT Collection Page",
    description: "Mint page for a BEP721 NFT collection with gallery, mint box, and roadmap.",
    html: NFT_TEMPLATE,
  },
  landing: {
    type: "landing",
    name: "Project Landing Page",
    description: "General-purpose landing page for any BNB Chain project with features, how-it-works, and CTA.",
    html: LANDING_TEMPLATE,
  },
  dashboard: {
    type: "dashboard",
    name: "dApp Dashboard",
    description: "Application dashboard with sidebar navigation, stats cards, and transaction table.",
    html: DASHBOARD_TEMPLATE,
  },
};
