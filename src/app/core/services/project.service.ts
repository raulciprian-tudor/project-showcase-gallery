import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProjectInterface } from '../interface/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectInterface[]> {
    return this.http.get<ProjectInterface[]>('dummy-projects.json');
  }

  getProjectById(id: string): Observable<ProjectInterface | undefined> {
    return this.http
      .get<ProjectInterface[]>('dummy-projects.json')
      .pipe(map((projects) => projects.find((project) => project.id === id)));
  }
}
