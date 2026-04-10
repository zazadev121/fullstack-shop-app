import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-page">
      <div class="header-section">
        <h1 class="glitch-text">{{ t('MY_ORDERS') }}</h1>
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
      
      <div class="orders-column" *ngIf="!isLoading">
        @for (order of orders; track order.id) {
          <div class="order-card glass-panel" [class.cancelled]="order.status === 3">
            <div class="order-header">
              <div class="order-id">
                <span class="label">{{ t('ORDER_ID') }}</span>
                <span class="value">#{{ order.id }}</span>
              </div>
              <div class="status-badge" [ngClass]="getStatusClass(order.status)">
                <span class="pulse-dot"></span>
                {{ getTranslatedStatus(order.status) }}
              </div>
            </div>
            
            <div class="order-body">
              <div class="amount-info">
                <label>{{ t('TOTAL_AMOUNT') }}</label>
                <p class="final-amount">{{ order.totalAmount | currency }}</p>
              </div>

              <!-- Order Items Section -->
              <div class="items-list-container">
                <label class="items-label">Ordered Items</label>
                <ul class="items-list">
                  @for (item of order.orderItems; track item.productId) {
                    <li>
                      <span class="item-dot"></span>
                      <span class="item-name">{{ item.productName }}</span>
                      <span class="item-qty">x{{ item.quantity }}</span>
                      <span class="item-price">{{ (item.price || item.priceAtTimeOfOrder) | currency }}</span>
                    </li>
                  }
                </ul>
              </div>
              
              <div class="order-actions" *ngIf="order.status === 0">
                <button class="cyber-button pink small" (click)="startCancel(order)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  {{ t('REMOVE') }}
                </button>
              </div>
            </div>
            <div class="order-footer">
              <span class="timestamp">{{ t('ESTIMATED_DELIVERY') }}</span>
            </div>
          </div>
        } @empty {
          <div class="empty-state glass-panel">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m3 6 9 6 9-6"/><path d="M15 22h6"/><path d="M19 18l3 3-3 3"/><path d="M15 14h3l2 2"/></svg>
            <h3>{{ t('NO_ORDERS') }}</h3>
            <p>{{ t('MODIFY_SEARCH') }}</p>
            <a routerLink="/products" class="cyber-button">{{ t('START_SHOPPING') }}</a>
          </div>
        }
      </div>

      <!-- CANCEL MODAL -->
      <div class="modal-overlay" *ngIf="showCancelModal">
        <div class="cyber-modal glass-panel animate-glitch">
            <h3 class="glitch-text">{{ t('REMOVE') }}?</h3>
            <p class="warning-text">{{ t('CANCEL_ORDER_CONFIRM') }} <span class="highlight">#{{ orderToCancel?.id }}</span>?</p>
            <p class="sub-text">{{ t('PERMANENT_ACTION') }}</p>
            <div class="modal-actions">
                <button class="cyber-button pink" (click)="confirmCancel()">{{ t('REMOVE') }}</button>
                <button class="cyber-button" (click)="showCancelModal = false">{{ t('BACK_TO_SHOP') }}</button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page { padding: 2rem 0; max-width: 850px; margin: 0 auto; }
    .header-section { margin-bottom: 4rem; text-align: center; }
    .glitch-text { font-size: 3rem; font-weight: 950; letter-spacing: -1.5px; background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-weight: 600; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 1.5px; }

    .message-banner { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 16px; padding: 14px 24px; color: var(--success); font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; margin-bottom: 3rem; animation: slideIn 0.3s ease-out; width: fit-content; margin-left: auto; margin-right: auto; }
    @keyframes slideIn { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .orders-column { display: flex; flex-direction: column; gap: 2rem; }
    
    .order-card { padding: 2.5rem; border-radius: 28px; background: var(--bg-card); border: 2.5px solid var(--border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .order-card:hover { transform: translateX(10px); border-color: var(--primary); box-shadow: 0 15px 40px rgba(0,0,0,0.06); }
    .order-card.cancelled { opacity: 0.7; border-color: var(--border); }
    .order-card.cancelled:hover { transform: none; }

    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1.5px dashed var(--border); }
    .order-id { display: flex; flex-direction: column; gap: 4px; }
    .order-id .label { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 1px; }
    .order-id .value { font-size: 1.4rem; font-weight: 950; color: var(--text); }

    .status-badge { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 12px; font-weight: 900; font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 1px; border: 2px solid transparent; }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; }
    
    .status-badge.pending { background: rgba(245,158,11,0.06); color: #f59e0b; border-color: rgba(245,158,11,0.15); }
    .status-badge.pending .pulse-dot { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; animation: pulse 2s infinite; }
    
    .status-badge.shipped { background: rgba(108,99,255,0.06); color: var(--primary); border-color: rgba(108,99,255,0.15); }
    .status-badge.shipped .pulse-dot { background: var(--primary); box-shadow: 0 0 8px var(--primary); animation: pulse 2s infinite; }
    
    .status-badge.delivered { background: rgba(16,185,129,0.06); color: var(--success); border-color: rgba(16,185,129,0.15); }
    .status-badge.delivered .pulse-dot { background: var(--success); box-shadow: 0 0 8px var(--success); }
    
    .status-badge.cancelled { background: rgba(239,68,68,0.06); color: var(--error); border-color: rgba(239,68,68,0.15); }
    .status-badge.cancelled .pulse-dot { background: var(--error); }

    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }

    .order-body { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem; }
    
    .amount-info { padding: 1.5rem; background: rgba(108,99,255,0.03); border-radius: 16px; border: 1.5px solid var(--border); display: inline-block; width: fit-content; }
    .amount-info label { display: block; font-size: 0.7rem; font-weight: 950; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px; font-family: var(--font-mono); }
    .final-amount { font-size: 2rem; font-weight: 950; color: var(--primary); letter-spacing: -1.5px; line-height: 1; }
    
    .items-list-container { flex: 1; }
    .items-label { display: block; font-size: 0.7rem; font-weight: 950; color: var(--text-muted); margin-bottom: 12px; letter-spacing: 1px; font-family: var(--font-mono); text-transform: uppercase; }
    .items-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .items-list li { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: var(--text); padding: 8px 12px; background: var(--bg-alt); border-radius: 10px; border: 1px solid var(--border); }
    .item-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); opacity: 0.6; }
    .item-name { font-weight: 600; flex: 1; }
    .item-qty { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; min-width: 40px; }
    .item-price { font-weight: 700; color: var(--text); font-family: var(--font-mono); }

    .order-actions { margin-top: 1rem; align-self: flex-start; }
    .order-actions .cyber-button.small { padding: 12px 22px; font-size: 0.8rem; font-weight: 950; gap: 10px; display: flex; align-items: center; }

    .order-footer { border-top: 1.5px solid var(--border); padding-top: 1.5rem; }
    .timestamp { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 700; letter-spacing: 0.5px; opacity: 0.7; }

    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 10rem 0; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

    .empty-state { text-align: center; padding: 8rem 3rem; border-radius: 36px; border: 2.5px dashed var(--border); color: var(--text-muted); background: var(--bg-alt); }
    .empty-state svg { color: var(--text-muted); opacity: 0.05; margin-bottom: 2.5rem; }
    .empty-state h3 { font-size: 1.5rem; font-weight: 950; margin-bottom: 1rem; letter-spacing: -0.5px; color: var(--text); }

    /* MODAL */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .cyber-modal { width: 90%; max-width: 500px; padding: 4rem; text-align: center; border: 3px solid var(--neon-pink); background: var(--bg-card); border-radius: 32px; box-shadow: 0 0 50px rgba(255,0,127,0.15); }
    .warning-text { color: var(--text); margin: 2rem 0; font-size: 1.2rem; font-weight: 800; line-height: 1.5; }
    .highlight { color: var(--neon-pink); font-weight: 950; text-decoration: underline; }
    .sub-text { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-bottom: 2.5rem; font-weight: 700; }
    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    
    @keyframes glitch { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
    .animate-glitch { animation: glitch 0.3s infinite linear; animation-play-state: paused; }
    .animate-glitch:hover { animation-play-state: running; }

    @media (max-width: 600px) {
      .order-body { flex-direction: column; align-items: center; gap: 2rem; text-align: center; }
      .order-header { flex-direction: column; gap: 1.5rem; text-align: center; }
      .amount-info { width: 100%; }
      .order-actions { width: 100%; }
      .order-actions .cyber-button { width: 100%; justify-content: center; }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  actionMsg = '';
  
  showCancelModal = false;
  orderToCancel: Order | null = null;

  private langService = inject(LanguageService);

  constructor(private userService: UserService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  getTranslatedStatus(status: number): string {
     switch(status) {
       case OrderStatus.Pending: return this.t('PENDING');
       case OrderStatus.Shipped: return this.t('SHIPPED');
       case OrderStatus.Delivered: return this.t('DELIVERED');
       case OrderStatus.Cancelled: return this.t('CANCELLED');
       default: return 'UNKNOWN';
     }
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.userService.showUserOrders().subscribe({
      next: (res) => { this.orders = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  startCancel(order: Order) {
    this.orderToCancel = order;
    this.showCancelModal = true;
  }

  confirmCancel() {
    if (!this.orderToCancel) return;
    this.userService.deleteOrder(this.orderToCancel.id).subscribe({
      next: (res) => {
        this.actionMsg = res.message || this.t('CHECKOUT_SUCCESS');
        this.loadOrders();
        this.showCancelModal = false;
        setTimeout(() => this.actionMsg = '', 4000);
      },
      error: (err) => {
        this.actionMsg = this.t('NO_PRODUCTS_FOUND'); // Fallback
        this.showCancelModal = false;
      }
    });
  }

  getStatusClass(status: number): string {
    switch(status) {
      case OrderStatus.Pending: return 'pending';
      case OrderStatus.Shipped: return 'shipped';
      case OrderStatus.Delivered: return 'delivered';
      case OrderStatus.Cancelled: return 'cancelled';
      default: return '';
    }
  }
}
