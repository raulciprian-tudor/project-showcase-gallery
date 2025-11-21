import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { GitHubRepo, ProjectFilterState } from '../interface/project.interface';

/**
 * Service managing global project state and filtering logic.
 * Features:
 * - Centralized state management for projects
 * - Reactive filtering and sorting
 * - Search, technology filter, and sort options
 * - Available technology extraction
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  private allProjects$ = new BehaviorSubject<GitHubRepo[]>([]);
  private filterState$ = new BehaviorSubject<ProjectFilterState>({
    searchTerm: '',
    selectedTechs: [],
    sortOption: 'name-asc',
    viewMode: 'grid',
  });

  // Exposed observables
  projects$ = this.allProjects$.asObservable();
  state$ = this.filterState$.asObservable();

  // Filtered and sorted projects
  filteredProjects$: Observable<GitHubRepo[]> = combineLatest([
    this.allProjects$,
    this.filterState$
  ]).pipe(
    map(([projects, state]) => this.applyFiltersAndSort(projects, state))
  );

  // Available tech
  availableTechs$: Observable<string[]> = this.allProjects$.pipe(
    map(projects => this.extractUniqueTechs(projects))
  );

  /**
   * Sets the complete list of projects.
   *
   * @param projects - Array of GitHub repositories
   */
  setProjects(projects: GitHubRepo[]) {
    this.allProjects$.next(projects);
  }

  /**
   * Updates filter state with partial changes.
   *
   * @param partial - Partial state updates to merge
   */
  updateState(partial: Partial<ProjectFilterState>) {
    const currentState = this.filterState$.value;
    this.filterState$.next({ ...currentState, ...partial });
  }

  /**
   * Gets current filter state snapshot.
   *
   * @returns Current filter state
   */
  getState(): ProjectFilterState {
    return this.filterState$.value;
  }

  /**
   * Sets complete filter state.
   *
   * @param state - New filter state
   */
  setState(state: ProjectFilterState) {
    this.filterState$.next(state);
  }

  /**
   * Applies all filters and sorting to projects.
   *
   * @param projects - Projects to filter
   * @param state - Current filter state
   * @returns Filtered and sorted projects
   *
   * Algorithm:
   * 1. Filters by selected technologies (if any)
   * 2. Filters by search term (if any)
   * 3. Applies selected sort option
   */
  private applyFiltersAndSort(projects: GitHubRepo[], state: ProjectFilterState): GitHubRepo[] {
    let filtered = [...projects];

    // Apply tech filter
    if (state.selectedTechs.length > 0) {
      filtered = filtered.filter(project =>
        state.selectedTechs.some(tech =>
          project.techStack!.some((stack: string) =>
            stack.toLowerCase() === tech.toLowerCase()
          )
        )
      );
    }

    // Apply search filter
    if (state.searchTerm) {
      filtered = filtered.filter(project => project.name!.toLowerCase().includes(state.searchTerm.toLowerCase()));
    }

    // Apply sorting
    return this.sortProjects(filtered, state.sortOption);
  }

  /**
   * Sorts projects based on selected option.
   *
   * @param projects - Projects to sort
   * @param sortOption - Sort option key
   * @returns Sorted projects
   *
   * Options:
   * - name-asc/desc: Alphabetical by name
   * - stars-asc/desc: By GitHub star count
   * - date-asc/desc: By last update date
   */
  private sortProjects(projects: GitHubRepo[], sortOption: string): GitHubRepo[] {
    const sorted = [...projects];

    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name!.localeCompare(b.name!));

      case 'name-desc':
        return sorted.sort((a, b) => b.name!.localeCompare(a.name!));

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

  /**
   * Extracts unique technologies from all projects.
   *
   * @param projects - Projects to extract technologies from
   * @returns Sorted array of unique technology names
   */
  private extractUniqueTechs(projects: GitHubRepo[]): string[] {
    const techSet = new Set<string>();

    projects.forEach(project => {
      project.techStack!.forEach(tech => {
        techSet.add(tech);
      });
    });
    return Array.from(techSet).sort();
  }
}
