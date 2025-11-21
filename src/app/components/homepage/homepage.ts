import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProjectService, } from '../../core/services/project.service';
import { ProjectCard } from '../project-card/project-card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { map, Subject, takeUntil, startWith, pairwise, distinctUntilChanged } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Filter } from '../filter/filter';
import { SearchBar } from '../search-bar/search-bar';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProjectStateService } from '../../core/services/project-state.service';
import { UrlSyncService } from '../../core/services/url-sync.service';

/**
 * Main homepage component displaying project portfolio.
 * Features:
 * - Responsive grid/list view toggle
 * - Project search and filtering by technology
 * - Multiple sort options (name, stars, date)
 * - URL state synchronization
 * - Adaptive column layout based on screen size
 */
@Component({
  selector: 'app-homepage',
  imports: [
    ProjectCard,
    MatGridListModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormField,
    MatSelectModule,
    Filter,
    AsyncPipe,
    SearchBar
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private projectService = inject(ProjectService);
  private projectState = inject(ProjectStateService);
  private urlSync = inject(UrlSyncService);
  private destroy$ = new Subject<void>();
  private isInitialLoad = true;
  private viewModeSubject = new Subject<'grid' | 'list'>

  filteredProjects$ = this.projectState.filteredProjects$;
  availableTechs$ = this.projectState.availableTechs$;
  state$ = this.projectState.state$;

  private _viewMode: 'grid' | 'list' = 'grid';
  get viewMode(): 'grid' | 'list' {
    return this._viewMode;
  }

  set viewMode(value: 'grid' | 'list') {
    this._viewMode = value;
    this.viewModeSubject.next(value);
  }

  selectedTechs: string[] = [];
  searchTerm: string = '';
  sortOption: string = 'name-asc';

  /**
   * Observable that determines number of grid columns based on screen size.
   * - XSmall: 1 column
   * - Small: 2 columns
   * - Medium+: 3 columns
   */
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

  ngOnInit(): void {

    this.viewModeSubject
      .pipe(
        startWith(this._viewMode),
        distinctUntilChanged(),
        pairwise(),
        takeUntil(this.destroy$)
      )
      .subscribe(([prev, curr]) => {
        if (!this.isInitialLoad && prev !== curr) {
          this.projectState.updateState({ viewMode: curr })
        }
      })

    // Sync local state with service state
    this.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this._viewMode = state.viewMode;
        this.selectedTechs = state.selectedTechs;
        this.searchTerm = state.searchTerm;
        this.sortOption = state.sortOption;

        // Sync to URL
        if (!this.isInitialLoad) {
          this.urlSync.syncStateToUrl(state);
        }
      });

    this.projectService.transformToProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.projectState.setProjects(projects);

          // Load initial state from URL
          const urlState = this.urlSync.loadStateFromUrl();
          this.projectState.setState(urlState);

          setTimeout(() => this.isInitialLoad = false, 0);
        },
        error: (error) => {
          console.error('Error fetching GitHub repos:', error)
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles search term changes from search bar.
   *
   * @param term - Search term entered by user
   */
  onSearchChange(term: string) {
    this.projectState.updateState({ searchTerm: term });
  }

  /**
   * Handles filter changes from filter component.
   *
   * @param selectedTechs - Array of selected technology filters
   */
  onFilterChange(selectedTechs: string[]) {
    this.projectState.updateState({ selectedTechs: selectedTechs });
  }

  /**
   * Handles sort option changes from dropdown.
   */
  onSortChange() {
    this.projectState.updateState({ sortOption: this.sortOption });
  }
}
