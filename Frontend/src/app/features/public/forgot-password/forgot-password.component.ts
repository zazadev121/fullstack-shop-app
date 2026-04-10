import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="brand">
          <a routerLink="/" class="logo">CART<span class="logo-accent">CORE</span></a>
          <p class="brand-tagline">Securely recover your account access.</p>
        </div>
        <div class="auth-art">
          <div class="blob-a"></div>
          <div class="blob-b"></div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <h2>Forgot Password</h2>
          <p class="auth-sub">Enter your email and we'll send you a reset link</p>

          <div class="alert-error" *ngIf="errorMessage">{{ errorMessage }}</div>
          <div class="alert-success" *ngIf="successMessage">{{ successMessage }}</div>

          <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
            <div class="field">
              <label for="email">Email Address</label>
              <input id="email" type="email" [(ngModel)]="email" name="email"
                placeholder="you@example.com" required autocomplete="email">
            </div>
            <button type="submit" class="cyber-button submit-btn" [disabled]="isLoading || !email">
              {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>

          <p class="switch-link">Remember your password? <a routerLink="/login">Back to Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 66px); margin: -2rem; }
    .auth-left { background: var(--grad-hero); padding: 3rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
    .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; }
    .logo-accent { opacity: 0.75; }
    .brand-tagline { color: rgba(255,255,255,0.75); font-size: 1.1rem; margin-top: 12px; }
    .blob-a { position: absolute; width: 350px; height: 350px; background: rgba(255,255,255,0.08); border-radius: 60% 40% 50% 60% / 40% 60% 50% 60%; bottom: -60px; right: -60px; }
    .blob-b { position: absolute; width: 200px; height: 200px; background: rgba(255,255,255,0.06); border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; top: 30%; left: -40px; }

    .auth-right { display: flex; align-items: center; justify-content: center; padding: 3rem; background: var(--bg); }
    .auth-card { width: 100%; max-width: 400px; }
    .auth-card h2 { font-size: 1.8rem; margin-bottom: 6px; }
    .auth-sub { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.95rem; text-transform: none; letter-spacing: 0; }

    .alert-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); color: var(--error); padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .alert-success { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1.5rem; }

    .field { margin-bottom: 1.25rem; }
    .field label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .field input { margin: 0; width: 100%; }

    .submit-btn { width: 100%; padding: 13px; font-size: 0.95rem; margin-top: 0.5rem; }
    .switch-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted); text-transform: none; letter-spacing: 0; }
    .switch-link a { color: var(--primary); font-weight: 600; }

    @media (max-width: 768px) {
      .auth-page { grid-template-columns: 1fr; margin: -1rem; }
      .auth-left { display: none; }
    }
  `]
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.statusCode === 200) {
           this.successMessage = 'Success! We have sent a reset code to your email. Redirecting you to reset your password...';
           
           // Redirect after 2 seconds to give user time to read
           setTimeout(() => {
             this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
           }, 2500);
        } else {
           this.errorMessage = res.message || 'Failed to process request.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Connection error. Please try again.';
      }
    });
  }
}
