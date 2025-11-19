import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProjectInterface } from '../../core/interface/project.interface';
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
  projects: ProjectInterface[] = [];

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (data: ProjectInterface[]) => {
        this.projects = data;
      },
      error: (error) => {
        console.error('Error loading projects: ', error);
      },
    });
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
