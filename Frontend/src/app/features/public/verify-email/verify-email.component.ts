import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VerifyEmailDTO } from '../../../core/models/auth.dto';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="glass-panel auth-panel">
        <h2 class="glitch-text">VERIFY COMMS LINK</h2>
        <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>EMAIL // IDENTIFIER</label>
            <input type="email" [(ngModel)]="verifyData.email" name="email" required>
          </div>
          
          <div class="form-group">
            <label>VERIFICATION CODE // KEY</label>
            <input type="text" [(ngModel)]="verifyData.verifyCode" name="verifyCode" required>
          </div>
          
          <button type="submit" class="cyber-button full-width" [disabled]="isLoading">
            {{ isLoading ? 'VERIFYING...' : 'CONFIRM LINK' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 70vh; }
    .auth-panel { width: 100%; max-width: 450px; background: rgba(16, 23, 41, 0.85); position: relative; overflow: hidden; border-color: rgba(157, 78, 221, 0.3); }
    .auth-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--neon-purple); box-shadow: 0 0 10px var(--neon-purple); }
    .glitch-text { color: var(--neon-purple); text-shadow: 2px 0 var(--glitch-color), -2px 0 var(--neon-blue); letter-spacing: 5px; text-align: center; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 8px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-purple); }
    .full-width { width: 100%; margin-top: 1rem; }
    .error { background: rgba(255,51,51,0.2); border: 1px solid var(--error-color); color: var(--error-color); padding: 10px; margin-bottom: 15px; border-radius: 4px; font-family: var(--font-mono); }
  `]
})
export class VerifyEmailComponent {
  verifyData: VerifyEmailDTO = { email: '', verifyCode: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.verifyEmail(this.verifyData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.statusCode === 200) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = res.message || 'Verification sequence failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'CRITICAL ERROR: Connection refused.';
      }
    });
  }
}
