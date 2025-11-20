import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GitHubRepo, ProjectInterface } from '../../core/interface/project.interface';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-project-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard implements OnInit {
  @Input() project!: GitHubRepo;

  ngOnInit(): void {
      console.log(this.project.url)
  }

  getTechStackArray(techStack: string | string[]): string[] {
    return Array.isArray(techStack) ? techStack : [techStack];
  }
}
