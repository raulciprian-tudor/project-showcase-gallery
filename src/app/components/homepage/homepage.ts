import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { GitHubRepo } from '../../core/interface/project.interface';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCard } from '../project-card/project-card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Filter } from '../filter/filter';
import { SearchBar } from '../search-bar/search-bar';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-homepage',
  imports: [
    ProjectCard,
    MatGridListModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormField,
    MatSelectModule,
    Filter,
    AsyncPipe,
    SearchBar
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private route = inject(ActivatedRoute);
  private router = inject(Router)

  viewMode: 'grid' | 'list' = 'grid';
  projectService = inject(ProjectService);
  projects: GitHubRepo[] = [];
  filteredProjects: GitHubRepo[] = [];
  availableTechs: string[] = [];
  selectedTechs: string[] = [];
  searchTerm: string = '';
  sortOption: string = 'name-asc';

  ngOnInit(): void {
    this.projectService.transformToProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.availableTechs = this.extractUniqueTechs(projects);

        // Load state from url params
        this.loadStateFromUrl();

        // Apply filters after loading state
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching GitHub repos:', error)
      }
    })
  }

  private loadStateFromUrl() {
    this.route.queryParams.subscribe(params => {
      // Load search term
      this.searchTerm = params['search'] || '';

      // Load selected techs
      if (params['techs']) {
        this.selectedTechs = params['techs'].split(',');
      }

      // Load sort options
      this.sortOption = params['sort'] || 'name-asc';

      // Load view mode
      this.viewMode = params['view'] === 'list' ? 'list' : 'grid';

      // Apply filters with loaded state
      if (this.projects.length > 0) {
        this.applyFilters();
      }
    });
  }

  private updateUrl() {
    const queryParams: any = {};

    // Add search to URL if present
    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }

    // Add techs to URL if any selected
    if (this.selectedTechs.length > 0) {
      queryParams.techs = this.selectedTechs.join(',');
    }
    // Add sort if not default
    if (this.sortOption !== 'name-asc') {
      queryParams.sort = this.sortOption;
    }
    // Add view mode if not default
    if (this.viewMode !== 'grid') {
      queryParams.view = this.viewMode;
    }
    // Update URL without reloading page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: false
    });
  }

  onSortChange() {
    this.applyFilters();
    this.updateUrl();
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
    this.updateUrl();
  }

  onFilterChange(selectedTechs: string[]) {
    this.selectedTechs = selectedTechs;
    this.applyFilters();
    this.updateUrl();
  }

  onViewModeChange() {
    this.updateUrl();
  }

  private applyFilters() {
    let filtered = this.projects;

    // Apply tech filter
    if (this.selectedTechs.length > 0) {
      filtered = filtered.filter(project =>
        this.selectedTechs.some(tech =>
          project.techStack.some((stack: string) =>
            stack.toLowerCase() === tech.toLowerCase()
          )
        )
      );
    }

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }

    filtered = this.sortProjects(filtered);

    this.filteredProjects = filtered;
  }

  sortProjects(projects: GitHubRepo[]): GitHubRepo[] {
    const sorted = [...projects];

    switch (this.sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'stars-desc':
        return sorted.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
      case 'stars-asc':
        return sorted.sort((a, b) => (a.stargazers_count || 0) - (b.stargazers_count || 0));
      case 'date-desc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.updated_at || 0).getTime();
          const dateB = new Date(b.updated_at || 0).getTime();
          return dateB - dateA;
        });
      case 'date-asc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.updated_at || 0).getTime();
          const dateB = new Date(b.updated_at || 0).getTime();
          return dateA - dateB;
        });
      default:
        return sorted;
    }
  }

  extractUniqueTechs(projects: GitHubRepo[]): string[] {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.techStack.forEach(tech => {
        techSet.add(tech)
      });
    });
    return Array.from(techSet).sort();
  }

  cols$ = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
  ]).pipe(
    map(result => {
      if (result.breakpoints[Breakpoints.XSmall]) return 1;
      if (result.breakpoints[Breakpoints.Small]) return 2;
      return 3
    })
  )
}
