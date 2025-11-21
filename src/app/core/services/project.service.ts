import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GitHubRepo } from '../interface/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient)
  private username = 'raulciprian-tudor'
  private apiUrl = `https://api.github.com/users/${this.username}/repos`;

  getRepoFromGithHub(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(this.apiUrl, {
      params: {
        sort: 'updated',
        per_page: '100'
      }
    })
  };

  transformToProjects(): Observable<any[]> {
    return this.getRepoFromGithHub().pipe(
      map(repos => repos.map(repo => ({
        id: `proj-${repo.id}`,
        name: repo.name!.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'No description available',
        techStack: repo.topics!.length > 0 ? repo.topics : [repo.language],
        url: repo.url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        updated_at: repo.updated_at,
      })))
    );
  }
}