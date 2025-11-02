import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = {};
  myCrops: any[] = [];
  myReports: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private translate: TranslateService,
    private reportService: ReportService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      region: ['', Validators.required],
      mobile: [''],
      language: ['en'],
      farmSize: ['', Validators.required],
      experience: ['', Validators.required],
      crops: [[]],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadMyCrops();
    this.loadMyReports();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue(user);
      },
      error: (err) => console.error('Failed to load profile', err),
    });
  }

  loadMyCrops(): void {
    // Assuming crops are derived from reports
    this.apiService.getReports().subscribe({
      next: (reports: any[]) => {
        this.myCrops = [...new Set(reports.map((r: any) => r.cropType))];
      },
      error: (err) => console.error('Failed to load crops', err),
    });
  }

  loadMyReports(): void {
    this.apiService.getReports().subscribe({
      next: (reports) => {
        this.myReports = reports;
      },
      error: (err) => console.error('Failed to load reports', err),
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach(key => {
        formData.append(key, this.profileForm.value[key]);
      });
      if (this.selectedFile) {
        formData.append('profilePhoto', this.selectedFile);
      }

      this.authService.updateProfile(formData).subscribe({
        next: (user) => {
          this.user = user;
          alert('Profile updated successfully');
        },
        error: (err) => console.error('Failed to update profile', err),
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  downloadProfilePdf(): void {
    this.reportService.generatePdfFromPage('profile-content', 'user-profile.pdf');
  }
}
