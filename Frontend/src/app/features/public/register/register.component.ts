import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterDTO } from '../../../core/models/auth.dto';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="brand">
          <a routerLink="/" class="logo">CART<span class="logo-accent">CORE</span></a>
          <p class="brand-tagline">{{ t('REGISTER_DESC') }}</p>
        </div>
        <div class="perks">
          <div class="perk">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ t('FREE_ACCOUNT') }}
          </div>
          <div class="perk">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
            {{ t('TRACK_ORDERS') }}
          </div>
          <div class="perk">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            {{ t('SAVE_WISHLIST') }}
          </div>
        </div>
        <div class="blob-a"></div>
        <div class="blob-b"></div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <h2>{{ t('CREATE_ACCOUNT') }}</h2>
          <p class="auth-sub">{{ t('REGISTER_DESC') }}</p>

          <div class="alert-error" *ngIf="errorMessage">{{ errorMessage }}</div>
          <div class="alert-success" *ngIf="successMessage">{{ successMessage }}</div>

          <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
            <div class="field">
              <label for="name">{{ t('FULL_NAME') }}</label>
              <input id="name" type="text" [(ngModel)]="registerData.name" name="name"
                [placeholder]="t('FULL_NAME')" required autocomplete="name">
            </div>
            <div class="field">
              <label for="email">{{ t('EMAIL_ADDRESS') }}</label>
              <input id="email" type="email" [(ngModel)]="registerData.email" name="email"
                [placeholder]="t('EMAIL_ADDRESS')" required autocomplete="email">
            </div>
            <div class="field password-field">
              <label for="password">{{ t('PASSWORD') }}</label>
              <div class="input-wrapper">
                <input id="password" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="registerData.password" name="password"
                  placeholder="Min. 8 characters" required autocomplete="new-password">
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword" [title]="showPassword ? t('HIDE') : t('SHOW')">
                  <svg *ngIf="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>
            <button type="submit" class="cyber-button pink submit-btn" [disabled]="isLoading">
              {{ isLoading ? t('PLEASE_WAIT') : t('CREATE_ACCOUNT') }}
            </button>
          </form>

          <p class="switch-link">{{ t('ALREADY_HAVE_ACCOUNT') }} <a routerLink="/login">{{ t('LOGIN_HERE') }}</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 66px); margin: -2rem; }
    .auth-left { background: var(--grad-accent); padding: 3rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
    .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; text-decoration: none; }
    .logo-accent { opacity: 0.7; }
    .brand-tagline { color: rgba(255,255,255,0.8); font-size: 1.05rem; margin-top: 12px; }
    .perks { display: flex; flex-direction: column; gap: 12px; }
    .perk { color: rgba(255,255,255,0.9); font-size: 0.95rem; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.12); border-radius: 12px; padding: 12px 16px; }
    .perk svg { opacity: 0.8; }
    .blob-a { position: absolute; width: 350px; height: 350px; background: rgba(255,255,255,0.08); border-radius: 60% 40% 50% 60% / 40% 60% 50% 60%; bottom: -60px; right: -60px; }
    .blob-b { position: absolute; width: 200px; height: 200px; background: rgba(255,255,255,0.06); border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; top: 30%; left: -40px; }

    .auth-right { display: flex; align-items: center; justify-content: center; padding: 3rem; background: var(--bg); }
    .auth-card { width: 100%; max-width: 420px; color: var(--text); }
    .auth-card h2 { font-size: 1.8rem; margin-bottom: 6px; font-weight: 900; }
    .auth-sub { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.95rem; text-transform: none; letter-spacing: 0; }

    .alert-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); color: var(--error); padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .alert-success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); color: var(--success); padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1.5rem; }

    .field { margin-bottom: 1.25rem; }
    .field label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .field input { margin: 0; width: 100%; background: var(--bg-card); border: 2px solid var(--border); color: var(--text); border-radius: 12px; padding: 12px 16px; font-weight: 600; transition: all 0.2s; }
    .field input:focus { border-color: var(--primary); outline: none; }

    .password-field .input-wrapper { position: relative; display: flex; align-items: center; }
    .password-field input { padding-right: 50px; }
    .toggle-password { position: absolute; right: 14px; background: none; border: none; padding: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); opacity: 0.6; transition: all 0.2s; }
    .toggle-password:hover { opacity: 1; color: var(--primary); transform: scale(1.1); }
    .eye-icon { stroke: currentColor; transition: all 0.2s; }

    .submit-btn { width: 100%; padding: 13px; font-size: 0.95rem; margin-top: 0.5rem; }
    .switch-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted); text-transform: none; letter-spacing: 0; }
    .switch-link a { color: var(--primary); font-weight: 600; }

    @media (max-width: 768px) {
      .auth-page { grid-template-columns: 1fr; margin: -1rem; }
      .auth-left { display: none; }
    }
  `]
})
export class RegisterComponent {
  registerData: RegisterDTO = { name: '', email: '', password: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private langService = inject(LanguageService);

  t(key: string): string {
    return this.langService.translate(key);
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.statusCode === 200 || res.statusCode === 201) {
          this.router.navigate(['/verify-email']);
        } else {
          this.errorMessage = res.message || this.t('NO_PRODUCTS_FOUND'); // Fallback
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || this.t('NO_PRODUCTS_FOUND');
      }
    });
  }
}
