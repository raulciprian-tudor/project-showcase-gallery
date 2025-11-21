import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';

/**
 * Component displaying navigation breadcrumbs.
 * Features:
 * - Displays current navigation path
 * - Automatically updates on route changes
 * - Provides clickable links to parent routes
 */
@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);

  /**
   * Observable stream of breadcrumbs from service.
   * Automatically update when route changes.
   */

  breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
}
