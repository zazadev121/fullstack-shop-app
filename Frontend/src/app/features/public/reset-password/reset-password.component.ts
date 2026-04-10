import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ResetPassDTO } from '../../../core/models/auth.dto';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-left">
         <div class="brand">
          <a routerLink="/" class="logo">CART<span class="logo-accent">CORE</span></a>
          <p class="brand-tagline">Set up your new secure password.</p>
        </div>
        <div class="auth-art">
          <div class="blob-a"></div>
          <div class="blob-b"></div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <h2>Reset Password</h2>
          <p class="auth-sub">Choose a strong new password</p>

          <div class="alert-error" *ngIf="errorMessage">{{ errorMessage }}</div>
          <div class="alert-success" *ngIf="successMessage">
             {{ successMessage }}<br><br>
             <a routerLink="/login" class="cyber-button submit-btn" style="text-decoration:none; display:block; text-align:center;">Go to Login</a>
          </div>

          <form (ngSubmit)="onSubmit()" *ngIf="!successMessage">
            <div class="field">
              <label for="email">Verify your Email</label>
              <input id="email" type="email" [(ngModel)]="resetData.email" name="email"
                placeholder="you@example.com" required autocomplete="email">
            </div>
            
            <div class="field">
              <label for="code">Reset Code</label>
              <input id="code" type="text" [(ngModel)]="resetData.resetCode" name="code"
                placeholder="Enter the code from your email" required autocomplete="off">
            </div>

            <div class="field password-field">
              <label for="password">New Password</label>
              <div class="input-wrapper">
                <input id="password" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="resetData.newPassword" name="password"
                  placeholder="••••••••" required autocomplete="new-password">
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                  {{ showPassword ? 'HIDE' : 'SHOW' }}
                </button>
              </div>
            </div>
            <button type="submit" class="cyber-button submit-btn" [disabled]="isLoading">
              {{ isLoading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>

          <p class="switch-link" *ngIf="!successMessage">Remember your password? <a routerLink="/login">Back to Login</a></p>
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
    .password-field .input-wrapper { position: relative; display: flex; align-items: center; }
    .password-field input { padding-right: 60px; }
    .toggle-password { position: absolute; right: 12px; background: none; border: none; font-size: 0.7rem; font-weight: 700; color: var(--primary); cursor: pointer; letter-spacing: 0.05em; padding: 4px; }
    .toggle-password:hover { opacity: 0.8; }

    .submit-btn { width: 100%; padding: 13px; font-size: 0.95rem; margin-top: 0.5rem; }
    .switch-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted); text-transform: none; letter-spacing: 0; }
    .switch-link a { color: var(--primary); font-weight: 600; }

    @media (max-width: 768px) {
      .auth-page { grid-template-columns: 1fr; margin: -1rem; }
      .auth-left { display: none; }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetData: ResetPassDTO = { email: '', resetCode: '', newPassword: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.resetData.email = params['email'];
      }
    });
  }

  onSubmit() {
    if(!this.resetData.email || !this.resetData.resetCode || !this.resetData.newPassword) {
       this.errorMessage = "Please fill in all fields.";
       return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.resetPassword(this.resetData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.statusCode === 200) {
           this.successMessage = 'Your password has been successfully reset. You can now login with your new password.';
        } else {
           this.errorMessage = res.message || 'Failed to reset password.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Connection error. Please try again.';
      }
    });
  }
}
