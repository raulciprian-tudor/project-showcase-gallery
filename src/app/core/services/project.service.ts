import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GitHubRepo } from '../interface/project.interface';

/**
 * Service for fetching and transforming GitHub repository data.
 * Features:
 * - Fetches repositories from GitHub API
 * - Transforms repository data into project format
 * - Normalizes project names and tech stacks
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient)
  private username = 'raulciprian-tudor'
  private apiUrl = `https://api.github.com/users/${this.username}/repos`;

  /**
   * Fetches repositories from GitHub API.
   *
   * @returns Observable of GitHub repositories sorted by last update
   */
  getRepoFromGithHub(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(this.apiUrl, {
      params: {
        sort: 'updated',
        per_page: '100'
      }
    })
  };

  /**
   * Transforms GitHub repositories into project format.
   *
   * @returns Observable of transformed projects
   *
   * Transformations:
   * - Converts kebab-case names to Title Case
   * - Uses topics as tech stack, falls back to primary language
   * - Adds default description for repos without one
   * - Normalizes property names for application use
   */
  transformToProjects(): Observable<any[]> {
    return this.getRepoFromGithHub().pipe(
      map((repos) => repos.map(repo => ({
        id: `proj-${repo.id}`,
        name: repo.name!.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'No description available',
        techStack: repo.topics!.length > 0 ? repo.topics : [repo.language],
        url: repo.url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
      })))
    );
  }
}