import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { GitHubRepo } from '../../core/interface/project.interface';
import { Router } from '@angular/router';

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

  get techStack(): string[] {
    return this.project.techStack ?? [];
  }

  viewDetails(): void {
    this.router.navigate(['/project', this.project.id]);
  }
}
