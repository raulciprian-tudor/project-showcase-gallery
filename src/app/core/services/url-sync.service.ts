import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectFilterState } from '../interface/project.interface';

/**
 * Service for synchronizing application state with URL query parameters.
 * Features:
 * - Loads initial state from URL on page load
 * - Syncs filter/search/sort state to URL
 * - Enables shareable and bookmarkable filtered views
 * - Omits default values to keep URLs clean
 */
@Injectable({
  providedIn: 'root',
})
export class UrlSyncService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /**
   * Loads filter state from URL query parameters.
   *
   * @returns Filter state parsed from URL
   *
   * Query params:
   * - search: Search term
   * - techs: Comma-separated technology list
   * - sort: Sort option (default: 'name-asc')
   * - view: View mode (default: 'grid')
   */
  loadStateFromUrl(): ProjectFilterState {
    const params = this.route.snapshot.queryParams;

    return {
      searchTerm: params['search'] || '',
      selectedTechs: params['techs'] ? params['techs'].split(',') : [],
      sortOption: params['sort'] || 'name-asc',
      viewMode: params['view'] === 'list' ? 'list' : 'grid'
    }
  }

  /**
   * Syncs current filter state to URL query parameters.
   *
   * @param state - Current filter state to sync
   *
   * Behavior:
   * - Adds history entry (replaceUrl: false)
   * - Omits default values to keep URL clean
   * - Updates URL without page reload
   */
  syncStateToUrl(state: ProjectFilterState) {
    const queryParams: any = {};

    // Add search to URL if present
    if (state.searchTerm) {
      queryParams.search = state.searchTerm;
    }

    // Add techs to URL if any selected
    if (state.selectedTechs.length > 0) {
      queryParams.techs = state.selectedTechs.join(',');
    }

    // Add sort if not default
    if (state.sortOption !== 'name-asc') {
      queryParams.sort = state.sortOption;
    }

    // Add view mode if not default
    if (state.viewMode !== 'grid') {
      queryParams.view = state.viewMode;
    }

    // Update URL without reloading page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: false
    });
  }
}
