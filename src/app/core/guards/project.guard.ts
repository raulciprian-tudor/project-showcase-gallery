import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ProjectService } from '../services/project.service';

export const projectGuard: CanActivateFn = (route, state) => {
  const projectService = inject(ProjectService);
  const router = inject(Router);
  const projectId = route.paramMap.get('id');

  if (!projectId) {
    return router.createUrlTree(['/404']);
  }

  return projectService.getProjectById(projectId).pipe(
    map((project) => {
      if (project) {
        return true;
      } else {
        return router.createUrlTree(['/404']);
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/404']));
    })
  );
};
