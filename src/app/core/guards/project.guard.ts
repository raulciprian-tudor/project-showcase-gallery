import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ProjectService } from '../services/project.service';

/**
 * Route guard that validates project existence before navigation.
 *
 * @param route - Activated route snapshot
 * @param state - Router state snapshot
 * @returns Observable<boolean | UrlTree> - true to allow navigation, UrlTree to redirect
 *
 * Flow:
 * 1. Extracts project ID from route parameters
 * 2. Fetches all projects from GitHub
 * 3. Verifies project exists
 * 4. Redirects to 404 if project not found or on error
 */
export const projectGuard: CanActivateFn = (route, state) => {
  const projectService = inject(ProjectService);
  const router = inject(Router);
  const projectId = route.paramMap.get('id');

  if (!projectId) {
    return router.createUrlTree(['/404']);
  }

  return projectService.transformToProjects().pipe(
    map((projects: any[] | undefined) => {
      const project = projects?.find(p => p.id === projectId);
      if (project) {
        return true;
      } else {
        return router.createUrlTree(['/404']);
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/404']))
    })
  )
};
