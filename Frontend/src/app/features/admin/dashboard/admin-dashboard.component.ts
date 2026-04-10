import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Product } from '../../../core/models/product.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <div class="header-section">
        <h1>{{ t('SYSTEM_OVERVIEW') }}</h1>
        <p class="subtitle">{{ t('STATS_SUBTITLE') }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card revenue">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-content">
            <label>{{ t('TOTAL_REVENUE') }}</label>
            <div class="loading-mini" *ngIf="isLoadingRev">...</div>
            <div class="value" *ngIf="!isLoadingRev">{{ totalRevenue | currency }}</div>
          </div>
        </div>

        <div class="stat-card discounts">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
          </div>
          <div class="stat-content">
            <label>{{ t('ACTIVE_DISCOUNTS') }}</label>
            <div class="loading-mini" *ngIf="isLoadingDisc">...</div>
            <div class="value" *ngIf="!isLoadingDisc">{{ discountedCount }}</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-sections">
        <!-- LOW STOCK -->
        <section class="admin-section">
          <div class="section-header">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {{ t('LOW_STOCK_ALERTS') }}
            </h3>
            <div class="threshold-control">
              <span>{{ t('THRESHOLD') }}:</span>
              <input type="number" [(ngModel)]="stockThreshold" (change)="loadLowStock()">
            </div>
          </div>
          
          <div class="loading-state" *ngIf="isLoadingLowStock">{{ t('SCANNING_INVENTORY') }}</div>
          
          <div class="table-container" *ngIf="!isLoadingLowStock">
            <table class="cyber-table">
              <thead><tr><th>ID</th><th>{{ t('PRODUCT') }}</th><th>{{ t('STOCK') }}</th><th>{{ t('REMOVE') }}</th></tr></thead>
              <tbody>
                @for (item of lowStockProducts; track item.id) {
                  <tr>
                    <td><span class="id-tag">#{{ item.id }}</span></td>
                    <td class="entity-name">{{ item.name }}</td>
                    <td><span class="stock-value crit">{{ item.stock }}</span></td>
                    <td><button class="action-btn-sm" [routerLink]="['/admin/products']">{{ t('RESTOCK') }}</button></td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="text-center">{{ t('NO_PRODUCTS_FOUND') }}</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <!-- TOP SELLING -->
        <section class="admin-section">
          <div class="section-header">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              {{ t('BEST_SELLING') }}
            </h3>
          </div>
          <div class="loading-state" *ngIf="isLoadingSales">{{ t('COMPILING_DATA') }}</div>
          <div class="table-container" *ngIf="!isLoadingSales">
            <table class="cyber-table">
              <thead><tr><th>ID</th><th>{{ t('PRODUCT') }}</th><th>{{ t('TOTAL_AMOUNT') }}</th></tr></thead>
              <tbody>
                @for (item of mostSoldProducts; track item.id) {
                  <tr>
                    <td><span class="id-tag">#{{ item.id }}</span></td>
                    <td class="entity-name">{{ item.name }}</td>
                    <td><span class="stock-value">{{ item.stock }}</span></td>
                  </tr>
                } @empty {
                  <tr><td colspan="3" class="text-center">{{ t('NO_PRODUCTS_FOUND') }}</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard { max-width: 1200px; }
    .header-section { margin-bottom: 3.5rem; }
    .header-section h1 { font-size: 2rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -1px; color: var(--text); }
    .subtitle { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; letter-spacing: 1.5px; }

    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem; }
    
    .stat-card { display: flex; align-items: center; gap: 24px; padding: 2rem; border-radius: 24px; border: 2.5px solid var(--border); transition: all 0.3s; background: var(--bg-card); }
    .stat-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: var(--shadow-md); }
    .stat-card.revenue { border-left-width: 6px; border-left-color: var(--success); }
    .stat-card.discounts { border-left-width: 6px; border-left-color: var(--accent-dark); }
    
    .stat-icon { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.03); color: var(--primary); }
    .revenue .stat-icon { background: rgba(16,185,129,0.06); color: var(--success); }
    .discounts .stat-icon { background: rgba(244,114,182,0.06); color: var(--accent-dark); }
    
    .stat-content label { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 900; color: var(--text-muted); letter-spacing: 1.5px; margin-bottom: 6px; }
    .stat-content .value { font-size: 2.2rem; font-weight: 950; color: var(--text); letter-spacing: -1.5px; line-height: 1; }
    
    .dashboard-sections { display: grid; gap: 2.5rem; }
    .admin-section { padding: 0; overflow: hidden; border-radius: 24px; border: 2px solid var(--border); background: var(--bg-card); }
    .section-header { padding: 1.5rem 2rem; background: var(--bg-alt); border-bottom: 2px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .section-header h3 { font-size: 0.95rem; font-weight: 950; display: flex; align-items: center; gap: 12px; margin: 0; color: var(--text); letter-spacing: 1px; font-family: var(--font-display); }
    .section-header h3 svg { color: var(--primary); }
    
    .threshold-control { display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 900; color: var(--text-muted); }
    .threshold-control input { width: 70px; margin: 0; padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--border); font-size: 0.85rem; font-weight: 900; background: var(--bg-card); color: var(--text); }

    .cyber-table { width: 100%; border-collapse: collapse; }
    .cyber-table th { text-align: left; padding: 1.25rem 2rem; background: transparent; border-bottom: 1.5px solid var(--border); font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-mono); }
    .cyber-table td { padding: 1.25rem 2rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
    .cyber-table tr:hover td { background: rgba(108,99,255,0.015); }
    .cyber-table tr:last-child td { border-bottom: none; }

    .id-tag { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); font-weight: 800; background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 8px; }
    .entity-name { font-weight: 900; color: var(--text); font-size: 0.95rem; }
    .stock-value { font-family: var(--font-mono); font-weight: 900; font-size: 1rem; color: var(--text); }
    .stock-value.crit { color: var(--error); background: rgba(239,68,68,0.06); padding: 4px 10px; border-radius: 8px; }

    .action-btn-sm { padding: 6px 12px; font-size: 0.75rem; font-weight: 900; background: var(--grad-primary); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-family: var(--font-mono); letter-spacing: 1px; transition: all 0.2s; }
    .action-btn-sm:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(108,99,255,0.2); }

    .loading-state { padding: 4rem; text-align: center; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .text-center { text-align: center; color: var(--text-muted); padding: 4rem 0; font-weight: 700; font-family: var(--font-mono); }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  totalRevenue = 0;
  discountedCount = 0;
  stockThreshold = 10;
  lowStockProducts: Product[] = [];
  mostSoldProducts: Product[] = [];
  
  isLoadingRev = true;
  isLoadingDisc = true;
  isLoadingLowStock = true;
  isLoadingSales = true;

  private langService = inject(LanguageService);

  constructor(private adminService: AdminService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadRevenue();
    this.loadDiscounts();
    this.loadLowStock();
    this.loadSales();
  }

  loadRevenue() {
    this.adminService.getTotalRevenue().subscribe({
      next: (res) => { this.totalRevenue = res.data || 0; this.isLoadingRev = false; },
      error: () => { this.isLoadingRev = false; }
    });
  }

  loadDiscounts() {
    this.adminService.getAllDiscountedProducts().subscribe({
      next: (res) => { this.discountedCount = (res.data || []).length; this.isLoadingDisc = false; },
      error: () => { this.isLoadingDisc = false; }
    });
  }

  loadLowStock() {
    this.isLoadingLowStock = true;
    this.adminService.getLowStockProducts(this.stockThreshold).subscribe({
      next: (res) => { this.lowStockProducts = res.data || []; this.isLoadingLowStock = false; },
      error: () => { this.isLoadingLowStock = false; }
    });
  }

  loadSales() {
    this.isLoadingSales = true;
    this.adminService.getMostSoldProducts(1).subscribe({
      next: (res) => { this.mostSoldProducts = res.data || []; this.isLoadingSales = false; },
      error: () => { this.isLoadingSales = false; }
    });
  }
}
