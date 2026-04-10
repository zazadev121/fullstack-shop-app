import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { Product } from '../../../core/models/product.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wishlist-page">
      <div class="header-section">
        <h1 class="glitch-text">{{ t('MY_WISHLIST') }}</h1>
        <p class="subtitle">{{ t('BEST_OFFERS_SUB') }}</p>
      </div>

      <div class="message-banner" *ngIf="actionMsg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>>>> {{ actionMsg }}</span>
      </div>
      
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('LOADING_DEALS') }}</p>
      </div>
      
      <div class="wish-grid" *ngIf="!isLoading">
        @for (item of wishlistItems; track item.id) {
          <div class="wish-card glass-panel">
            <div class="card-visual" [routerLink]="['/product', item.id]">
              <img [src]="item.imageUrl || ''" [alt]="item.name"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
              <div class="img-ph">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
              </div>
              <div class="price-chip-wrapper">
                @if (item.isDiscounted && item.discountPercentage) {
                  <span class="old-price-chip">{{ item.price | currency }}</span>
                  <div class="price-chip discounted">{{ item.price * (1 - (item.discountPercentage || 0) / 100) | currency }}</div>
                } @else {
                  <div class="price-chip">{{ item.price | currency }}</div>
                }
              </div>
            </div>
            <div class="card-info">
              <h3>{{ item.name }}</h3>
              <div class="card-actions">
                <button class="cyber-button small" (click)="addToCart(item.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  {{ t('ADD_TO_CART') }}
                </button>
                <button class="cyber-button pink small" (click)="removeItem(item.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  {{ t('REMOVE') }}
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state glass-panel">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <h3>{{ t('WISHLIST_EMPTY') }}</h3>
            <p>{{ t('MODIFY_SEARCH') }}</p>
            <a routerLink="/products" class="cyber-button">{{ t('BROWSE_PRODUCTS') }}</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .wishlist-page { padding: 2rem 0; max-width: 1200px; margin: 0 auto; }
    .header-section { margin-bottom: 3.5rem; text-align: center; }
    .glitch-text { font-size: 3rem; font-weight: 950; letter-spacing: -1.5px; background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-weight: 600; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 1px; }

    .message-banner { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 16px; padding: 14px 24px; color: var(--success); font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; margin-bottom: 2.5rem; animation: slideIn 0.3s ease-out; width: fit-content; margin-left: auto; margin-right: auto; }
    @keyframes slideIn { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .wish-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
    
    .wish-card { border-radius: 24px; overflow: hidden; border: 2px solid var(--border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: var(--bg-card); }
    .wish-card:hover { transform: translateY(-10px); border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
    
    .card-visual { height: 220px; position: relative; overflow: hidden; background: transparent; cursor: pointer; padding: 10px; }
    .card-visual img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.6s; z-index: 2; position: relative; }
    .wish-card:hover .card-visual img { transform: scale(1.1); }
    .img-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--text-muted); opacity: 0.3; }
    
    .price-chip-wrapper { position: absolute; bottom: 15px; right: 15px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; z-index: 5; }
    .price-chip { background: var(--bg-card); color: var(--text); font-family: var(--font-mono); font-weight: 900; font-size: 0.85rem; padding: 6px 14px; border-radius: 12px; border: 1.5px solid var(--border); }
    .price-chip.discounted { color: var(--primary); border-color: var(--primary); box-shadow: 0 4px 12px rgba(108,99,255,0.15); }
    .old-price-chip { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-decoration: line-through; background: var(--bg-alt); padding: 2px 8px; border-radius: 6px; border: 1px solid var(--border); opacity: 0.8; }
    
    .card-info { padding: 1.5rem; }
    .card-info h3 { font-size: 1.1rem; font-weight: 850; margin: 0 0 1.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text); }
    
    .card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card-actions .cyber-button { padding: 10px; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 8px; }

    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 8rem 0; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state { grid-column: 1 / -1; text-align: center; padding: 6rem 3rem; border-radius: 28px; border: 2.5px dashed var(--border); color: var(--text-muted); background: var(--bg-alt); }
    .empty-state svg { color: var(--text-muted); opacity: 0.1; margin-bottom: 2.5rem; }
    .empty-state h3 { font-size: 1.5rem; font-weight: 950; margin-bottom: 1rem; letter-spacing: -0.5px; color: var(--text); }
    .empty-state p { margin-bottom: 2.5rem; font-weight: 600; line-height: 1.6; }

    @media (max-width: 1200px) {
      .wishlist-page { padding: 2rem 1.5rem; }
    }
    
    @media (max-width: 768px) {
      .wishlist-page { padding: 1.5rem 1rem; }
      .header-section { margin-bottom: 2rem; }
      .glitch-text { font-size: 2.2rem; }
      .wish-grid { gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
      .card-visual { height: 200px; }
      .card-info { padding: 1.25rem; }
      .card-actions { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      .glitch-text { font-size: 1.8rem; letter-spacing: -1px; }
      .message-banner { width: 100%; font-size: 0.75rem; padding: 12px 16px; border-radius: 12px; }
      .wish-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .card-visual { height: 240px; }
      .empty-state { padding: 4rem 1.5rem; border-radius: 20px; }
      .empty-state h3 { font-size: 1.25rem; }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];
  isLoading = true;
  actionMsg = '';

  private langService = inject(LanguageService);

  constructor(private userService: UserService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading = true;
    this.userService.getUserWishlist().subscribe({
      next: (res) => { this.wishlistItems = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  removeItem(productId: number) {
    this.userService.removeFromWishlist(productId).subscribe({
      next: () => { this.loadWishlist(); this.actionMsg = this.t('REMOVE'); setTimeout(()=>this.actionMsg='', 3000); }
    });
  }

  addToCart(productId: number) {
    this.userService.addToCart(productId).subscribe({
      next: (res) => { this.actionMsg = res.message || this.t('CHECKOUT_SUCCESS'); setTimeout(()=>this.actionMsg='', 3000); },
      error: () => { this.actionMsg = this.t('NO_PRODUCTS_FOUND'); }
    });
  }
}
