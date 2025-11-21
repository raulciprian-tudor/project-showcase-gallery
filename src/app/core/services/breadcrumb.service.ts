import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Breadcrumb } from '../interface/project.interface';

/**
 * Service responsible for generating breadcrumb navigation trails.
 * Listens to router events and builds breadcrumb hierarchy from route data.
 */
@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    /**
   * Observable stream of breadcrumbs that updates on route changes.
   * 
   * @returns Observable<Breadcrumb[]> - Array of breadcrumb objects with label and url
   * 
   * Flow:
   * 1. Listens to router NavigationEnd events
   * 2. Starts with initial route on subscription (startWith)
   * 3. Filters out duplicate navigations (distinctUntilChanged)
   * 4. Maps each navigation to a breadcrumb trail
   */
    getBreadcrumbs(): Observable<Breadcrumb[]> {
        return this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                startWith(null),
                distinctUntilChanged(),
                map(() => this.buildBreadcrumbs(this.activatedRoute.root))
            );
    }

    /**
   * Recursively builds breadcrumb trail from route tree.
   * 
   * @param route - Current activated route to process
   * @param url - Accumulated URL path (default: '')
   * @param breadcrumbs - Accumulated breadcrumb array (default: [])
   * @returns Breadcrumb[] - Complete breadcrumb trail from root to current route
   * 
   * Algorithm:
   * 1. Adds 'Home' breadcrumb as root if array is empty
   * 2. Traverses route children recursively
   * 3. Builds URL path from route segments
   * 4. Extracts breadcrumb label from route data
   * 5. Returns complete breadcrumb trail
   */
    private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
        if (breadcrumbs.length === 0) {
            breadcrumbs.push({ label: 'Home', url: '/' });
        }

        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const label = child.snapshot.data['breadcrumb'];
            if (label) {
                breadcrumbs.push({ label, url });
            }

            return this.buildBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}