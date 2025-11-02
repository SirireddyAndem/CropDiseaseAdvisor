import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ReportService } from '../../../services/report.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Import missing Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TranslateModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, // Added
    MatProgressBarModule // Added
  ],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent {
  // FIX: Renamed from 'analysisForm' to 'advisorForm' to be consistent
  advisorForm: FormGroup;
  analysisResult: any = null;
  isLoading = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private reportService: ReportService, private translate: TranslateService) {
    this.advisorForm = this.fb.group({
      cropType: ['', Validators.required],
      symptoms: ['', Validators.required],
      image: [null],
    });
  }

  // FIX: Added the missing onFileSelected method
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.advisorForm.patchValue({ image: file });
      this.advisorForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.advisorForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.analysisResult = null;

    const formData = new FormData();
    formData.append('cropType', this.advisorForm.get('cropType')?.value);
    formData.append('symptoms', this.advisorForm.get('symptoms')?.value);

    const imageFile = this.advisorForm.get('image')?.value;
    if (imageFile) {
      formData.append('image', imageFile);
    }

    this.apiService.analyzeCrop(formData).subscribe({
      next: (result) => {
        this.analysisResult = result;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Analysis failed', err);
        this.isLoading = false;
      },
    });
  }

  downloadResult(result: any): void {
    this.reportService.generatePdf(result);
  }

  downloadAnalysisPdf(): void {
    if (this.analysisResult) {
      this.reportService.generatePdfFromPage('analysis-results', 'crop-analysis.pdf');
    } else {
      this.reportService.generatePdfFromPage('analysis-content', 'crop-analysis.pdf');
    }
  }
}
