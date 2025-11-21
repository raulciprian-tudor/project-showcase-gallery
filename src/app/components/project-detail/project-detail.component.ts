import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
import { Subject, take, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CarouselService } from '../../core/services/carousel.service';
import { RelatedProjectsService } from '../../core/services/related-projects.service';

/**
 * Component displaying detailed information about a single project.
 * Features:
 * - Project metadata and description
 * - Screenshot carousel with keyboard navigation
 * - Related projects based on tech stack
 * - Links to GitHub repository and homepage
 */
@Component({
  selector: 'app-project-detail',
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
  providers: [CarouselService],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectState = inject(ProjectStateService);
  private snackBar = inject(MatSnackBar);
  private carouselService = inject(CarouselService);
  private relatedProjectsService = inject(RelatedProjectsService);
  private destroy$ = new Subject<void>();

  private readonly GITHUB_USERNAME = 'raulciprian-tudor';
  private readonly SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';

  @ViewChild('carouselContainer') carouselContainer?: ElementRef<HTMLDivElement>;

  project: GitHubRepo | null = null;
  relatedProjects: GitHubRepo[] = [];

  /**
   * Gets current carousel image index from service.
   */
  get currentImageIndex(): number {
    return this.carouselService.currentIndex;
  }

  ngOnInit(): void {
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.carouselService.reset();
  }

  /**
   * Subscribes to route parameter changes to load project data.
   * Scrolls to top on each route change.
   */
  private subscribeToRouteChanges(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const projectId = params.get('id');
        this.loadProject(projectId);
        window.scrollTo({ top: 0, behavior: this.SCROLL_BEHAVIOR });
      });
  }

  /**
   * Loads project data by ID and initializes related components.
   * 
   * @param id - Project ID from route parameter
   * 
   * Flow:
   * 1. Validates project ID
   * 2. Resets component state
   * 3. Fetches project from state service
   * 4. Initializes carousel and loads related projects
   * 5. Handles project not found error
   */
  private loadProject(id: string | null): void {
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.resetComponentState();

    this.projectState.projects$
      .pipe(take(1))
      .subscribe(projects => {
        const foundProject = projects.find(p => p.id.toString() === id);

        if (foundProject) {
          this.initializeProject(foundProject, projects);
        } else {
          this.handleProjectNotFound();
        }
      });
  }

  /**
   * Resets component state for new project load.
   */
  private resetComponentState(): void {
    this.project = null;
    this.relatedProjects = [];
    this.carouselService.reset();
  }

  /**
   * Initializes project and related components.
   * 
   * @param project - The loaded project
   * @param allProjects - Complete list of projects for finding related ones
   */
  private initializeProject(project: GitHubRepo, allProjects: GitHubRepo[]): void {
    this.project = project;
    this.addMockScreenshots();

    if (project.screenshots && project.screenshots.length > 0) {
      this.carouselService.initialize(project.screenshots.length);
    }

    this.relatedProjects = this.relatedProjectsService.findRelatedProjects(
      project,
      allProjects
    );
  }

  /**
   * Handles project not found error.
   * Shows snackbar notification and redirects to home.
   */
  private handleProjectNotFound(): void {
    this.snackBar.open('Project not found', 'Close', { duration: 3000 });
    this.router.navigate(['/']);
  }

  /**
   * TODO: Remove when real screenshots are available.
   * Adds mock screenshots for demonstration purposes.
   */
  private addMockScreenshots(): void {
    if (this.project) {
      this.project.screenshots = [
        'https://images.unsplash.com/photo-1533022139390-e31c488d69e2?q=80&w=1032&auto=format&fit=crop',
        'https://plus.unsplash.com/premium_photo-1721955487745-a2c3aea86d1c?q=80&w=1032&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1170&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1170&auto=format&fit=crop',
      ];
    }
  }

  // ==================== Carousel Methods ====================

  /**
   * Navigates to next carousel image.
   */
  nextImage(): void {
    if (this.carouselService.next()) {
      this.announceImageChange();
    }
  }

  /**
   * Navigates to previous carousel image.
   */
  previousImage(): void {
    if (this.carouselService.previous()) {
      this.announceImageChange();
    }
  }

  /**
   * Navigates to specific carousel image.
   * 
   * @param index - Target image index
   */
  goToImage(index: number): void {
    if (this.carouselService.goTo(index)) {
      this.announceImageChange();
    }
  }

  /**
   * Handles keyboard navigation for carousel.
   * 
   * @param event - Keyboard event
   * 
   * Supported keys:
   * - ArrowLeft: Previous image
   * - ArrowRight: Next image
   * - Home: First image
   * - End: Last image
   */
  onKeyDown(event: KeyboardEvent): void {
    const handlers: Record<string, () => void> = {
      'ArrowLeft': () => this.previousImage(),
      'ArrowRight': () => this.nextImage(),
      'Home': () => {
        this.carouselService.goToFirst();
        this.announceImageChange();
      },
      'End': () => {
        this.carouselService.goToLast();
        this.announceImageChange();
      }
    };

    const handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }

  /**
   * Announces image change to screen readers by focusing carousel container.
   */
  private announceImageChange(): void {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.focus();
    }
  }

  /**
   * Opens screenshot in new tab.
   * 
   * @param screenshot - Screenshot URL
   */
  openImageModal(screenshot: string): void {
    window.open(screenshot, '_blank');
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigates to related project detail page.
   * 
   * @param projectId - ID of related project
   */
  navigateToProject(projectId: number): void {
    this.router.navigate(['/project', projectId]);
  }

  /**
   * Navigates back to homepage.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Opens project's GitHub repository in new tab.
   * Constructs URL from username and project name.
   */
  openGithub(): void {
    if (this.project?.name) {
      const repoName = this.formatRepoName(this.project.name);
      const githubUrl = `https://github.com/${this.GITHUB_USERNAME}/${repoName}`;
      window.open(githubUrl, '_blank');
    }
  }

  /**
   * Opens project's homepage in new tab.
   */
  openHomepage(): void {
    if (this.project?.homepage) {
      window.open(this.project.homepage, '_blank');
    }
  }

  /**
   * Formats project name for GitHub URL.
   * Converts to lowercase and replaces spaces with hyphens.
   * 
   * @param name - Project name
   * @returns Formatted repository name
   */
  private formatRepoName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}