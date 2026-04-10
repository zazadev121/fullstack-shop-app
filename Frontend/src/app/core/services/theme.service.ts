import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.setDarkTheme();
    } else if (saved === 'light') {
      this.setLightTheme();
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setDarkTheme();
      }
    }
  }

  toggleTheme() {
    if (this.isDarkMode()) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  private setDarkTheme() {
    this.isDarkMode.set(true);
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  private setLightTheme() {
    this.isDarkMode.set(false);
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
}
