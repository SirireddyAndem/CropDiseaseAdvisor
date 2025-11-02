import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatSelectModule, MatFormFieldModule, TranslateModule ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public translate: TranslateService, public authService: AuthService) {
    translate.addLangs(['en', 'te']);
    translate.setDefaultLang('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang).subscribe(() => {
      localStorage.setItem('language', lang);
    });
  }
}