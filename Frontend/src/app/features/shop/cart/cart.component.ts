import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cart-page">
      <div class="header-section">
        <h1 class="glitch-text">{{ t('SHOPPING_CART') }}</h1>
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
      
      <div class="cart-layout" *ngIf="!isLoading">
        <div class="items-column">
          @for (item of cartItems; track item.id) {
            <div class="cart-card glass-panel">
              <div class="item-visual">
                <img [src]="item.product?.imageUrl || ''" [alt]="item.product?.name" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="img-ph">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
                </div>
              </div>
              <div class="item-details">
                <div class="item-meta">
                  <h3>{{ item.product?.name }}</h3>
                  <div class="pricing-group" *ngIf="item.product">
                    @if (item.product.isDiscounted && item.product.discountPercentage) {
                      <span class="old-price">{{ item.product.price | currency }}</span>
                      <span class="unit-price discounted">{{ item.product.price * (1 - item.product.discountPercentage / 100) | currency }} / {{ t('UNITS') }}</span>
                    } @else {
                      <span class="unit-price">{{ item.product.price | currency }} / {{ t('UNITS') }}</span>
                    }
                  </div>
                </div>
                <div class="item-controls">
                  <div class="qty-stepper">
                     <button (click)="stepQty(item, -1)">-</button>
                     <input type="number" [(ngModel)]="item.quantity" min="1" (change)="updateQuantity(item)">
                     <button (click)="stepQty(item, 1)">+</button>
                  </div>
                  <button class="remove-btn" (click)="removeItem(item.productId)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="empty-state glass-panel">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <h3>{{ t('CART_EMPTY') }}</h3>
              <p>{{ t('MODIFY_SEARCH') }}</p>
              <a routerLink="/products" class="cyber-button">{{ t('START_SHOPPING') }}</a>
            </div>
          }
        </div>
        
        <div class="summary-column" *ngIf="cartItems.length > 0">
          <div class="summary-card glass-panel">
            <h4>{{ t('ORDER_SUMMARY') }}</h4>
            <div class="summary-row">
              <span>{{ t('ITEMS') }}</span>
              <span>{{ cartItems.length }}</span>
            </div>
            <div class="summary-row">
              <span>{{ t('DISCOUNT_APPLIED') }}</span>
              <span>$0.00</span>
            </div>
            <div class="divider"></div>
            <div class="total-row">
              <label>{{ t('TOTAL_AMOUNT') }}</label>
              <div class="price-box">
                <span class="currency">$</span>
                <span class="amount">{{ calculateTotal() }}</span>
              </div>
            </div>
            <button class="cyber-button full-width" [disabled]="isOrderLoading" (click)="placeOrder()">
              {{ isOrderLoading ? t('PLEASE_WAIT') : t('PROCEED_CHECKOUT') }}
            </button>
            <p class="disclaimer">{{ t('DELIVERY_DESC') }}</p>
          </div>
        </div>
      </div>

      <!-- PAYMENT MODAL -->
      <div class="modal-overlay" *ngIf="showPaymentModal">
        <div class="payment-modal glass-panel">
          <div class="modal-header">
            <h3>{{ t('PAYMENT_METHOD') }}</h3>
            <button class="close-btn" (click)="showPaymentModal = false">&times;</button>
          </div>
          
          <div class="card-preview animate-float">
            <div class="card-chip"></div>
            <div class="card-number">{{ formatCardNumber(paymentForm.number) || 'XXXX XXXX XXXX XXXX' }}</div>
            <div class="card-info">
              <div class="holder">
                <label>HOLDER</label>
                <p>{{ paymentForm.holder || 'YOUR NAME' }}</p>
              </div>
              <div class="expiry">
                <label>VALID THRU</label>
                <p>{{ paymentForm.expiry || 'MM/YY' }}</p>
              </div>
            </div>
          </div>

          <div class="payment-form">
            <div class="input-group">
              <label>CARD NUMBER</label>
              <input type="text" 
                     [value]="formatCardNumber(paymentForm.number)" 
                     (input)="onCardNumberChange($event)"
                     placeholder="0000-0000-0000-0000">
            </div>
            
            <div class="input-group">
              <label>CARD HOLDER</label>
              <input type="text" [(ngModel)]="paymentForm.holder" placeholder="FULL NAME">
            </div>

            <div class="row">
              <div class="input-group">
                <label>EXPIRY DATE</label>
                <input type="text" 
                       [value]="formatExpiry(paymentForm.expiry)"
                       (input)="onExpiryChange($event)"
                       placeholder="MM/YY">
              </div>
              <div class="input-group">
                <label>CVV</label>
                <input type="text" 
                       [value]="paymentForm.cvv"
                       (input)="onCvvChange($event)"
                       placeholder="000">
              </div>
            </div>

            <button class="cyber-button full-width" [disabled]="!isFormValid() || isOrderLoading" (click)="confirmPayment()">
               {{ isOrderLoading ? t('PLEASE_WAIT') : 'SECURE PAY NOW' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { padding: 2rem 0; max-width: 1100px; margin: 0 auto; }
    .header-section { margin-bottom: 3rem; text-align: center; }
    .glitch-text { font-size: 3rem; font-weight: 950; letter-spacing: -1.5px; background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-weight: 600; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 1px; }

    .message-banner { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 16px; padding: 14px 24px; color: var(--success); font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; margin-bottom: 2.5rem; animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .cart-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2.5rem; align-items: start; }
    
    .items-column { display: flex; flex-direction: column; gap: 1.5rem; }
    .cart-card { display: flex; align-items: center; gap: 24px; padding: 1.5rem; border-radius: 20px; transition: all 0.3s; background: var(--bg-card); border: 2px solid var(--border); }
    .cart-card:hover { transform: translateX(8px); border-color: var(--primary); background: var(--bg-card); }
    
    .item-visual { width: 100px; height: 100px; border-radius: 14px; overflow: hidden; background: transparent; position: relative; flex-shrink: 0; border: 1.5px solid var(--border); padding: 5px; }
    .item-visual img { width: 100%; height: 100%; object-fit: contain; z-index: 2; position: relative; }
    .img-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--text-muted); opacity: 0.3; }
    
    .item-details { flex-grow: 1; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
    .item-meta h3 { font-size: 1.15rem; font-weight: 850; margin: 0 0 6px; letter-spacing: -0.5px; color: var(--text); }
    .unit-price { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.5px; }
    .unit-price.discounted { color: var(--primary); }
    .old-price { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-decoration: line-through; opacity: 0.6; }
    .pricing-group { display: flex; align-items: baseline; gap: 8px; }
    
    .item-controls { display: flex; align-items: center; gap: 24px; }
    .qty-stepper { display: flex; align-items: center; background: var(--bg-alt); border-radius: 12px; padding: 4px; border: 1.5px solid var(--border); }
    .qty-stepper button { width: 32px; height: 32px; border: none; background: transparent; color: var(--text); font-weight: 950; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; }
    .qty-stepper button:hover { background: var(--bg-card); color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .qty-stepper input { width: 45px; border: none; background: transparent; text-align: center; font-weight: 900; font-size: 1rem; color: var(--text); appearance: textfield; margin: 0; }
    .qty-stepper input::-webkit-outer-spin-button, .qty-stepper input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    .remove-btn { background: rgba(239,68,68,0.06); border: 2px solid rgba(239,68,68,0.1); color: var(--error); width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .remove-btn:hover { background: var(--error); color: #fff; border-color: var(--error); transform: scale(1.05); }

    .summary-column { position: sticky; top: 100px; }
    .summary-card { padding: 2.5rem; border-radius: 28px; background: var(--bg-card); border: 2.5px solid var(--border); box-shadow: var(--shadow-md); }
    .summary-card h4 { font-family: var(--font-mono); font-size: 0.8rem; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 2rem; border-bottom: 1.5px solid var(--border); padding-bottom: 1rem; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
    .divider { height: 1.5px; background: var(--border); margin: 1.5rem 0; border-style: dashed; }
    .total-row { margin-bottom: 2rem; }
    .total-row label { display: block; font-size: 0.7rem; font-weight: 900; color: var(--primary); letter-spacing: 1.5px; margin-bottom: 12px; }
    .price-box { display: flex; align-items: baseline; gap: 4px; }
    .currency { font-size: 1.5rem; font-weight: 900; color: var(--text); }
    .amount { font-size: 3rem; font-weight: 950; color: var(--text); letter-spacing: -2px; }
    .full-width { width: 100%; padding: 18px; font-size: 1rem; font-weight: 950; }
    .disclaimer { margin-top: 1.5rem; font-size: 0.7rem; color: var(--text-muted); line-height: 1.5; font-weight: 600; }

    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 8rem 0; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state { text-align: center; padding: 6rem 3rem; border-radius: 28px; border: 2.5px dashed var(--border); color: var(--text-muted); background: var(--bg-alt); }
    .empty-state svg { color: var(--text-muted); opacity: 0.1; margin-bottom: 2.5rem; }
    .empty-state h3 { font-size: 1.5rem; font-weight: 950; margin-bottom: 1rem; letter-spacing: -0.5px; color: var(--text); }
    .empty-state p { margin-bottom: 2.5rem; font-weight: 600; line-height: 1.6; }

    /* MODAL & PAYMENT */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .payment-modal { width: 90%; max-width: 450px; padding: 2.5rem; border-radius: 32px; background: var(--bg-card); border: 2.5px solid var(--border); box-shadow: 0 25px 60px rgba(0,0,0,0.2); position: relative; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
    .modal-header h3 { font-size: 1.25rem; font-weight: 950; letter-spacing: -0.5px; }
    .close-btn { background: none; border: none; font-size: 2rem; color: var(--text-muted); cursor: pointer; line-height: 1; transition: 0.2s; }
    .close-btn:hover { color: var(--error); transform: scale(1.1); }

    .card-preview { height: 200px; border-radius: 20px; background: linear-gradient(60deg, #6c63ff, #ff007f); padding: 2rem; color: #fff; display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 2.5rem; box-shadow: 0 15px 35px rgba(108,99,255,0.3); position: relative; overflow: hidden; }
    .card-preview::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); pointer-events: none; }
    .card-chip { width: 45px; height: 35px; background: linear-gradient(135deg, #ffd700, #b8860b); border-radius: 6px; }
    .card-number { font-family: var(--font-mono); font-size: 1.4rem; font-weight: 950; letter-spacing: 2.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .card-info { display: flex; justify-content: space-between; align-items: flex-end; }
    .card-info label { font-size: 0.6rem; opacity: 0.7; font-weight: 800; letter-spacing: 1px; display: block; margin-bottom: 4px; }
    .card-info p { font-size: 0.9rem; font-weight: 900; margin: 0; font-family: var(--font-mono); }

    .payment-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .input-group label { display: block; font-size: 0.65rem; font-weight: 950; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px; font-family: var(--font-mono); }
    .input-group input { width: 100%; background: var(--bg-alt); border: 2px solid var(--border); border-radius: 12px; padding: 12px 16px; color: var(--text); font-weight: 700; font-family: var(--font-mono); transition: 0.2s; outline: none; }
    .input-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(108,99,255,0.1); }
    .payment-form .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

    @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }
    .animate-float { animation: float 4s ease-in-out infinite; }

    @media (max-width: 600px) {
      .cart-layout { grid-template-columns: 1fr; }
      .summary-column { position: static; }
      .cart-card { flex-direction: column; gap: 1.5rem; text-align: center; }
      .item-details { flex-direction: column; width: 100%; }
      .item-controls { width: 100%; justify-content: center; }
      .payment-modal { padding: 1.5rem; width: 95%; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = true;
  isOrderLoading = false;
  actionMsg = '';
  
  showPaymentModal = false;
  paymentForm = { number: '', holder: '', expiry: '', cvv: '' };

  private langService = inject(LanguageService);

  constructor(private userService: UserService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.userService.showUserCart().subscribe({
      next: (res) => { this.cartItems = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  stepQty(item: CartItem, delta: number) {
    if (item.quantity + delta < 1) return;
    item.quantity += delta;
    this.updateQuantity(item);
  }

  updateQuantity(item: CartItem) {
    if (item.quantity < 1) item.quantity = 1;
    this.userService.updateCart(item.productId, item.quantity).subscribe({
      next: () => { this.actionMsg = this.t('CHECKOUT_SUCCESS'); setTimeout(()=>this.actionMsg='', 3000); }
    });
  }

  removeItem(productId: number) {
    this.userService.removeFromCart(productId).subscribe({
      next: () => { this.loadCart(); this.actionMsg = this.t('REMOVE'); setTimeout(()=>this.actionMsg='', 3000); }
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => {
      const price = (item.product?.isDiscounted && item.product?.discountPercentage)
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : (item.product?.price || 0);
      return acc + (item.quantity * price);
    }, 0);
  }

  placeOrder() {
    this.showPaymentModal = true;
  }

  confirmPayment() {
    if (!this.isFormValid()) return;
    
    this.isOrderLoading = true;
    this.userService.createOrder().subscribe({
      next: (res) => {
        this.actionMsg = this.t('CHECKOUT_SUCCESS');
        this.cartItems = [];
        this.isOrderLoading = false;
        this.showPaymentModal = false;
      },
      error: (err) => {
        this.actionMsg = this.t('NO_PRODUCTS_FOUND');
        this.isOrderLoading = false;
        this.showPaymentModal = false;
      }
    });
  }

  onCardNumberChange(event: any) {
    const raw = event.target.value.replace(/\D/g, '').substring(0, 16);
    this.paymentForm.number = raw;
    event.target.value = this.formatCardNumber(raw);
  }

  onExpiryChange(event: any) {
    const raw = event.target.value.replace(/\D/g, '').substring(0, 4);
    this.paymentForm.expiry = raw;
    event.target.value = this.formatExpiry(raw);
  }

  onCvvChange(event: any) {
    const raw = event.target.value.replace(/\D/g, '').substring(0, 3);
    this.paymentForm.cvv = raw;
    event.target.value = raw;
  }

  formatCardNumber(num: string): string {
    if (!num) return '';
    const parts = num.match(/.{1,4}/g);
    return parts ? parts.join('-') : num;
  }

  formatExpiry(dic: string): string {
    if (!dic) return '';
    if (dic.length > 2) {
      return dic.substring(0, 2) + '/' + dic.substring(2, 4);
    }
    return dic;
  }

  isFormValid(): boolean {
    return this.paymentForm.number.length === 16 && 
           this.paymentForm.expiry.length === 4 && 
           this.paymentForm.cvv.length === 3 && 
           this.paymentForm.holder.length >= 3;
  }
}
