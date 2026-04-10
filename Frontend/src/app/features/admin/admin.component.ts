import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <div class="brand">
            <span class="logo">{{ t('ADMIN') }}<span class="accent">PANEL</span></span>
          </div>
          <div class="access-badge">{{ t('ADMIN_SESSION_ACTIVE') }}</div>
        </div>

        <nav class="admin-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </div>
            <span>{{ t('DASHBOARD') }}</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="active">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </div>
            <span>{{ t('PRODUCTS') }}</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42l-8.704-8.704Z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <span>{{ t('CATEGORIES') }}</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="active">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span>{{ t('USERS') }}</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active">
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m3 6 9 6 9-6"/><path d="M15 22h6"/><path d="M19 18l3 3-3 3"/><path d="M15 14h3l2 2"/></svg>
            </div>
            <span>{{ t('ORDERS') }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="exit-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {{ t('EXIT_ADMIN') }}
          </a>
        </div>
      </aside>
      
      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: 100vh; background: var(--bg); color: var(--text); }
    
    .admin-sidebar { width: 300px; background: var(--bg-card); border-right: 2px solid var(--border); display: flex; flex-direction: column; padding: 2.5rem; position: sticky; top: 0; height: 100vh; }
    
    .sidebar-header { margin-bottom: 4rem; text-align: center; }
    .brand .logo { font-size: 1.6rem; font-weight: 900; letter-spacing: -1px; color: var(--text); font-family: var(--font-display); }
    .accent { background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .access-badge { display: inline-block; font-family: var(--font-mono); font-size: 0.65rem; font-weight: 900; color: var(--primary); background: rgba(108,99,255,0.06); padding: 4px 12px; border-radius: 30px; margin-top: 12px; border: 1.5px solid rgba(108,99,255,0.1); letter-spacing: 1px; }

    .admin-nav { display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
    .admin-nav a { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-radius: 16px; color: var(--text-muted); font-size: 0.85rem; font-weight: 800; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); letter-spacing: 0.5px; border: 2px solid transparent; text-decoration: none; }
    .nav-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.02); transition: all 0.3s; color: var(--text-muted); }
    
    .admin-nav a:hover { background: rgba(108,99,255,0.03); color: var(--primary); }
    .admin-nav a:hover .nav-icon { background: var(--bg-card); color: var(--primary); box-shadow: 0 4px 12px rgba(108,99,255,0.1); }
    
    .admin-nav a.active { background: var(--bg); border-color: var(--primary); color: var(--text); box-shadow: var(--shadow-sm); transform: translateX(5px); }
    .admin-nav a.active .nav-icon { background: var(--grad-primary); color: #fff; box-shadow: 0 4px 15px rgba(108,99,255,0.25); }
    
    .sidebar-footer { margin-top: auto; padding-top: 2rem; border-top: 1.5px dashed var(--border); }
    .exit-link { display: flex; align-items: center; gap: 12px; color: var(--error); font-weight: 950; font-size: 0.8rem; font-family: var(--font-mono); letter-spacing: 1px; transition: all 0.2s; text-decoration: none; }
    .exit-link:hover { transform: translateX(5px); text-shadow: 0 0 10px rgba(239,68,68,0.2); }

    .admin-main { flex-grow: 1; padding: 4rem; min-width: 0; background: var(--bg); }
    
    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .admin-sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 2px solid var(--border); padding: 2rem; }
      .sidebar-header { margin-bottom: 2rem; text-align: left; display: flex; justify-content: space-between; align-items: center; }
      .access-badge { margin-top: 0; }
      .admin-nav { flex-direction: row; flex-wrap: wrap; gap: 12px; }
      .admin-nav a { flex: 1; min-width: 160px; padding: 10px 14px; }
      .admin-main { padding: 2rem; }
    }
  `]
})
export class AdminComponent {
  private langService = inject(LanguageService);

  t(key: string): string {
    return this.langService.translate(key);
  }
}
