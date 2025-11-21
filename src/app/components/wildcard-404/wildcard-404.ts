import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wildcard-404',
  imports: [MatIcon],
  templateUrl: './wildcard-404.html',
  styleUrl: './wildcard-404.scss',
})
export class Wildcard404 {
  private router = inject(Router)

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
