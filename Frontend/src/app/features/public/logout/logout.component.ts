import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="logout-page glass-panel">
      <div class="content">
        <h1 class="glitch-text">TERMINATE SESSION?</h1>
        <p class="data-stream">WARNING: All encrypted session tokens will be purged from local databanks.</p>
        
        <div class="action-grid">
          <button class="cyber-button pink large" (click)="confirmLogout()">
            <span class="glitch-content">CONFIRM LOGOUT</span>
          </button>
          <button class="cyber-button large" routerLink="/">
            <span class="glitch-content">ABORT & RETURN</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logout-page {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem;
      border-color: var(--neon-pink);
      background: rgba(255, 0, 127, 0.02);
    }
    .content {
      text-align: center;
      max-width: 600px;
      padding: 3rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      color: var(--neon-pink);
      text-shadow: 0 0 20px rgba(255, 0, 127, 0.5);
    }
    .data-stream {
      font-family: var(--font-mono);
      color: var(--text-secondary);
      margin-bottom: 3rem;
      letter-spacing: 1px;
    }
    .action-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 600px) {
      .action-grid { grid-template-columns: 1fr; }
      h1 { font-size: 2rem; }
    }
  `]
})
export class LogoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  confirmLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
