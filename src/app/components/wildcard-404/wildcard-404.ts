import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

/**
 * 404 error page component for invalid routes.
 * Features:
 * - User-friendly error message
 * - Navigation back to homepage
 * - Browser history back button
 */
@Component({
  selector: 'app-wildcard-404',
  imports: [MatIcon],
  templateUrl: './wildcard-404.html',
  styleUrl: './wildcard-404.scss',
})
export class Wildcard404 {
  private router = inject(Router)

  /**
   * Navigates to homepage.
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigates to previous page in browser history.
   */
  goBack(): void {
    window.history.back();
  }
}
