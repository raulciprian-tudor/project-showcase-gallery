import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectInterface } from './core/interface/project.interface';
import { ProjectService } from './core/services/project.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('project-showcase-gallery');

  projects: ProjectInterface[] = [];
  projectById: ProjectInterface = {
    id: '',
    name: '',
    developer: '',
    techStack: '',
    status: '',
  };

  demoProject: ProjectInterface = {
    id: 'proj-010',
    name: 'Demo App',
    developer: 'Tudor Ciprian',
    techStack: 'Angular',
    status: 'Complete',
  };

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (error) => {
        console.error('Error fetching projects: ', error);
      },
    });

    // get project by ID
    this.projectService.getProjectById('proj-005').subscribe({
      next: (data) => {
        if (data) {
          this.projectById = data;
        }
      },
      error: (error) => {
        console.error('Error fetching project: ', error);
      },
    });
  }
}
