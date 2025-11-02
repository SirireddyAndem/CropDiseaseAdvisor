import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/core/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/core/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./components/core/reviews/reviews.component').then(m => m.ReviewsComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/core/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard)],
    children: [
      {
        path: 'analysis',
        loadComponent: () =>
          import('./components/core/analysis/analysis.component').then(m => m.AnalysisComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/dashboard/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
