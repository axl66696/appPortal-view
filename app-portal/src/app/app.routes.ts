import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('dist/user-login').then(m => m.LoginComponent) },
  { path: 'login/:token', loadComponent: () => import('dist/user-login').then(m => m.LoginComponent)},
  {path: 'Home', loadComponent: () => import('dist/app-store').then(m => m.AppStoreComponent)}
];
