import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlSyncService } from './url-sync.service';
import { ProjectFilterState } from '../interface/project.interface';

describe('UrlSyncService', () => {
  let service: UrlSyncService;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpy = {
      snapshot: {
        queryParams: {}
      }
    };

    TestBed.configureTestingModule({
      providers: [
        UrlSyncService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    });

    service = TestBed.inject(UrlSyncService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadStateFromUrl', () => {
    it('should load default state when no params', () => {
      route.snapshot.queryParams = {};

      const state = service.loadStateFromUrl();

      expect(state).toEqual({
        searchTerm: '',
        selectedTechs: [],
        sortOption: 'name-asc',
        viewMode: 'grid'
      });
    });

    it('should load search term from URL', () => {
      route.snapshot.queryParams = { search: 'angular' };

      const state = service.loadStateFromUrl();

      expect(state.searchTerm).toBe('angular');
    });

    it('should load selected techs from URL', () => {
      route.snapshot.queryParams = { techs: 'Angular,TypeScript,React' };

      const state = service.loadStateFromUrl();

      expect(state.selectedTechs).toEqual(['Angular', 'TypeScript', 'React']);
    });

    it('should load sort option from URL', () => {
      route.snapshot.queryParams = { sort: 'stars-desc' };

      const state = service.loadStateFromUrl();

      expect(state.sortOption).toBe('stars-desc');
    });

    it('should load list view mode from URL', () => {
      route.snapshot.queryParams = { view: 'list' };

      const state = service.loadStateFromUrl();

      expect(state.viewMode).toBe('list');
    });

    it('should default to grid view for invalid view param', () => {
      route.snapshot.queryParams = { view: 'invalid' };

      const state = service.loadStateFromUrl();

      expect(state.viewMode).toBe('grid');
    });

    it('should load complete state from URL', () => {
      route.snapshot.queryParams = {
        search: 'test',
        techs: 'Vue,React',
        sort: 'date-desc',
        view: 'list'
      };

      const state = service.loadStateFromUrl();

      expect(state).toEqual({
        searchTerm: 'test',
        selectedTechs: ['Vue', 'React'],
        sortOption: 'date-desc',
        viewMode: 'list'
      });
    });
  });

  describe('syncStateToUrl', () => {
    it('should sync empty state to URL', () => {
      const state: ProjectFilterState = {
        searchTerm: '',
        selectedTechs: [],
        sortOption: 'name-asc',
        viewMode: 'grid'
      };

      service.syncStateToUrl(state);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
        replaceUrl: false
      });
    });

    it('should sync search term to URL', () => {
      const state: ProjectFilterState = {
        searchTerm: 'angular',
        selectedTechs: [],
        sortOption: 'name-asc',
        viewMode: 'grid'
      };

      service.syncStateToUrl(state);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { search: 'angular' },
        replaceUrl: false
      });
    });

    it('should sync selected techs to URL', () => {
      const state: ProjectFilterState = {
        searchTerm: '',
        selectedTechs: ['Angular', 'TypeScript'],
        sortOption: 'name-asc',
        viewMode: 'grid'
      };

      service.syncStateToUrl(state);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { techs: 'Angular,TypeScript' },
        replaceUrl: false
      });
    });

    it('should sync non-default sort to URL', () => {
      const state: ProjectFilterState = {
        searchTerm: '',
        selectedTechs: [],
        sortOption: 'stars-desc',
        viewMode: 'grid'
      };

      service.syncStateToUrl(state);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { sort: 'stars-desc' },
        replaceUrl: false
      });
    });

    it('should not sync default sort to URL', () => {
      const state: ProjectFilterState = {
        searchTerm: '',
        selectedTechs: [],
        sortOption: 'name-asc',
        viewMode: 'grid'
      };

      service.syncStateToUrl(state);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
        replaceUrl: false
      });
    });

    it('should sync list view mode to URL', () => {
      const state: ProjectFilterState = {
        searchTerm: '',
        selectedTechs: [],
        sortOption: 'name-asc',
        viewMode: 'list'
      };

      service.syncStateToUrl(state);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { view: 'list' },
        replaceUrl: false
      });
    });

    it('should sync complete state to URL', () => {
      const state: ProjectFilterState = {
        searchTerm: 'test',
        selectedTechs: ['Vue', 'React'],
        sortOption: 'date-desc',
        viewMode: 'list'
      };

      service.syncStateToUrl(state);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {
          search: 'test',
          techs: 'Vue,React',
          sort: 'date-desc',
          view: 'list'
        },
        replaceUrl: false
      });
    });
  });
});