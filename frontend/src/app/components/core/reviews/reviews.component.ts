import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: Date;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  reviewForm: FormGroup;
  reviews: Review[] = [
    {
      name: 'John Farmer',
      rating: 5,
      comment: 'This app saved my tomato crop! The disease identification was spot on.',
      date: new Date('2024-01-15')
    },
    {
      name: 'Maria Rodriguez',
      rating: 4,
      comment: 'Very helpful tool. The treatment recommendations are practical and effective.',
      date: new Date('2024-02-20')
    },
    {
      name: 'Ahmed Hassan',
      rating: 5,
      comment: 'Great app for rice farmers. Quick and accurate diagnosis.',
      date: new Date('2024-03-10')
    }
  ];

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      name: ['', Validators.required],
      rating: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const newReview: Review = {
        ...this.reviewForm.value,
        date: new Date()
      };
      this.reviews.unshift(newReview);
      this.reviewForm.reset();
    }
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
