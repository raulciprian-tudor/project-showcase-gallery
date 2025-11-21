import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { GitHubRepo } from '../../core/interface/project.interface';
import { Router } from '@angular/router';

/**
 * Card component displaying project summary information.
 * Features:
 * - Project name and description
 * - Technology stack chips
 * - Navigation to project detail page
 * - OnPush change detection for performance
 */
@Component({
  selector: 'app-project-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  @Input({ required: true }) project!: GitHubRepo;

  private router = inject(Router);

  /**
   * Gets project's technology stack, returning empty array if undefined.
   */
  get techStack(): string[] {
    return this.project.techStack ?? [];
  }

  /**
   * Navigates to project detail page.
   */
  viewDetails(): void {
    this.router.navigate(['/project', this.project.id]);
  }
}
