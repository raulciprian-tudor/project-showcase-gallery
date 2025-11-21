import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { filter, map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Breadcrumb } from '../../core/interface/project.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  breadcrumbs$!: Observable<Breadcrumb[]>;

  ngOnInit(): void {
    this.breadcrumbs$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
        distinctUntilChanged(),
        map(() => this.buildBreadcrumbs(this.activatedRoute.root))
      );
  }

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
