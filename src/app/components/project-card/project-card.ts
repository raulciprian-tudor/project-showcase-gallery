import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { GitHubRepo } from '../../core/interface/project.interface';

@Component({
  selector: 'app-project-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  @Input({ required: true }) project!: GitHubRepo;

  get techStack(): string[] {
    return Array.isArray(this.project.techStack)
      ? this.project.techStack
      : [this.project.techStack];
  }
}
