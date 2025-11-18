import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProjectInterface } from '../../core/interface/project.interface';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-homepage',
  imports: [ProjectCard, MatGridListModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements OnInit {
  projectService = inject(ProjectService);

  projects: ProjectInterface[] = [];

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (error) => {
        console.error('Error loading projects: ', error);
      },
    });
  }
}
