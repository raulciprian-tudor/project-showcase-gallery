import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectStateService } from '../../core/services/project-state.service';
import { GitHubRepo } from '../../core/interface/project.interface';
import { take } from 'rxjs';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-project-detail.component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectState = inject(ProjectStateService);
  private snackBar = inject(MatSnackBar);

  project: GitHubRepo | null = null;

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.loadProject(projectId);
  }

  loadProject(id: string | null): void {
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.projectState.projects$
      .pipe(take(1))
      .subscribe(projects => {
        const foundProject = projects.find(p => p.id.toString() === id)

        if (foundProject) {
          this.project = foundProject;
        } else {
          this.snackBar.open('Project not found', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private username = 'raulciprian-tudor'
  openGithub(): void {
    if (this.project?.name && this.username) {
      const repoName = this.project.name.toLowerCase().replace(/\s+/g, '-');
      const githubUrl = `https://github.com/${this.username}/${repoName}`;
      window.open(githubUrl, '_blank');
    }
  }

  openHomepage(): void {
    if (this.project?.homepage) {
      window.open(this.project.homepage, '_blank')
    }
  }
}
