import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="logo">CART<span class="accent">CORE</span></span>
          <p>The premium infrastructure for modern commerce.</p>
          <div class="social-links">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </div>
        </div>
        <div class="footer-col">
          <h5>Platform</h5>
          <a routerLink="/products">All Products</a>
          <a routerLink="/products">New Arrivals</a>
          <a routerLink="/cart">Checkout</a>
        </div>
        <div class="footer-col">
          <h5>Identity</h5>
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Register</a>
          <a routerLink="/orders">History</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="legal">
          <span>© 2077 CARTCORE SYSTEMS.</span>
          <a href="#">Security</a>
          <a href="#">Terms</a>
        </div>
        <span class="status">
          <span class="dot"></span>
          All Systems Nominal
        </span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      margin-top: 6rem;
      border-top: 1.5px solid var(--border);
      background: var(--bg-alt);
      padding: 4rem 0 2rem;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem 3rem;
      display: grid;
      grid-template-columns: 2.5fr 1fr 1fr;
      gap: 3rem;
      border-bottom: 1.5px solid var(--border);
    }
    .footer-brand .logo {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: var(--text);
    }
    .accent { background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .footer-brand p { color: var(--text-muted); font-size: 0.9rem; margin: 12px 0 24px; font-weight: 500; }
    
    .social-links { display: flex; gap: 20px; color: var(--text-muted); }
    .social-links svg { cursor: pointer; transition: all 0.2s; }
    .social-links svg:hover { color: var(--primary); transform: translateY(-3px); }

    .footer-col h5 { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 20px; }
    .footer-col { display: flex; flex-direction: column; gap: 12px; }
    .footer-col a { color: var(--text-muted); font-size: 0.95rem; font-weight: 600; transition: all 0.2s; }
    .footer-col a:hover { color: var(--primary); transform: translateX(5px); }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 2rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .legal { display: flex; gap: 24px; }
    .legal a:hover { color: var(--primary); }

    .status { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-weight: 800; text-transform: uppercase; font-size: 0.75rem; color: var(--success); letter-spacing: 1px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px var(--success); animation: pulse 2.5s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }

    @media (max-width: 768px) {
      .footer-inner { grid-template-columns: 1fr 1fr; }
      .footer-brand { grid-column: 1 / -1; }
      .footer-bottom { flex-direction: column; gap: 1.5rem; text-align: center; }
      .legal { justify-content: center; }
    }
  `]
})
export class FooterComponent {}
