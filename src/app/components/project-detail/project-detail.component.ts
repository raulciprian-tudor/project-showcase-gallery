import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
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
  private username = 'raulciprian-tudor'

  @ViewChild('carouselContainer') carouselContainer?: ElementRef<HTMLDivElement>;

  project: GitHubRepo | null = null;
  currentImageIndex = 0;

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
          this.addMockScreenshots();
        } else {
          this.snackBar.open('Project not found', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        }
      });
  }

  private addMockScreenshots(): void {
    if (this.project) {
      this.project.screenshots = [
        'https://images.unsplash.com/photo-1533022139390-e31c488d69e2?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1721955487745-a2c3aea86d1c?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ];
    }
  }

  nextImage(): void {
    if (this.project?.screenshots && this.currentImageIndex < this.project.screenshots.length - 1) {
      this.currentImageIndex++;
      this.announceImageChange();
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.announceImageChange();
    }
  }

  goToImage(index: number): void {
    if (this.project?.screenshots && index >= 0 && index < this.project.screenshots.length) {
      this.currentImageIndex = index;
      this.announceImageChange();
    }
  } onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
      case 'Home':
        event.preventDefault();
        this.goToImage(0);
        break;
      case 'End':
        event.preventDefault();
        if (this.project?.screenshots) {
          this.goToImage(this.project.screenshots.length - 1);
        }
        break;
    }
  }

  private announceImageChange(): void {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.focus();
    }
  }

  openImageModal(screenshot: string): void {
    window.open(screenshot, '_blank');
  }



  goBack(): void {
    this.router.navigate(['/']);
  }

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
