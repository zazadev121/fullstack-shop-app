import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { UserService } from '../../../core/services/user.service';
import { Product } from '../../../core/models/product.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div>
          <h1>{{ t('PRODUCT_INVENTORY') }}</h1>
          <p class="subtitle">{{ t('STATS_SUBTITLE') }}</p>
        </div>
        <button class="cyber-button" (click)="openForm()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ t('ADD_NEW_PRODUCT') }}
        </button>
      </div>
      
      <div class="message-banner" *ngIf="actionMsg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>>>> {{ actionMsg }}</span>
      </div>
      
      <!-- ENTITY FORM -->
      <div class="modal-overlay" *ngIf="isFormOpen">
        <div class="cyber-modal glass-panel form-modal">
          <h3 class="modal-title">{{ editingId ? t('UPDATE_PRODUCT') : t('CREATE_PRODUCT') }}</h3>
          <p class="modal-sub">{{ t('STATS_SUBTITLE') }}</p>
          
          <form (ngSubmit)="saveEntity()" class="tactical-form">
            <div class="form-grid">
              <div class="form-field">
                <label>{{ t('PRODUCT') }}</label>
                <input type="text" [(ngModel)]="currentData.name" name="name" required [placeholder]="t('PRODUCT')">
              </div>
              <div class="form-field">
                <label>{{ t('PRICE') }} ($)</label>
                <input type="number" [(ngModel)]="currentData.price" name="price" required>
              </div>
              <div class="form-field">
                <label>{{ t('STOCK') }}</label>
                <input type="number" [(ngModel)]="currentData.stock" name="stock" required>
              </div>
              <div class="form-field">
                <label>{{ t('CATEGORY') }} ID</label>
                <input type="number" [(ngModel)]="currentData.categoryId" name="categoryId" required>
              </div>
              <div class="form-field full">
                <label>{{ t('ENTITY_THUMB') }} URL</label>
                <input type="text" [(ngModel)]="currentData.imageUrl" name="imageUrl" required placeholder="Paste image link here">
              </div>
              <div class="form-field full">
                <label>{{ t('DETAILS') }}</label>
                <textarea [(ngModel)]="currentData.description" name="description" rows="3" [placeholder]="t('DETAILS')"></textarea>
              </div>
            </div>
            <div class="modal-actions">
              <button type="submit" class="cyber-button">{{ t('SAVE_WISHLIST') }}</button>
              <button type="button" class="cyber-button pink" (click)="closeForm()">{{ t('RESET') }}</button>
            </div>
          </form>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>{{ t('LOADING_DEALS') }}</p>
      </div>
      
      <!-- DATA TABLE -->
      <div class="table-container glass-panel" *ngIf="!isLoading">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ t('PRODUCT') }}</th>
              <th>{{ t('PRODUCT') }} {{ t('FULL_NAME') }}</th>
              <th>{{ t('PRICE') }}</th>
              <th>{{ t('STOCK') }}</th>
              <th>{{ t('STATUS') }}</th>
              <th class="text-right">{{ t('ORDERS') }}</th>
            </tr>
          </thead>
          <tbody>
            @for (p of products; track p.id) {
              <tr>
                <td><span class="id-tag">#{{ p.id }}</span></td>
                <td>
                  <div class="entity-thumb">
                    <img [src]="p.imageUrl || ''" alt="img" onerror="this.src='assets/placeholder-cyber.jpg'">
                  </div>
                </td>
                <td><div class="entity-name">{{ p.name }}</div></td>
                <td><div class="price">{{ p.price | currency }}</div></td>
                <td>
                  <div class="stock-badge" [class.low]="p.stock < 10" [class.none]="p.stock === 0">
                    {{ p.stock }} {{ t('UNITS') }}
                  </div>
                </td>
                <td>
                  <div class="discount-label" *ngIf="p.isDiscounted">
                    {{ p.discountPercentage }}% {{ t('OFF') }}
                  </div>
                  <div class="no-discount" *ngIf="!p.isDiscounted">{{ t('BRAND_NEW') }}</div>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="icon-btn" (click)="editEntity(p)" [title]="t('SHOW')">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </button>
                    <button class="icon-btn" *ngIf="!p.isDiscounted" (click)="startAddDiscount(p)" [title]="t('DISCOUNT')">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 8-8 8"/><circle cx="9.5" cy="9.5" r=".5"/><circle cx="14.5" cy="14.5" r=".5"/></svg>
                    </button>
                    <button class="icon-btn pin" *ngIf="p.isDiscounted" (click)="removeDiscount(p.id)" [title]="t('REMOVE')">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    <button class="icon-btn del" (click)="startDelete(p)" [title]="t('REMOVE')">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="text-center">{{ t('NO_PRODUCTS_FOUND') }}</td></tr>
            }
          </tbody>
        </table>
      </div>

      <!-- DELETE MODAL -->
      <div class="modal-overlay" *ngIf="showDeleteModal">
        <div class="cyber-modal animate-glitch delete-modal">
            <h3 class="glitch-text">{{ t('DELETE_CONFIRM') }}</h3>
            <p class="warning-text">{{ t('PERMANENT_DELETE') }}: <span class="highlight">{{ productToDelete?.name }}</span>?</p>
            <div class="modal-actions">
                <button class="cyber-button pink" (click)="confirmDelete()">{{ t('REMOVE') }}</button>
                <button class="cyber-button" (click)="showDeleteModal = false">{{ t('RESET') }}</button>
            </div>
        </div>
      </div>

      <!-- DISCOUNT MODAL -->
      <div class="modal-overlay" *ngIf="showDiscountModal">
        <div class="cyber-modal glass-panel form-modal tight">
            <h3 class="modal-title">{{ t('DISCOUNT') }}</h3>
            <p class="modal-sub">{{ productToDiscount?.name }}</p>
            <div class="form-field">
                <label>{{ t('DISCOUNT') }} (%)</label>
                <input type="number" [(ngModel)]="discountPercentage" min="0" max="100">
            </div>
            <div class="modal-actions">
                <button class="cyber-button" (click)="confirmDiscount()">{{ t('START_SHOPPING') }}</button>
                <button class="cyber-button pink" (click)="showDiscountModal = false">{{ t('RESET') }}</button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { max-width: 1200px; }
    .header-section { margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end; }
    .header-section h1 { font-size: 2rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -1px; color: var(--text); }
    .subtitle { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; letter-spacing: 1.5px; }

    .message-banner { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 12px; padding: 12px 20px; color: var(--success); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; margin-bottom: 2rem; }

    .table-container { padding: 0; overflow-x: auto; border-radius: 20px; border: 2px solid var(--border); background: var(--bg-card); box-shadow: var(--shadow-sm); width: 100%; }
    .cyber-table { width: 100%; border-collapse: collapse; min-width: 800px; }
    .cyber-table th { text-align: left; padding: 1.25rem 1.5rem; background: var(--bg-alt); border-bottom: 2px solid var(--border); font-size: 0.7rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; font-family: var(--font-mono); }
    .cyber-table td { padding: 1.25rem 1.5rem; border-bottom: 1.5px solid var(--border); vertical-align: middle; }
    .cyber-table tr:last-child td { border-bottom: none; }
    .cyber-table tr:hover td { background: rgba(108,99,255,0.015); }

    .id-tag { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); font-weight: 800; background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 8px; }
    .entity-thumb { width: 50px; height: 50px; border-radius: 10px; overflow: hidden; border: 1.5px solid var(--border); background: var(--bg-card); padding: 2px; }
    .entity-thumb img { width: 100%; height: 100%; object-fit: contain; }
    .entity-name { font-weight: 950; color: var(--text); font-size: 0.95rem; }
    .price { font-weight: 800; color: var(--primary); font-family: var(--font-mono); font-size: 1rem; }

    .stock-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; background: rgba(0,0,0,0.04); color: var(--text-muted); font-size: 0.7rem; font-weight: 950; font-family: var(--font-mono); border: 1.5px solid rgba(0,0,0,0.05); }
    .stock-badge.low { background: rgba(245,158,11,0.08); color: #f59e0b; border-color: rgba(245,158,11,0.15); }
    .stock-badge.none { background: rgba(239,68,68,0.08); color: var(--error); border-color: rgba(239,68,68,0.15); }

    .discount-label { font-size: 0.7rem; font-weight: 950; color: var(--accent-dark); font-family: var(--font-mono); background: rgba(244,114,182,0.08); padding: 4px 10px; border-radius: 30px; border: 1.5px solid rgba(244,114,182,0.15); }
    .no-discount { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); opacity: 0.5; font-family: var(--font-mono); letter-spacing: 1px; }

    .action-btns { display: flex; gap: 8px; justify-content: flex-end; min-width: 160px; }
    .icon-btn { width: 38px; height: 38px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
    .icon-btn:hover { background: var(--bg-card); border-color: var(--primary); color: var(--primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(108,99,255,0.12); }
    .icon-btn.pin:hover { border-color: var(--accent-dark); color: var(--accent-dark); }
    .icon-btn.del:hover { border-color: var(--error); color: var(--error); box-shadow: 0 4px 12px rgba(239,68,68,0.12); }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .cyber-modal { padding: 3rem; text-align: center; border: 3px solid var(--primary); background: var(--bg-card); border-radius: 32px; box-shadow: 0 0 50px rgba(108,99,255,0.15); color: var(--text); }
    .form-modal { width: 90%; max-width: 650px; }
    .tight { max-width: 450px; }
    .modal-title { font-size: 1.6rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -1px; }
    .modal-sub { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; margin-bottom: 2.5rem; letter-spacing: 0.5px; }

    .tactical-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: left; }
    .tactical-form .full { grid-column: 1 / -1; }
    .form-field label { display: block; font-size: 0.7rem; font-weight: 900; color: var(--text-muted); margin-bottom: 8px; font-family: var(--font-mono); letter-spacing: 1px; }
    .form-field input, .form-field textarea { width: 100%; padding: 12px 16px; border-radius: 12px; border: 2px solid var(--border); font-size: 0.9rem; font-weight: 700; background: var(--bg-alt); transition: all 0.2s; color: var(--text); }
    .form-field input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 4px rgba(108,99,255,0.1); }

    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; }

    .glitch-text { font-size: 1.8rem; font-weight: 950; color: var(--error); }
    .warning-text { color: var(--text); margin: 2rem 0; font-size: 1.15rem; font-weight: 800; line-height: 1.5; }
    .highlight { color: var(--primary); font-weight: 950; text-decoration: underline; }
    
    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 10rem 0; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  `]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  actionMsg = '';
  
  isFormOpen = false;
  editingId: number | null = null;
  currentData: any = {};

  showDeleteModal = false;
  productToDelete: Product | null = null;

  showDiscountModal = false;
  productToDiscount: Product | null = null;
  discountPercentage = 0;

  private langService = inject(LanguageService);

  constructor(private adminService: AdminService, private userService: UserService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.userService.getAllProducts().subscribe({
      next: (res) => { this.products = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  openForm() {
    this.isFormOpen = true;
    this.editingId = null;
    this.currentData = { name: '', price: 0, stock: 0, categoryId: 1, imageUrl: '', description: '' };
  }

  editEntity(p: Product) {
    this.isFormOpen = true;
    this.editingId = p.id;
    this.currentData = { ...p };
  }

  closeForm() {
    this.isFormOpen = false;
  }

  saveEntity() {
    if (this.editingId) {
      this.adminService.updateProduct(this.editingId, this.currentData).subscribe({
        next: (res) => { 
          if(res.statusCode === 200) this.handleSuccess(this.t('ORDER_UPDATED')); 
          else this.handleError(res.message);
        },
        error: (err) => { this.handleError(err.error?.message || this.t('ERROR_OCCURRED')); }
      });
    } else {
      this.adminService.createProduct(this.currentData).subscribe({
        next: (res) => { 
          if(res.statusCode === 200) this.handleSuccess(this.t('CHECKOUT_SUCCESS')); 
          else this.handleError(res.message);
        },
        error: (err) => { this.handleError(err.error?.message || this.t('ERROR_OCCURRED')); }
      });
    }
  }

  startDelete(p: Product) {
    this.productToDelete = p;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.productToDelete) return;
    this.adminService.deleteProduct(this.productToDelete.id).subscribe({
      next: (res) => { 
        this.handleSuccess(this.t('REMOVE')); 
        this.showDeleteModal = false;
      },
      error: (err) => { 
        this.handleError(err.error?.message || this.t('ERROR_OCCURRED')); 
        this.showDeleteModal = false;
      }
    });
  }

  startAddDiscount(p: Product) {
    this.productToDiscount = p;
    this.discountPercentage = 10;
    this.showDiscountModal = true;
  }

  confirmDiscount() {
    if (!this.productToDiscount) return;
    this.adminService.addDiscount(this.productToDiscount.id, this.discountPercentage).subscribe({
      next: (res) => {
        this.handleSuccess(this.t('DISCOUNT'));
        this.showDiscountModal = false;
      },
      error: (err) => {
        this.handleError(err.error?.message || this.t('ERROR_OCCURRED'));
        this.showDiscountModal = false;
      }
    });
  }

  removeDiscount(id: number) {
    this.adminService.removeDiscount(id).subscribe({
      next: (res) => { this.handleSuccess(this.t('REMOVE')); },
      error: (err) => { this.handleError(err.error?.message || this.t('ERROR_OCCURRED')); }
    });
  }

  private handleSuccess(msg: string) {
    this.actionMsg = msg;
    this.closeForm();
    this.loadProducts();
    setTimeout(() => this.actionMsg = '', 4000);
  }
  private handleError(msg: string = 'ERROR_OCCURRED') {
    this.actionMsg = msg;
    setTimeout(() => this.actionMsg = '', 5000);
  }
}
