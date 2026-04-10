import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="isLoading" class="loading-wrap">
      <div class="spinner"></div>
      <p>{{ t('LOADING_DEALS') }}</p>
    </div>

    <div *ngIf="product && !isLoading" class="detail-page">
      <a routerLink="/products" class="back-link">
        <svg style="margin-right:8px" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        {{ t('BACK_TO_SHOP') }}
      </a>

      <div class="detail-grid">
        <!-- Left: Image -->
        <div class="image-col">
          <div class="img-wrap">
            <img [src]="product.imageUrl || ''" [alt]="product.name"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="img-fallback">
               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
            </div>
            <div class="sale-ribbon" *ngIf="product.isDiscounted">{{ product.discountPercentage }}% {{ t('OFF') }}</div>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="info-col">
          <div class="category-tag">{{ t('CATEGORY') }} #{{ product.id }}</div>
          <h1>{{ product.name }}</h1>

          <div class="price-row">
            <div class="pricing-group">
              @if (product.isDiscounted && product.discountPercentage) {
                <span class="old-price">{{ product.price | currency }}</span>
                <span class="price discounted">{{ product.price * (1 - (product.discountPercentage || 0) / 100) | currency }}</span>
              } @else {
                <span class="price">{{ product.price | currency }}</span>
              }
            </div>
            <span class="stock-badge" [class.out]="product.stock === 0">
              <svg *ngIf="product.stock > 0" width="12" height="12" style="margin-right:5px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <svg *ngIf="product.stock === 0" width="12" height="12" style="margin-right:5px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {{ product.stock > 0 ? product.stock + ' ' + t('IN_STOCK') : t('OUT_OF_STOCK') }}
            </span>
          </div>

          <div class="divider"></div>

          <p class="description">{{ product.description || t('NO_PRODUCTS_FOUND') }}</p>

          <div class="divider"></div>

          <div *ngIf="isLoggedIn; else loginPrompt" class="actions">
            <button class="cyber-button" [disabled]="product.stock === 0 || isCartLoading" (click)="addToCart()">
              {{ isCartLoading ? t('PLEASE_WAIT') : t('ADD_TO_CART') }}
            </button>
            <button class="cyber-button pink" [disabled]="isWishLoading" (click)="addToWishlist()">
              {{ isWishLoading ? t('PLEASE_WAIT') : t('WISHLIST') }}
            </button>
          </div>

          <ng-template #loginPrompt>
            <div class="login-nudge">
              <p>{{ t('LOGIN_TO_PURCHASE') }}</p>
              <a routerLink="/login" class="cyber-button">{{ t('LOGIN') }}</a>
            </div>
          </ng-template>

          <div class="action-msg" *ngIf="actionMsg">
             <svg width="14" height="14" style="margin-right:8px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
             {{ actionMsg }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.9rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 3px solid rgba(108,99,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .detail-page { padding: 3rem 5%; max-width: 1300px; margin: 0 auto; overflow: hidden; box-sizing: border-box; }
    .back-link { display: inline-flex; align-items: center; color: var(--text-muted); font-size: 0.8rem; font-weight: 800; font-family: var(--font-mono); margin-bottom: 2.5rem; transition: all 0.2s; letter-spacing: 1px; text-decoration: none; }
    .back-link:hover { color: var(--primary); transform: translateX(-4px); }

    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; width: 100%; box-sizing: border-box; }

    /* Image */
    .image-col { width: 100%; box-sizing: border-box; }
    .img-wrap { position: relative; border-radius: 28px; overflow: hidden; border: 2px solid var(--border); background: var(--bg-card); aspect-ratio: 1; box-shadow: var(--shadow-md); padding: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
    .img-wrap:hover { box-shadow: 0 25px 60px rgba(0,0,0,0.08); transform: translateY(-5px); border-color: var(--primary); }
    .img-wrap img { width: 100%; height: 100%; object-fit: contain; max-height: 100%; z-index: 2; transition: transform 0.6s ease; }
    .img-wrap:hover img { transform: scale(1.05); }
    
    .img-fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--text-muted); opacity: 0.3; }
    .sale-ribbon { position: absolute; top: 24px; left: -10px; background: var(--grad-accent); color: white; font-size: 0.75rem; font-weight: 900; font-family: var(--font-mono); padding: 8px 16px 8px 24px; border-radius: 0 30px 30px 0; box-shadow: 0 8px 20px rgba(255,0,127,0.3); z-index: 5; letter-spacing: 1px; }

    /* Info */
    .info-col { display: flex; flex-direction: column; gap: 1.8rem; width: 100%; box-sizing: border-box; }
    .category-tag { font-family: var(--font-mono); font-size: 0.8rem; color: var(--primary); font-weight: 900; letter-spacing: 3px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
    .category-tag::before { content: ''; display: block; width: 8px; height: 8px; background: var(--primary); border-radius: 50%; }
    
    h1 { font-size: 3.2rem; font-weight: 950; color: var(--text); margin: 0; line-height: 1.1; letter-spacing: -1.5px; }

    .price-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .pricing-group { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
    .price { font-size: 2.8rem; font-weight: 950; color: var(--text); letter-spacing: -1px; }
    .price.discounted { color: var(--primary); }
    .old-price { font-size: 1.4rem; font-weight: 700; color: var(--text-muted); text-decoration: line-through; opacity: 0.6; }
    
    .stock-badge { display: inline-flex; align-items: center; font-size: 0.8rem; font-weight: 900; padding: 8px 16px; border-radius: 30px; background: rgba(16,185,129,0.08); color: var(--success); border: 2px solid rgba(16,185,129,0.15); font-family: var(--font-mono); white-space: nowrap; }
    .stock-badge.out { background: rgba(239,68,68,0.08); color: var(--error); border-color: rgba(239,68,68,0.15); }

    .divider { height: 2px; background: var(--border); width: 100%; opacity: 0.6; border-radius: 2px; }

    .description { color: var(--text-muted); line-height: 1.8; font-size: 1.1rem; font-weight: 500; }

    .actions { display: flex; gap: 1rem; flex-wrap: wrap; width: 100%; box-sizing: border-box; }
    .actions .cyber-button { flex: 1; padding: 18px; font-size: 0.95rem; min-width: 200px; display: flex; justify-content: center; align-items: center; text-align: center; }

    .login-nudge { background: var(--bg-alt); border: 2px dashed var(--border); border-radius: 20px; padding: 2.5rem; text-align: center; width: 100%; box-sizing: border-box; }
    .login-nudge p { color: var(--text-muted); margin-bottom: 1.5rem; font-weight: 600; font-size: 1.05rem; }

    .action-msg { display: flex; align-items: center; font-weight: 800; font-size: 0.9rem; color: var(--success); padding: 14px 20px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 14px; font-family: var(--font-mono); width: 100%; box-sizing: border-box; animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

    @media(max-width: 1024px) {
      .detail-grid { gap: 3rem; }
      h1 { font-size: 2.6rem; }
      .price { font-size: 2.4rem; }
    }

    @media(max-width: 900px) {
      .detail-page { padding: 2rem 5%; }
      .detail-grid { grid-template-columns: 1fr; gap: 3rem; }
      .img-wrap { padding: 40px; max-width: 500px; margin: 0 auto; aspect-ratio: auto; height: 400px; }
      h1 { font-size: 2.4rem; }
      .price-row { gap: 1.2rem; }
    }

    @media(max-width: 480px) {
      .detail-page { padding: 1.5rem; }
      .detail-grid { gap: 2rem; }
      .img-wrap { padding: 20px; border-radius: 20px; height: 300px; max-width: 100%; box-sizing: border-box; }
      h1 { font-size: 2rem; letter-spacing: -0.5px; }
      .price { font-size: 2rem; }
      .old-price { font-size: 1.2rem; }
      .price-row { flex-direction: column; align-items: flex-start; gap: 14px; }
      .stock-badge { align-self: flex-start; margin-top: 4px; }
      .actions { flex-direction: column; gap: 1rem; }
      .actions .cyber-button { width: 100%; min-width: 0; padding: 16px; font-size: 0.9rem; }
      .sale-ribbon { padding: 6px 14px 6px 18px; font-size: 0.7rem; top: 20px; left: -8px; border-radius: 0 20px 20px 0; }
      .description { font-size: 1rem; line-height: 1.6; }
      .info-col { gap: 1.5rem; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  isCartLoading = false;
  isWishLoading = false;
  actionMsg = '';
  isLoggedIn = false;

  private langService = inject(LanguageService);

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.isLoggedIn = !!this.authService.getToken();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getProductById(+id).subscribe({
        next: (res) => { this.product = res.data || null; this.isLoading = false; },
        error: () => { this.isLoading = false; }
      });
    }
  }

  addToCart() {
    if (!this.product) return;
    this.isCartLoading = true;
    this.userService.addToCart(this.product.id).subscribe({
      next: (res) => { this.actionMsg = res.message || this.t('CHECKOUT_SUCCESS'); this.isCartLoading = false; setTimeout(() => this.actionMsg = '', 3000); },
      error: () => { this.actionMsg = this.t('NO_PRODUCTS_FOUND'); this.isCartLoading = false; }
    });
  }

  addToWishlist() {
    if (!this.product) return;
    this.isWishLoading = true;
    this.userService.addToWishlist(this.product.id).subscribe({
      next: (res) => { this.actionMsg = res.message || this.t('CHECKOUT_SUCCESS'); this.isWishLoading = false; setTimeout(() => this.actionMsg = '', 3000); },
      error: () => { this.actionMsg = this.t('NO_PRODUCTS_FOUND'); this.isWishLoading = false; }
    });
  }
}
