import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div>
          <h1>{{ t('ORDERS') }} {{ t('CATEGORY_MANAGEMENT') }}</h1>
          <p class="subtitle">{{ t('STATS_SUBTITLE') }}</p>
        </div>
        
        <div class="search-box">
          <div class="search-input-wrapper">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
             <input type="number" [(ngModel)]="searchOrderId" placeholder="Search Order ID..." (input)="onSearchChange()">
             <button *ngIf="searchOrderId" (click)="clearSearch()" class="clear-btn">&times;</button>
          </div>
        </div>
      </div>

      <div class="message-banner" *ngIf="actionMsg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>>>> {{ actionMsg }}</span>
      </div>
      
      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>{{ t('LOADING_DEALS') }}</p>
      </div>
      
      <div class="table-container glass-panel" *ngIf="!isLoading">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (o of filteredOrders; track o.id) {
              <tr>
                <td><span class="id-tag">#{{ o.id }}</span></td>
                <td>
                  <div class="user-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {{ o.userName || 'User #' + o.userId }}
                  </div>
                </td>
                <td>
                  <div class="product-mini-list">
                    @for (item of o.orderItems; track item.productId) {
                      <div class="mini-item">
                        <span class="q">{{ item.quantity }}x</span> {{ item.productName }}
                      </div>
                    }
                  </div>
                </td>
                <td><span class="price-text">{{ o.totalAmount | currency }}</span></td>
                <td>
                  <div class="status-badge" [ngClass]="getStatusClass(o.status)">
                    <span class="dot"></span>
                    {{ getStatusName(o.status) }}
                  </div>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="action-btn" *ngIf="o.status === 0" (click)="update(o.id, 1)" [title]="t('SHIPPED')">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14h4"/><path d="M14 10h1"/><path d="M14 18h1"/><path d="M14 22h1"/><path d="M10 22h4"/><path d="M10 18h4"/><path d="M10 10h4"/><path d="m2 10 3 3 3-3"/><path d="m2 14 3-3 3 3"/><rect width="20" height="8" x="2" y="2" rx="2"/></svg>
                      {{ t('SHIPPED') }}
                    </button>
                    <button class="action-btn" *ngIf="o.status === 1" (click)="update(o.id, 2)" [title]="t('DELIVERED')">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      {{ t('DELIVERED') }}
                    </button>
                    <button class="action-btn abort" *ngIf="o.status < 2" (click)="update(o.id, 3)" [title]="t('REMOVE')">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      {{ t('REMOVE') }}
                    </button>
                    <div class="status-locked" *ngIf="o.status === 2">{{ t('DELIVERED') }}</div>
                    <div class="status-locked error" *ngIf="o.status === 3">{{ t('REMOVE') }}</div>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="text-center">{{ t('NO_PRODUCTS_FOUND') }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { max-width: 1100px; padding-bottom: 4rem; }
    .header-section { margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; }
    .header-section h1 { font-size: 2.2rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -1.2px; color: var(--text); }
    .subtitle { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; letter-spacing: 1px; }

    .search-input-wrapper { display: flex; align-items: center; gap: 12px; background: var(--bg-alt); border: 2.5px solid var(--border); border-radius: 16px; padding: 12px 20px; width: 340px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; }
    .search-input-wrapper:focus-within { border-color: #6c63ff; box-shadow: 0 0 20px rgba(108,99,255,0.25), inset 0 0 10px rgba(108,99,255,0.05); transform: translateY(-2px); }
    .search-input-wrapper input { border: none; background: none; font-size: 0.95rem; font-weight: 800; color: var(--text); width: 100%; outline: none; font-family: var(--font-mono); }
    .search-input-wrapper svg { color: var(--text-muted); transition: all 0.3s; }
    .search-input-wrapper:focus-within svg { color: #6c63ff; filter: drop-shadow(0 0 5px rgba(108,99,255,0.5)); transform: scale(1.1); }
    .clear-btn { background: none; border: none; color: var(--text-muted); font-size: 1.4rem; cursor: pointer; padding: 0 4px; line-height: 1; transition: 0.2s; }
    .clear-btn:hover { color: var(--error); transform: rotate(90deg); }

    .message-banner { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 12px; padding: 12px 20px; color: var(--success); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; margin-bottom: 2rem; }

    .table-container { padding: 0; overflow-x: auto; border-radius: 20px; border: 2px solid var(--border); background: var(--bg-card); box-shadow: var(--shadow-sm); }
    .table-container::-webkit-scrollbar { height: 8px; }
    .table-container::-webkit-scrollbar-track { background: var(--bg-alt); border-radius: 0 0 20px 20px; }
    .table-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; border: 2px solid var(--bg-alt); }
    .table-container::-webkit-scrollbar-thumb:hover { background: var(--primary); }

    .cyber-table { width: 100%; border-collapse: collapse; min-width: 900px; }
    .cyber-table th { text-align: left; padding: 1.25rem 1.5rem; background: var(--bg-alt); border-bottom: 2px solid var(--border); font-size: 0.7rem; font-weight: 950; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; font-family: var(--font-mono); }
    .cyber-table td { padding: 1.25rem 1.5rem; border-bottom: 1.5px solid var(--border); vertical-align: middle; }
    .cyber-table tr:last-child td { border-bottom: none; }
    .cyber-table tr:hover td { background: rgba(108,99,255,0.015); }

    .id-tag { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); font-weight: 950; background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 8px; }
    .user-link { display: flex; align-items: center; gap: 8px; color: var(--primary); font-weight: 950; font-size: 0.95rem; font-family: var(--font-mono); }
    .price-text { font-weight: 950; color: var(--text); font-size: 1.1rem; }

    .product-mini-list { display: flex; flex-direction: column; gap: 6px; }
    .mini-item { font-size: 0.85rem; color: var(--text); font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .mini-item .q { font-family: var(--font-mono); font-weight: 900; color: var(--primary); font-size: 0.75rem; background: rgba(108,99,255,0.08); padding: 2px 6px; border-radius: 4px; min-width: 28px; text-align: center; }

    .status-badge { display: inline-flex; align-items: center; gap: 10px; font-size: 0.7rem; font-weight: 950; padding: 6px 14px; border-radius: 30px; font-family: var(--font-mono); letter-spacing: 1px; }
    .status-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    
    .status-badge.pending { background: rgba(245,158,11,0.08); color: #f59e0b; }
    .status-badge.shipped { background: rgba(108,99,255,0.08); color: var(--primary); }
    .status-badge.delivered { background: rgba(16,185,129,0.08); color: var(--success); }
    .status-badge.cancelled { background: rgba(239,68,68,0.08); color: var(--error); }

    .action-btns { display: flex; gap: 8px; justify-content: flex-end; }
    .action-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg-alt); color: var(--text-muted); font-size: 0.75rem; font-weight: 950; cursor: pointer; transition: all 0.2s; font-family: var(--font-display); }
    .action-btn:hover { background: var(--bg-card); border-color: var(--primary); color: var(--primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(108,99,255,0.12); }
    .action-btn.abort:hover { border-color: var(--error); color: var(--error); box-shadow: 0 4px 12px rgba(239,68,68,0.12); }

    .status-locked { font-size: 0.7rem; font-weight: 950; color: var(--success); opacity: 0.8; letter-spacing: 1.5px; font-family: var(--font-mono); border: 1.5px solid transparent; padding: 10px 16px; min-width: 100px; text-align: right; }
    .status-locked.error { color: var(--error); }

    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 10rem 0; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .header-section { flex-direction: column; align-items: stretch; }
      .search-input-wrapper { width: 100%; }
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchOrderId: number | null = null;
  isLoading = true;
  actionMsg = '';

  private langService = inject(LanguageService);

  constructor(private adminService: AdminService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.adminService.getAllOrders().subscribe({
      next: (res) => { 
        this.orders = res.data || []; 
        this.applyFilter();
        this.isLoading = false; 
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSearchChange() {
    this.applyFilter();
  }

  clearSearch() {
    this.searchOrderId = null;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchOrderId) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.id.toString().includes(this.searchOrderId!.toString()));
    }
  }

  update(id: number, status: OrderStatus) {
    this.adminService.updateOrderStatus(id, status).subscribe({
      next: (res) => {
        this.actionMsg = `${this.t('ORDER_UPDATED')} #${id}`;
        this.loadOrders();
        setTimeout(() => this.actionMsg = '', 4000);
      },
      error: () => { this.actionMsg = this.t('ERROR_OCCURRED'); }
    });
  }

  getStatusName(status: number): string {
    switch(status) {
      case 0: return this.t('PENDING');
      case 1: return this.t('SHIPPED');
      case 2: return this.t('DELIVERED');
      case 3: return this.t('REMOVE');
      default: return 'UNKNOWN';
    }
  }

  getStatusClass(status: number): string {
    switch(status) {
      case 0: return 'pending';
      case 1: return 'shipped';
      case 2: return 'delivered';
      case 3: return 'cancelled';
      default: return '';
    }
  }
}
