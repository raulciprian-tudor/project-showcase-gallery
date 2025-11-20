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


@Component({
  selector: 'app-homepage',
  imports: [ProjectCard, MatGridListModule, AsyncPipe, MatButtonToggleModule, MatIconModule, Filter],
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

  onFilterChange(selectedTechs: string[]) {
    if (selectedTechs.length === 0) {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project => selectedTechs.some(tech =>
        project.techStack.some((stack: string) => stack.toLowerCase() === tech.toLowerCase())
      ))
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
