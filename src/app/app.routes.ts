import { Routes } from '@angular/router';
import { projectGuard } from './core/guards/project.guard';

export const routes: Routes = [
  /** MAIN ROUTE */
  {
    path: '',
    loadComponent: () => import('./components/homepage/homepage').then((m) => m.Homepage),
  },
  /** ROUTE TO PROJECT BY ID */
  {
    path: 'project/:id',
    loadComponent: () => import('./components/homepage/homepage').then((m) => m.Homepage),
    canActivate: [projectGuard],
  },
  /** WILDCARD 404 */
  {
    path: '404',
    loadComponent: () =>
      import('./components/wildcard-404/wildcard-404').then((m) => m.Wildcard404),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
