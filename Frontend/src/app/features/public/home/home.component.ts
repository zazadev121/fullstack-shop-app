import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { Product } from '../../../core/models/product.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- HERO -->
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          {{ t('HERO_BADGE') }}
        </div>
        <h1 class="hero-title">{{ t('HERO_TITLE_1') }}<br>{{ t('HERO_TITLE_2') }}</h1>
        <p class="hero-subtitle">{{ t('HERO_SUBTITLE') }}</p>
        <div class="hero-actions">
          <a routerLink="/products" class="cyber-button">{{ t('START_SHOPPING') }}</a>
          <a routerLink="/products" class="cyber-button outline">{{ t('VIEW_ALL_OFFERS') }}</a>
        </div>
      </div>
      <div class="hero-graphic">
        <div class="blob-1"></div>
        <div class="blob-2"></div>
        <div class="floating-card fc1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
          <div><strong>{{ t('FAST_DELIVERY') }}</strong><small>{{ t('FAST_DELIVERY_SUB') }}</small></div>
        </div>
        <div class="floating-card fc2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <div><strong>{{ t('SECURE_PAYMENTS') }}</strong><small>{{ t('SECURE_PAYMENTS_SUB') }}</small></div>
        </div>
      </div>
    </div>

    <!-- FEATURED DEALS -->
    <section class="featured-section">
      <div class="section-header">
        <div>
          <h2>
            <svg style="color:var(--neon-pink)" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 3.5 6.5 1.5 2 2 4.5 2 7a2 2 0 1 1-4 0c0-1.5 0-3-1-4-1 1-1 2.5-1 4 0 2.5-4 1-4-2.5 0-2 0-3.5 1-5a2.5 2.5 0 0 1 0 4.5z"/></svg>
            {{ t('BEST_OFFERS') }}
          </h2>
          <p>{{ t('BEST_OFFERS_SUB') }}</p>
        </div>
        <a routerLink="/products" class="see-all-link">{{ t('SHOP_ALL_PRODUCTS') }}</a>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <span>{{ t('LOADING_DEALS') }}</span>
      </div>

      <div class="deals-grid" *ngIf="!isLoading">
        @for (product of topDeals; track product.id) {
          <div class="deal-card" [routerLink]="['/product', product.id]">
            <div class="deal-img">
              <img [src]="product.imageUrl || ''" [alt]="product.name"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="img-ph">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              <div class="deal-badge">{{ product.discountPercentage }}% {{ t('OFF') }}</div>
            </div>
            <div class="deal-body">
              <p class="deal-name">{{ product.name }}</p>
              <div class="price-row">
                @if (product.isDiscounted && product.discountPercentage) {
                  <span class="old-price">{{ product.price | currency }}</span>
                  <span class="deal-price discounted">{{ product.price * (1 - (product.discountPercentage || 0) / 100) | currency }}</span>
                } @else {
                  <span class="deal-price">{{ product.price | currency }}</span>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="no-deals-box">
             <p>{{ t('NO_DEALS_FOUND') }}</p>
             <a routerLink="/products" class="cyber-button small">{{ t('BROWSE_PRODUCTS') }}</a>
          </div>
        }
      </div>
    </section>

    <!-- FEATURES ROW -->
    <section class="features-row">
      <div class="feature-item">
        <div class="feature-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="2" y="4" rx="2"/><path d="M18 8h3l3 3v6h-3"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
        </div>
        <h4>{{ t('FREE_SHIPPING') }}</h4>
        <p>{{ t('FREE_SHIPPING_SUB') }}</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.63-6.12L21 6"/><path d="M21 3v3h-3"/><path d="M21 12a9 9 0 0 1-15.63 6.12L3 18"/><path d="M3 21v-3h3"/></svg>
        </div>
        <h4>{{ t('EASY_RETURNS') }}</h4>
        <p>{{ t('EASY_RETURNS_SUB') }}</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h4>{{ t('SECURE_SHOPPING') }}</h4>
        <p>{{ t('SECURE_SHOPPING_SUB') }}</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h4>{{ t('SUPPORT') }}</h4>
        <p>{{ t('SUPPORT_SUB') }}</p>
      </div>
    </section>
  `,
  styles: [`
    .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding: 4rem 0 6rem; min-height: 520px; }
    .hero-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(108,99,255,0.06); color: var(--primary); font-size: 0.75rem; font-weight: 900; padding: 10px 20px; border-radius: 40px; margin-bottom: 2.5rem; border: 2px solid rgba(108,99,255,0.12); letter-spacing: 1px; font-family: var(--font-mono); }
    .hero-title { font-size: 4.5rem; font-weight: 950; line-height: 0.95; letter-spacing: -3px; margin-bottom: 2rem; background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-subtitle { font-size: 1.2rem; color: var(--text-muted); max-width: 550px; line-height: 1.6; margin-bottom: 3rem; font-weight: 600; }
    .hero-actions { display: flex; gap: 1.5rem; }
    
    .hero-graphic { position: relative; height: 450px; display: flex; align-items: center; justify-content: center; }
    .blob-1 { position: absolute; width: 400px; height: 400px; background: var(--grad-primary); border-radius: 60% 40% 50% 60% / 40% 60% 50% 60%; filter: blur(60px); opacity: 0.15; animation: morph 8s ease-in-out infinite; }
    .blob-2 { position: absolute; width: 320px; height: 320px; background: var(--grad-accent); border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; filter: blur(60px); opacity: 0.12; animation: morph 10s ease-in-out infinite reverse; }
    @keyframes morph { 0%,100% { border-radius: 60% 40% 50% 60% / 40% 60% 50% 60%; } 50% { border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; } }

    .floating-card { position: absolute; background: var(--bg-dark-card); backdrop-filter: blur(12px); border-radius: 22px; border: 2px solid var(--border); padding: 18px 26px; display: flex; align-items: center; gap: 18px; box-shadow: 0 15px 40px rgba(0,0,0,0.06); font-size: 0.85rem; animation: float 6s ease-in-out infinite; z-index: 2; }
    .floating-card svg { color: var(--primary); }
    .floating-card div { display: flex; flex-direction: column; }
    .floating-card strong { font-size: 1rem; font-weight: 900; color: var(--text); letter-spacing: 0.5px; }
    .floating-card small { color: var(--text-muted); font-weight: 700; font-size: 0.75rem; letter-spacing: 0.5px; }
    .fc1 { top: 10%; left: -5%; animation-delay: 0s; }
    .fc2 { bottom: 15%; right: -5%; animation-delay: 3s; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

    .featured-section { background: var(--bg-card); border-radius: 36px; padding: 4rem; border: 2.5px solid var(--border); margin-bottom: 4rem; box-shadow: var(--shadow-md); }
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3.5rem; gap: 2rem; flex-wrap: wrap; }
    .section-header h2 { font-size: 2.2rem; font-weight: 950; margin: 0; display: flex; align-items: center; gap: 15px; letter-spacing: -1px; }
    .section-header p { color: var(--text-muted); font-size: 1rem; margin-top: 10px; font-weight: 600; }
    .see-all-link { color: var(--primary); font-weight: 900; font-size: 0.95rem; letter-spacing: 1px; font-family: var(--font-mono); }

    .deals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
    .deal-card { border: 2px solid var(--border); border-radius: 24px; overflow: hidden; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); background: var(--bg-card); }
    .deal-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); border-color: var(--primary); }
    .deal-img { position: relative; height: 240px; background: transparent; overflow: hidden; padding: 10px; }
    .deal-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.8s; }
    .deal-card:hover .deal-img img { transform: scale(1.1); }
    .img-ph { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; color: #e2e8f0; }
    .deal-badge { position: absolute; top: 15px; right: 15px; background: var(--grad-accent); color: #fff; font-size: 0.75rem; font-weight: 950; padding: 6px 14px; border-radius: 40px; box-shadow: 0 8px 15px rgba(255,0,127,0.3); font-family: var(--font-mono); }
    .deal-body { padding: 1.5rem 2rem; }
    .deal-name { font-size: 1.1rem; font-weight: 850; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text); }
    .deal-price { font-size: 1.35rem; font-weight: 950; color: var(--text); margin: 0; letter-spacing: -1px; }
    .deal-price.discounted { color: var(--primary); }
    .old-price { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); text-decoration: line-through; opacity: 0.6; }
    .price-row { display: flex; align-items: baseline; gap: 10px; }
    
    .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .features-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; margin-top: 1rem; }
    .feature-item { background: var(--bg-card); border: 2px solid var(--border); border-radius: 28px; padding: 2.5rem 2rem; text-align: center; transition: all 0.4s; }
    .feature-item:hover { border-color: var(--primary); background: rgba(108,99,255,0.01); transform: scale(1.02); }
    .feature-icon { margin-bottom: 1.5rem; color: var(--primary); display: flex; justify-content: center; }
    .feature-item h4 { font-size: 0.9rem; font-weight: 950; margin-bottom: 10px; color: var(--text); letter-spacing: 1px; font-family: var(--font-mono); }
    .feature-item p { font-size: 0.85rem; color: var(--text-muted); margin: 0; font-weight: 600; }
    
    .no-deals-box { grid-column: 1/-1; text-align: center; padding: 3rem; }

    @media (max-width: 1024px) {
      .hero { grid-template-columns: 1fr; text-align: center; gap: 3rem; padding: 3rem 0; }
      .hero-inner { display: flex; flex-direction: column; align-items: center; }
      .hero-graphic { height: 320px; }
      .hero-subtitle { margin-left: auto; margin-right: auto; }
      .hero-title { font-size: 3.5rem; }
      .featured-section { padding: 3rem 2rem; }
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.8rem; letter-spacing: -1.5px; }
      .hero-subtitle { font-size: 1.1rem; }
      .floating-card { padding: 12px 18px; gap: 12px; }
      .fc1 { left: 0; top: 5%; }
      .fc2 { right: 0; bottom: 10%; }
    }

    @media (max-width: 480px) {
      .hero-title { font-size: 2.2rem; margin-bottom: 1.5rem; }
      .hero-actions { flex-direction: column; width: 100%; gap: 1rem; }
      .hero-actions .cyber-button { width: 100%; }
      .hero-graphic { height: 280px; }
      .floating-card { display: none; } /* Hide cards on very small screens to clear the view */
      .featured-section { padding: 2rem 1.5rem; border-radius: 24px; }
      .section-header h2 { font-size: 1.6rem; }
      .deals-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  topDeals: Product[] = [];
  isLoading = true;

  private langService = inject(LanguageService);

  constructor(private userService: UserService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.userService.getAllProducts().subscribe({
      next: (res) => {
        const all = res.data || [];
        this.topDeals = all
          .filter(p => p.isDiscounted && p.stock > 0)
          .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
          .slice(0, 3);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }
}
