import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { GitHubRepo, ProjectInterface } from '../../core/interface/project.interface';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCard } from '../project-card/project-card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Filter } from '../filter/filter';
import { SearchBar } from '../search-bar/search-bar';


@Component({
  selector: 'app-homepage',
  imports: [ProjectCard, MatGridListModule, MatButtonToggleModule, MatIconModule, Filter, AsyncPipe, SearchBar],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  viewMode: 'grid' | 'list' = 'grid';

  projectService = inject(ProjectService);
  projects: GitHubRepo[] = [];
  filteredProjects: GitHubRepo[] = [];
  availableTechs: string[] = [];
  selectedTechs: string[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.projectService.transformToProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.availableTechs = this.extractUniqueTechs(projects);
      },
      error: (error) => {
        console.error('Error fetching GitHub repos:', error)
      }
    })
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  onFilterChange(selectedTechs: string[]) {
    this.selectedTechs = selectedTechs;
    this.applyFilters();
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
      )
    };

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }

    this.filteredProjects = filtered;
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
