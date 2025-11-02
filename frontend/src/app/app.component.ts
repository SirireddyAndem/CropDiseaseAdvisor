import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service'; // Correct path

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html', // Correct template URL
  styleUrl: './app.component.scss',
})
// The 'export' keyword was missing here
export class AppComponent {
  constructor(
    private translate: TranslateService,
    public authService: AuthService
    ) {
    translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('language') || 'en';
    translate.use(savedLang).subscribe(() => {
      // Language loaded successfully
    });
  }
}