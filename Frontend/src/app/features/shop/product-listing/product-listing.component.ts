import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { AdminService } from '@core/services/admin.service';
import { Product } from '@core/models/product.model';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="shop-page">
      <!-- Header -->
      <div class="shop-header">
        <div class="header-left">
          <h1>{{ t('EXPLORE_COLLECTION') }}</h1>
          <p class="result-count">{{ products.length }} {{ products.length !== 1 ? t('PRODUCTS_FOUND') : t('PRODUCT_FOUND') }}</p>
        </div>
        <div class="sort-bar">
          <div class="sort-wrapper">
             <svg class="icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
            <select [(ngModel)]="sortBy" (change)="applySort()" id="sort-select">
              <option value="">{{ t('SORT_BY') }}</option>
              <option value="price-asc">{{ t('PRICE_LOW_HIGH') }}</option>
              <option value="price-desc">{{ t('PRICE_HIGH_LOW') }}</option>
              <option value="name">{{ t('NAME_A_Z') }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="shop-layout">
        <!-- FILTER SIDEBAR -->
        <aside class="filter-sidebar">
          <div class="sidebar-header">
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
              {{ t('FILTERS') }}
            </h3>
            <button class="clear-btn" (click)="clearAll()">{{ t('RESET') }}</button>
          </div>

          <!-- Search -->
          <div class="filter-section">
            <label>{{ t('SEARCH_PRODUCTS') }}</label>
            <div class="search-row">
              <input type="text" [(ngModel)]="searchKeyword" [placeholder]="t('SEARCH_PLACEHOLDER')" (keyup.enter)="applyFilters()">
              <button class="search-trigger" (click)="applyFilters()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </div>
          </div>

          <!-- Price Range -->
          <div class="filter-section">
            <label>{{ t('PRICE_RANGE') }} ({{ minPrice | currency }})</label>
            <input type="range" [(ngModel)]="minPrice" min="0" max="5000" step="50"
              (change)="applyFilters()" class="range-input">
            <div class="range-labels"><span>$0</span><span>$5k+</span></div>
          </div>

          <!-- Category -->
          <div class="filter-section">
            <label>{{ t('PRODUCT_CATEGORIES') }}</label>
            <div class="multi-select-list">
              @for (cat of categories; track cat.id) {
                <label class="toggle-item mini" [class.active]="selectedCategoryIds.includes(cat.id)">
                  <div class="custom-check"></div>
                  <input type="checkbox" [checked]="selectedCategoryIds.includes(cat.id)" (change)="toggleCategory(cat.id)">
                  <div class="toggle-label">{{ cat.name }}</div>
                </label>
              }
            </div>
          </div>

          <!-- Quick toggles -->
          <div class="filter-section">
            <label>{{ t('STATUS_FILTERS') }}</label>
            <div class="toggle-list">
              <label class="toggle-item" [class.active]="onlyInStock">
                <div class="custom-check"></div>
                <input type="checkbox" [(ngModel)]="onlyInStock" (change)="applyFilters()">
                <div class="toggle-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {{ t('IN_STOCK') }}
                </div>
              </label>
              <label class="toggle-item" [class.active]="onlyDiscounted">
                <div class="custom-check"></div>
                <input type="checkbox" [(ngModel)]="onlyDiscounted" (change)="applyFilters()">
                <div class="toggle-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                  {{ t('ON_SALE') }}
                </div>
              </label>
            </div>
          </div>
        </aside>

        <!-- PRODUCTS -->
        <div class="products-area">
          <div class="loading-bar" *ngIf="isLoading">
            <div class="bar-fill"></div>
          </div>

          <div class="product-grid" *ngIf="!isLoading">
            @for (item of sortedProducts; track item.id) {
              <div class="product-card" [routerLink]="['/product', item.id]">
                <div class="card-img-box">
                  <img [src]="item.imageUrl || ''" [alt]="item.name"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                  <div class="img-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
                  </div>
                  <span class="badge-sale" *ngIf="item.isDiscounted">{{ item.discountPercentage }}% {{ t('OFF') }}</span>
                  <span class="badge-out" *ngIf="item.stock === 0">{{ t('OUT_OF_STOCK') }}</span>
                </div>
                <div class="card-body">
                  <p class="card-name">{{ item.name }}</p>
                  <div class="price-row">
                    @if (item.isDiscounted && item.discountPercentage) {
                      <div class="pricing-group">
                        <span class="old-price">{{ item.price | currency }}</span>
                        <span class="card-price discounted">{{ item.price * (1 - (item.discountPercentage || 0) / 100) | currency }}</span>
                      </div>
                    } @else {
                      <span class="card-price">{{ item.price | currency }}</span>
                    }
                    <span class="stock-dot" [class.out]="item.stock === 0">
                       {{ item.stock > 0 ? item.stock + ' ' + t('UNITS') : t('EMPTY') }}
                    </span>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <div class="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
                <h3>{{ t('NO_PRODUCTS_FOUND') }}</h3>
                <p>{{ t('MODIFY_SEARCH') }}</p>
                <button class="cyber-button" (click)="clearAll()">{{ t('RESET_FILTERS') }}</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shop-page { padding: 1.5rem 0; }
    .shop-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; gap: 2rem; flex-wrap: wrap; }
    .shop-header h1 { font-size: 2.8rem; font-weight: 950; background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; margin: 0; letter-spacing: -2px; }
    .result-count { color: var(--text-muted); font-size: 0.8rem; font-family: var(--font-mono); font-weight: 800; letter-spacing: 1px; margin-top: 8px; }
    
    .sort-wrapper { position: relative; display: flex; align-items: center; flex: 1; }
    .icon-left { position: absolute; left: 16px; color: var(--primary); pointer-events: none; opacity: 0.8; z-index: 10; margin: 0; }
    .sort-wrapper select { padding: 14px 16px 14px 48px; width: 100%; min-width: 240px; border-radius: 14px; font-weight: 800; cursor: pointer; border: 2px solid var(--border); font-size: 0.85rem; appearance: none; background: var(--bg-card); color: var(--text); transition: all 0.2s; margin-bottom: 0px; }
    .sort-wrapper select:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(108,99,255,0.1); }
    .sort-wrapper:after { content: ''; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--text-muted); pointer-events: none; }

    .shop-layout { display: grid; grid-template-columns: 320px 1fr; gap: 3.5rem; align-items: start; }

    .filter-sidebar { background: var(--bg-card); border: 2px solid var(--border); border-radius: 28px; padding: 2.5rem; box-shadow: var(--shadow-sm); position: sticky; top: 100px; }
    .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
    .sidebar-header h3 { font-size: 0.75rem; font-weight: 900; color: var(--text-muted); letter-spacing: 2px; display: flex; align-items: center; gap: 12px; }
    .clear-btn { background: none; border: none; color: var(--primary); font-size: 0.75rem; font-weight: 900; cursor: pointer; letter-spacing: 1px; }

    .filter-section { margin-bottom: 2.5rem; }
    .filter-section label:first-child { display: block; font-size: 0.7rem; font-weight: 900; color: var(--text-muted); margin-bottom: 14px; letter-spacing: 1.5px; }

    .search-row { position: relative; width: 100%; display: flex; }
    .search-row input { width: 100%; padding: 14px 64px 14px 20px; border-radius: 16px; border: 2px solid var(--border); font-weight: 650; font-size: 0.95rem; color: var(--text); transition: all 0.2s; background: var(--bg-alt); margin-bottom: 0px; }
    .search-row input:focus { border-color: var(--primary); background: var(--bg-card); outline: none; box-shadow: 0 0 0 4px rgba(108,99,255,0.1); }
    .search-trigger { position: absolute; right: 8px; top: 8px; bottom: 8px; width: 44px; background: var(--grad-primary); border: none; border-radius: 12px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(108,99,255,0.25); z-index: 5; margin: 0; }
    .search-trigger:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(108,99,255,0.35); }

    .range-input { width: 100%; margin: 15px 0 10px; accent-color: var(--primary); cursor: pointer; height: 6px; }
    .range-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); font-weight: 800; font-family: var(--font-mono); }

    .multi-select-list, .toggle-list { display: flex; flex-direction: column; gap: 12px; }
    
    .toggle-item { display: flex; align-items: center; cursor: pointer; padding: 16px 20px; border-radius: 16px; border: 2px solid var(--border); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; gap: 16px; }
    .toggle-item.mini { padding: 10px 16px; border-radius: 12px; gap: 12px; }
    .toggle-item:hover { border-color: rgba(108,99,255,0.4); background: rgba(108,99,255,0.01); }
    .toggle-item.active { border-color: var(--primary); background: rgba(108,99,255,0.06); box-shadow: 0 8px 24px rgba(108,99,255,0.08); }
    
    .toggle-item input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
    
    .custom-check { width: 22px; height: 22px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; transition: all 0.2s; flex-shrink: 0; position: relative; }
    .toggle-item.mini .custom-check { width: 18px; height: 18px; border-radius: 6px; }
    
    .toggle-item.active .custom-check { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 10px rgba(108,99,255,0.5); }
    .toggle-item.active .custom-check:after { content: ''; position: absolute; left: 6px; top: 2px; width: 5px; height: 10px; border: solid white; border-width: 0 2.5px 2.5px 0; transform: rotate(45deg); }
    .toggle-item.mini.active .custom-check:after { left: 4.5px; top: 1.5px; width: 4px; height: 8px; border-width: 0 2px 2px 0; }

    .toggle-label { font-size: 0.9rem; font-weight: 800; display: flex; align-items: center; gap: 12px; color: var(--text-muted); transition: color 0.2s; }
    .toggle-item.active .toggle-label { color: var(--primary); }
    .toggle-item svg { transition: transform 0.2s; }
    .toggle-item.active svg { transform: scale(1.1); }

    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2.5rem; }
    .product-card { background: var(--bg-card); border: 2px solid var(--border); border-radius: 28px; overflow: hidden; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--shadow-sm); }
    .product-card:hover { transform: translateY(-12px); border-color: var(--primary); box-shadow: 0 30px 60px rgba(0,0,0,0.1); }

    .card-img-box { position: relative; height: 260px; background: transparent; overflow: hidden; padding: 10px; }
    .card-img-box img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
    .product-card:hover .card-img-box img { transform: scale(1.12); }
    .img-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #e2e8f0; }

    .badge-sale { position: absolute; top: 20px; right: 20px; background: var(--grad-accent); color: white; padding: 6px 14px; border-radius: 30px; font-weight: 950; font-size: 0.75rem; box-shadow: 0 8px 20px rgba(255,0,127,0.3); font-family: var(--font-mono); }
    .badge-out { position: absolute; inset: 0; background: var(--bg-dark-card); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-weight: 950; color: var(--error); letter-spacing: 2px; font-size: 0.9rem; text-transform: uppercase; }

    .card-body { padding: 2rem; }
    .card-name { font-size: 1.1rem; font-weight: 850; margin-bottom: 12px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.5px; }
    .price-row { display: flex; justify-content: space-between; align-items: center; }
    .card-price { font-size: 1.4rem; font-weight: 950; color: var(--text); letter-spacing: -1px; }
    .card-price.discounted { color: var(--primary); }
    .old-price { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); text-decoration: line-through; opacity: 0.6; }
    .pricing-group { display: flex; align-items: baseline; gap: 8px; }
    .stock-dot { font-size: 0.7rem; color: var(--success); font-weight: 900; background: rgba(16,185,129,0.08); padding: 6px 14px; border-radius: 30px; letter-spacing: 1px; font-family: var(--font-mono); }
    .stock-dot.out { color: var(--error); background: rgba(239,68,68,0.08); }

    .empty-state { grid-column: 1/-1; text-align: center; padding: 8rem 0; }
    .empty-icon { color: rgba(0,0,0,0.03); margin-bottom: 2.5rem; }
    .empty-state h3 { font-weight: 950; font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-muted); }
    .empty-state p { margin-bottom: 2.5rem; color: var(--text-muted); font-weight: 600; }
    
    @media (max-width: 1200px) {
      .shop-page { padding: 1.5rem 1.5rem; }
    }
    
    @media (max-width: 1024px) {
      .shop-layout { grid-template-columns: 1fr; gap: 2.5rem; }
      .filter-sidebar { position: static; max-width: 100%; padding: 2rem; }
      .shop-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
      .sort-bar { width: 100%; }
      .sort-wrapper { width: 100%; }
      .sort-wrapper select { width: 100%; }
    }
    
    @media (max-width: 768px) {
      .shop-page { padding: 1rem 0; }
      .shop-header h1 { font-size: 2rem; letter-spacing: -1px; }
      .product-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }
      .card-img-box { height: 210px; }
      .card-body { padding: 1.25rem; }
    }

    @media (max-width: 480px) {
      .shop-header h1 { font-size: 1.6rem; line-height: 1.2; }
      .filter-sidebar { padding: 1.5rem; border-radius: 20px; }
      .sidebar-header { margin-bottom: 1.5rem; }
      .search-row input { padding: 12px 56px 12px 16px; font-size: 0.9rem; }
      .search-trigger { width: 40px; }
      .product-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .card-img-box { height: 260px; }
      .card-body { padding: 1.25rem; }
      .price-row { flex-direction: column; align-items: flex-start; gap: 12px; }
      .stock-dot { align-self: flex-start; }
    }
  `]
})
export class ProductListingComponent implements OnInit {
  allProducts: Product[] = [];
  products: Product[] = [];
  sortedProducts: Product[] = [];
  categories: any[] = [];
  isLoading = false;

  // Filter state
  searchKeyword = '';
  minPrice = 0;
  selectedCategoryIds: number[] = [];
  onlyInStock = false;
  onlyDiscounted = false;
  sortBy = '';

  private langService = inject(LanguageService);

  constructor(private userService: UserService, private adminService: AdminService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadCategories();
    this.loadAll();
  }

  loadCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (res) => this.categories = res.data || [],
      error: () => {}
    });
  }

  loadAll() {
    this.isLoading = true;
    this.userService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts = res.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  toggleCategory(id: number) {
    const index = this.selectedCategoryIds.indexOf(id);
    if (index > -1) this.selectedCategoryIds.splice(index, 1);
    else this.selectedCategoryIds.push(id);
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allProducts];

    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(kw) || (p.description || '').toLowerCase().includes(kw));
    }

    if (this.minPrice > 0) {
      result = result.filter(p => p.price >= this.minPrice);
    }

    if (this.selectedCategoryIds.length > 0) {
      result = result.filter(p => this.selectedCategoryIds.includes(p.categoryId));
    }

    if (this.onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    if (this.onlyDiscounted) {
      result = result.filter(p => p.isDiscounted);
    }

    this.products = result;
    this.applySort();
  }

  applySort() {
    let sorted = [...this.products];
    if (this.sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (this.sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (this.sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    this.sortedProducts = sorted;
  }

  clearAll() {
    this.searchKeyword = '';
    this.minPrice = 0;
    this.selectedCategoryIds = [];
    this.onlyInStock = false;
    this.onlyDiscounted = false;
    this.sortBy = '';
    this.applyFilters();
  }
}
