import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('dist/user-login').then(m => m.LoginComponent) },
  { path: 'login/:token', loadComponent: () => import('dist/user-login').then(m => m.LoginComponent)},
  {
    path:'',
    loadComponent : () => import('./navigation-view/navigation-view.component').then(m=>m.NavigationViewComponent),
    children:[
      {
        path: 'Home',
        loadComponent: () => import('dist/home-page')
          .then(m => m.UserProfileComponent)
      },
      {
        path: 'news',
        loadComponent: () => import('dist/news-info')
          .then(m => m.NewsInfoComponent)
      },
      {
        path: 'appStore',
        loadComponent: () => import('dist/app-store')
          .then(m => m.AppStoreComponent)
      },
    ]
  },
];
