import { Routes } from '@angular/router';
import { projectGuard } from './core/guards/project.guard';

export const routes: Routes = [
  /** MAIN ROUTE */
  {
    path: '',
    loadComponent: () => import('./components/homepage/homepage').then((m) => m.Homepage),
    data: { breadcrumb: 'Projects' }
  },
  /** ROUTE TO PROJECT BY ID */
  {
    path: 'project/:id',
    loadComponent: () => import('./components/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent),
    canActivate: [projectGuard],
    data: { breadcrumb: 'Project Details' }
  },
  /** WILDCARD 404 */
  {
    path: '404',
    loadComponent: () =>
      import('./components/wildcard-404/wildcard-404').then((m) => m.Wildcard404),
    data: { breadcrumb: 'Project Not Found' }
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
