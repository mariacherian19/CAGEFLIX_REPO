import { Routes } from '@angular/router';
import { MovieListComponent } from './features/cageflix/pages/movie-list/movie-list.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/cageflix/pages/movie-list/movie-list.component').then(
        (m) => m.MovieListComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/cageflix/pages/movie-list/movie-list.component').then(
        (m) => m.MovieListComponent
      ),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/cageflix/pages/movie-list/movie-list.component').then(
        (m) => m.MovieListComponent
      ),
    data: { filter: 'movie' },
  },
  {
    path: 'tv-shows',
    loadComponent: () =>
      import('./features/cageflix/pages/movie-list/movie-list.component').then(
        (m) => m.MovieListComponent
      ),
    data: { filter: 'tv' },
  },
];
