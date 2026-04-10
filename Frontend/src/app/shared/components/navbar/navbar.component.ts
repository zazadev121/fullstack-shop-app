import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);
  public langService = inject(LanguageService);
  
  menuOpen = false;
  isLangDropdownOpen = false;
  
  user = this.authService.currentUser;
  isAdmin = computed(() => this.authService.isAdmin());

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  setLang(lang: SupportedLanguage) {
    this.langService.setLanguage(lang);
    this.isLangDropdownOpen = false;
  }

  t(key: string): string {
    return this.langService.translate(key);
  }
}
