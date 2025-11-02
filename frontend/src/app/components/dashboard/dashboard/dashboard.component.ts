import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../../services/report.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterOutlet,
    RouterModule,
    TranslateModule,
    TitleCasePipe,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pastReports: any[] = [];
  user: any = {};
  myCrops: any[] = [];
  myReports: any[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.setProfileData();
    setTimeout(() => this.createCharts(), 1000); // Delay to ensure data is loaded
  }

  loadReports(): void {
    this.apiService.getReports().subscribe({
      next: (reports) => {
        this.pastReports = reports;
        this.myReports = reports;
        // Override myCrops with static data as per requirements
        this.myCrops = ['tomato', 'potato', 'Tomato', 'paddy', 'rice'];
      },
      error: (err) => console.error('Failed to load reports', err),
    });
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => console.error('Failed to load profile', err),
    });
  }

  setProfileData(): void {
    // Set static profile data as provided in requirements
    this.user = {
      name: 'sirireddy',
      email: 'siri19@gmail.com',
      role: 'Farmer',
      age: '(to be entered)',
      farmSize: '(to be entered)',
      experience: '(to be entered)',
      language: 'English',
      region: 'India',
      mobile: '9951506487'
    };
    this.myCrops = ['tomato', 'potato', 'Tomato', 'paddy', 'rice'];
    // myReports will be set from loadReports
  }

  // toggleProfile method removed - profile now handled in separate component

  // onAnalysisComplete method removed - analysis now handled in separate component

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  downloadReport(report: any): void {
    // Use the ReportService for PDF generation
    this.reportService.generatePdf(report);
  }

  downloadDashboardPdf(): void {
    // Generate PDF from the entire dashboard content
    this.reportService.generatePdfFromPage('dashboard-content', 'dashboard-report.pdf');
  }



  getLatestPest(): string {
    if (this.pastReports.length === 0) return 'None';
    return this.pastReports[0].disease.name;
  }

  getCurrentRecommendations(): string {
    if (this.pastReports.length === 0) return 'None';
    return this.pastReports[0].disease.treatment;
  }

  createCharts(): void {
    this.createCropGrowthChart();
    this.createDiseaseFrequencyChart();
    this.createReportsPerMonthChart();
  }

  createCropGrowthChart(): void {
    const ctx = document.getElementById('cropGrowthChart') as HTMLCanvasElement;
    if (!ctx) return;

    const cropCounts = this.pastReports.reduce((acc, report) => {
      acc[report.cropType] = (acc[report.cropType] || 0) + 1;
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(cropCounts),
        datasets: [{
          label: 'Crop Growth',
          data: Object.values(cropCounts),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
        }]
      }
    });
  }

  createDiseaseFrequencyChart(): void {
    const ctx = document.getElementById('diseaseFrequencyChart') as HTMLCanvasElement;
    if (!ctx) return;

    const diseaseCounts = this.pastReports.reduce((acc, report) => {
      acc[report.disease.name] = (acc[report.disease.name] || 0) + 1;
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(diseaseCounts),
        datasets: [{
          label: 'Disease Frequency',
          data: Object.values(diseaseCounts),
          backgroundColor: '#ff9800',
        }]
      }
    });
  }

  createReportsPerMonthChart(): void {
    const ctx = document.getElementById('reportsPerMonthChart') as HTMLCanvasElement;
    if (!ctx) return;

    const monthCounts = this.pastReports.reduce((acc, report) => {
      const month = new Date(report.createdAt).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(monthCounts),
        datasets: [{
          label: 'Reports per Month',
          data: Object.values(monthCounts),
          backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336'],
        }]
      }
    });
  }
}
