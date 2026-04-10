import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { User, UserRoles } from '../../../core/models/user.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div>
          <h1>{{ t('USERS') }} {{ t('CATEGORY_MANAGEMENT') }}</h1>
          <p class="subtitle">{{ t('STATS_SUBTITLE') }}</p>
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
              <th>{{ t('USERS') }} {{ t('DETAILS') }}</th>
              <th>{{ t('STATUS') }}</th>
              <th>{{ t('STATUS') }}</th>
              <th class="text-right">{{ t('ORDERS') }}</th>
            </tr>
          </thead>
          <tbody>
            @for (u of users; track u.id) {
              <tr>
                <td><span class="id-tag">#{{ u.id }}</span></td>
                <td>
                  <div class="user-info">
                    <div class="name">{{ u.name }}</div>
                    <div class="email">{{ u.email }}</div>
                  </div>
                </td>
                <td>
                  <div class="role-chip" [class.admin]="u.role === userRoles.Admin">
                    <svg *ngIf="u.role === userRoles.Admin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    {{ u.role === userRoles.Admin ? t('ADMIN') : t('SHOP') }}
                  </div>
                </td>
                <td>
                  <div class="status-pill" [class.active]="u.isVerified">
                    {{ u.isVerified ? t('SHIPPED') : t('PENDING') }}
                  </div>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="action-icon-btn" [title]="u.role === userRoles.Admin ? t('EXIT_ADMIN') : t('ADMIN')" (click)="toggleRole(u)">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
                    </button>
                    <button class="action-icon-btn delete" [title]="t('REMOVE')" (click)="startDelete(u)">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="text-center">{{ t('NO_PRODUCTS_FOUND') }}</td></tr>
            }
          </tbody>
        </table>
      </div>

      <!-- DELETE MODAL -->
      <div class="modal-overlay" *ngIf="showDeleteModal">
        <div class="cyber-modal animate-glitch delete-modal">
            <h3 class="glitch-text">{{ t('DELETE_CONFIRM') }}</h3>
            <p class="warning-text">{{ t('PERMANENT_DELETE') }}: <span class="highlight">{{ userToDelete?.name }}</span>?</p>
            <div class="modal-actions">
                <button class="cyber-button pink" (click)="confirmDelete()">{{ t('REMOVE') }}</button>
                <button class="cyber-button" (click)="showDeleteModal = false">{{ t('RESET') }}</button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { max-width: 1000px; }
    .header-section { margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end; }
    .header-section h1 { font-size: 2rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -1px; color: var(--text); }
    .subtitle { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; letter-spacing: 1px; }

    .message-banner { display: flex; align-items: center; gap: 12px; background: rgba(16,185,129,0.06); border: 2px solid rgba(16,185,129,0.15); border-radius: 12px; padding: 12px 20px; color: var(--success); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; margin-bottom: 2rem; }

    .table-container { padding: 0; overflow: hidden; border-radius: 20px; border: 2px solid var(--border); background: var(--bg-card); box-shadow: var(--shadow-sm); }
    .cyber-table { width: 100%; border-collapse: collapse; }
    .cyber-table th { text-align: left; padding: 1.25rem 1.5rem; background: var(--bg-alt); border-bottom: 2px solid var(--border); font-size: 0.7rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; font-family: var(--font-mono); }
    .cyber-table td { padding: 1.25rem 1.5rem; border-bottom: 1.5px solid var(--border); vertical-align: middle; }
    .cyber-table tr:last-child td { border-bottom: none; }
    .cyber-table tr:hover td { background: rgba(108,99,255,0.015); }

    .id-tag { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); font-weight: 900; background: rgba(0,0,0,0.04); padding: 4px 10px; border-radius: 8px; }

    .user-info .name { font-weight: 900; font-size: 1rem; color: var(--text); margin-bottom: 2px; }
    .user-info .email { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

    .role-chip { display: inline-flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 900; padding: 6px 12px; border-radius: 30px; background: rgba(0,0,0,0.04); color: var(--text-muted); border: 1.5px solid rgba(0,0,0,0.05); font-family: var(--font-mono); }
    .role-chip.admin { background: rgba(108,99,255,0.06); color: var(--primary); border-color: rgba(108,99,255,0.15); }

    .status-pill { display: inline-block; font-size: 0.65rem; font-weight: 950; font-family: var(--font-mono); padding: 5px 10px; border-radius: 6px; background: rgba(239,68,68,0.06); color: var(--error); }
    .status-pill.active { background: rgba(16,185,129,0.06); color: var(--success); }

    .action-btns { display: flex; gap: 8px; justify-content: flex-end; }
    .action-icon-btn { width: 38px; height: 38px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg-alt); color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .action-icon-btn:hover { background: var(--bg-card); border-color: var(--primary); color: var(--primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(108,99,255,0.12); }
    .action-icon-btn.delete:hover { border-color: var(--error); color: var(--error); box-shadow: 0 4px 12px rgba(239,68,68,0.12); }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .cyber-modal { width: 90%; max-width: 500px; padding: 4rem; text-align: center; border: 3px solid var(--primary); background: var(--bg-card); border-radius: 32px; box-shadow: 0 0 50px rgba(108,99,255,0.15); color: var(--text); }
    .glitch-text { font-size: 1.8rem; font-weight: 950; color: var(--error); }
    .warning-text { color: var(--text); margin: 2rem 0; font-size: 1.15rem; font-weight: 800; line-height: 1.5; }
    .highlight { color: var(--primary); font-weight: 950; text-decoration: underline; }
    
    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 10rem 0; gap: 1.5rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(108,99,255,0.08); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  actionMsg = '';
  userRoles = UserRoles;

  showDeleteModal = false;
  userToDelete: User | null = null;

  private langService = inject(LanguageService);

  constructor(private adminService: AdminService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => { this.users = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  toggleRole(user: User) {
    const newRole = user.role === UserRoles.Admin ? UserRoles.User : UserRoles.Admin;
    this.adminService.changeUserRole(user.id, newRole).subscribe({
      next: (res) => {
        this.actionMsg = `${this.t('ORDER_UPDATED')}: ${user.name}`;
        this.loadUsers();
        setTimeout(() => this.actionMsg = '', 4000);
      },
      error: (err) => { this.actionMsg = this.t('ERROR_OCCURRED'); }
    });
  }

  startDelete(u: User) {
    this.userToDelete = u;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.userToDelete) return;
    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: (res) => {
        this.actionMsg = `${this.t('REMOVE')}: ${this.userToDelete?.name}`;
        this.loadUsers();
        this.showDeleteModal = false;
        setTimeout(() => this.actionMsg = '', 4000);
      },
      error: (err) => { 
        this.actionMsg = this.t('ERROR_OCCURRED'); 
        this.showDeleteModal = false;
      }
    });
  }
}
