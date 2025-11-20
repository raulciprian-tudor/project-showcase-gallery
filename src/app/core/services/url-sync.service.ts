import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectFilterState } from '../interface/project.interface';

@Injectable({
  providedIn: 'root',
})
export class UrlSyncService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loadStateFromUrl(): ProjectFilterState {
    const params = this.route.snapshot.queryParams;

    return {
      searchTerm: params['search'] || '',
      selectedTechs: params['techs'] ? params['techs'].split(',') : [],
      sortOption: params['sort'] || 'name-asc',
      viewMode: params['view'] === 'list' ? 'list' : 'grid'
    }
  }

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
