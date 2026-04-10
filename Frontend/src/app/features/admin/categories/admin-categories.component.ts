import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '@core/services/admin.service';
import { Category } from '@core/models/category.model';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div>
          <h1>{{ t('CATEGORY_MANAGEMENT') }}</h1>
          <p class="subtitle">{{ t('STATS_SUBTITLE') }}</p>
        </div>
        <button class="cyber-button" (click)="openForm()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ t('ADD_NEW_CATEGORY') }}
        </button>
      </div>
      
      <div class="message-banner" *ngIf="actionMsg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>>>> {{ actionMsg }}</span>
      </div>
      
      <!-- FORM MODAL -->
      <div class="modal-overlay" *ngIf="isFormOpen">
        <div class="cyber-modal glass-panel form-modal tight">
          <h3 class="modal-title">{{ editingId ? t('UPDATE_CATEGORY') : t('CREATE_CATEGORY') }}</h3>
          <p class="modal-sub">{{ t('STATS_SUBTITLE') }}</p>
          
          <form (ngSubmit)="saveEntity()" class="tactical-form">
            <div class="form-field">
              <label>{{ t('CATEGORY') }} {{ t('FULL_NAME') }}</label>
              <input type="text" [(ngModel)]="currentData.name" name="name" required [placeholder]="t('CATEGORY')">
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
              <th>{{ t('CATEGORY') }} {{ t('FULL_NAME') }}</th>
              <th class="text-right">{{ t('ORDERS') }}</th>
            </tr>
          </thead>
          <tbody>
            @for (c of categories; track c.id) {
              <tr>
                <td><span class="id-tag">#{{ c.id }}</span></td>
                <td><div class="sector-name">{{ c.name }}</div></td>
                <td>
                  <div class="action-btns">
                    <button class="icon-btn" (click)="editEntity(c)" [title]="t('SHOW')">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </button>
                    <button class="icon-btn del" (click)="startDelete(c)" [title]="t('REMOVE')">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="3" class="text-center">{{ t('NO_PRODUCTS_FOUND') }}</td></tr>
            }
          </tbody>
        </table>
      </div>

      <!-- DELETE MODAL -->
      <div class="modal-overlay" *ngIf="showDeleteModal">
        <div class="cyber-modal animate-glitch delete-modal">
            <h3 class="glitch-text">{{ t('DELETE_CONFIRM') }}</h3>
            <p class="warning-text">{{ t('PERMANENT_DELETE') }}: <span class="highlight">{{ categoryToDelete?.name }}</span>?</p>
            <div class="modal-actions">
                <button class="cyber-button pink" (click)="confirmDelete()">{{ t('REMOVE') }}</button>
                <button class="cyber-button" (click)="showDeleteModal = false">{{ t('RESET') }}</button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { max-width: 800px; }
    .header-section { margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end; }
    .header-section h1 { font-size: 2rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -1px; color: var(--text); }
    .subtitle { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; letter-spacing: 1.5px; }

    .message-banner { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 12px; padding: 12px 20px; color: var(--success); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; margin-bottom: 2rem; }

    .table-container { padding: 0; overflow: hidden; border-radius: 20px; border: 2px solid var(--border); background: var(--bg-card); box-shadow: var(--shadow-sm); }
    .cyber-table { width: 100%; border-collapse: collapse; }
    .cyber-table th { text-align: left; padding: 1.25rem 1.5rem; background: var(--bg-alt); border-bottom: 2px solid var(--border); font-size: 0.7rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; font-family: var(--font-mono); }
    .cyber-table td { padding: 1.25rem 1.5rem; border-bottom: 1.5px solid var(--border); vertical-align: middle; }
    .cyber-table tr:last-child td { border-bottom: none; }
    .cyber-table tr:hover td { background: rgba(108,99,255,0.015); }

    .id-tag { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); font-weight: 800; background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 8px; }
    .sector-name { font-weight: 950; color: var(--text); font-size: 1.05rem; letter-spacing: -0.5px; }

    .action-btns { display: flex; gap: 8px; justify-content: flex-end; }
    .icon-btn { width: 38px; height: 38px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .icon-btn:hover { background: var(--bg-card); border-color: var(--primary); color: var(--primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(108,99,255,0.12); }
    .icon-btn.del:hover { border-color: var(--error); color: var(--error); box-shadow: 0 4px 12px rgba(239,68,68,0.12); }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .cyber-modal { padding: 3rem; text-align: center; border: 3px solid var(--primary); background: var(--bg-card); border-radius: 32px; box-shadow: 0 0 50px rgba(108,99,255,0.15); color: var(--text); }
    .form-modal { width: 90%; max-width: 450px; }
    .tight { max-width: 400px; }
    .modal-title { font-size: 1.5rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -1px; }
    .modal-sub { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; margin-bottom: 2rem; letter-spacing: 0.5px; }

    .tactical-form .form-field { text-align: left; }
    .form-field label { display: block; font-size: 0.7rem; font-weight: 900; color: var(--text-muted); margin-bottom: 8px; font-family: var(--font-mono); letter-spacing: 1px; }
    .form-field input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 2px solid var(--border); font-size: 0.95rem; font-weight: 700; background: var(--bg-alt); transition: all 0.2s; color: var(--text); }
    .form-field input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 4px rgba(108,99,255,0.1); }

    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; }

    .glitch-text { font-size: 1.8rem; font-weight: 950; color: var(--error); }
    .warning-text { color: var(--text); margin: 2rem 0; font-size: 1.15rem; font-weight: 800; line-height: 1.5; }
    .highlight { color: var(--primary); font-weight: 950; text-decoration: underline; }

    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 8rem 0; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;
  actionMsg = '';
  
  isFormOpen = false;
  editingId: number | null = null;
  currentData: any = {};

  showDeleteModal = false;
  categoryToDelete: Category | null = null;

  private langService = inject(LanguageService);

  constructor(private adminService: AdminService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.adminService.getAllCategories().subscribe({
      next: (res) => { this.categories = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  openForm() {
    this.isFormOpen = true;
    this.editingId = null;
    this.currentData = { name: '' };
  }

  editEntity(c: Category) {
    this.isFormOpen = true;
    this.editingId = c.id;
    this.currentData = { ...c };
  }

  closeForm() {
    this.isFormOpen = false;
  }

  saveEntity() {
    if (this.editingId) {
      this.adminService.updateCategory(this.editingId, this.currentData).subscribe({
        next: (res) => { this.handleSuccess(this.t('ORDER_UPDATED')); },
        error: (err) => { this.handleError(err.error?.message || this.t('ERROR_OCCURRED')); }
      });
    } else {
      this.adminService.createCategory(this.currentData).subscribe({
        next: (res) => { this.handleSuccess(this.t('CHECKOUT_SUCCESS')); },
        error: (err) => { this.handleError(err.error?.message || this.t('ERROR_OCCURRED')); }
      });
    }
  }

  startDelete(c: Category) {
    this.categoryToDelete = c;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.categoryToDelete) return;
    this.adminService.deleteCategory(this.categoryToDelete.id).subscribe({
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

  private handleSuccess(msg: string) {
    this.actionMsg = msg;
    this.closeForm();
    this.loadCategories();
    setTimeout(() => this.actionMsg = '', 4000);
  }
  private handleError(msg: string = 'ERROR_OCCURRED') {
    this.actionMsg = msg;
    setTimeout(() => this.actionMsg = '', 5000);
  }
}
