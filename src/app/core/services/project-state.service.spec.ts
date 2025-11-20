import { TestBed } from '@angular/core/testing';
import { ProjectStateService } from './project-state.service';
import { GitHubRepo, ProjectFilterState } from '../interface/project.interface';

describe('ProjectStateService', () => {
  let service: ProjectStateService;

  const mockProjects: GitHubRepo[] = [
    {
      id: 1,
      name: 'Angular Project',
      description: 'An Angular app',
      techStack: ['Angular', 'TypeScript'],
      url: 'https://github.com/test/angular',
      stargazers_count: 10,
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 2,
      name: 'React Project',
      description: 'A React app',
      techStack: ['React', 'JavaScript'],
      url: 'https://github.com/test/react',
      stargazers_count: 5,
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: 3,
      name: 'Vue Project',
      description: 'A Vue app',
      techStack: ['Vue', 'TypeScript'],
      url: 'https://github.com/test/vue',
      stargazers_count: 15,
      updated_at: '2024-01-20T00:00:00Z'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setProjects', () => {
    it('should set projects', (done) => {
      service.projects$.subscribe(projects => {
        expect(projects).toEqual(mockProjects);
        done();
      });

      service.setProjects(mockProjects);
    });
  });

  describe('updateState', () => {
    it('should update partial state', (done) => {
      service.updateState({ searchTerm: 'test' });

      service.state$.subscribe(state => {
        expect(state.searchTerm).toBe('test');
        expect(state.sortOption).toBe('name-asc'); // default value
        done();
      });
    });

    it('should update multiple state properties', (done) => {
      service.updateState({
        searchTerm: 'angular',
        selectedTechs: ['Angular', 'TypeScript'],
        sortOption: 'stars-desc'
      });

      service.state$.subscribe(state => {
        expect(state.searchTerm).toBe('angular');
        expect(state.selectedTechs).toEqual(['Angular', 'TypeScript']);
        expect(state.sortOption).toBe('stars-desc');
        done();
      });
    });
  });

  describe('getState', () => {
    it('should return current state', () => {
      service.updateState({ searchTerm: 'test' });
      const state = service.getState();

      expect(state.searchTerm).toBe('test');
    });
  });

  describe('setState', () => {
    it('should set complete state', (done) => {
      const newState: ProjectFilterState = {
        searchTerm: 'vue',
        selectedTechs: ['Vue'],
        sortOption: 'date-desc',
        viewMode: 'list'
      };

      service.setState(newState);

      service.state$.subscribe(state => {
        expect(state).toEqual(newState);
        done();
      });
    });
  });

  describe('filteredProjects$', () => {
    beforeEach(() => {
      service.setProjects(mockProjects);
    });

    it('should return all projects when no filters applied', (done) => {
      service.filteredProjects$.subscribe(projects => {
        expect(projects.length).toBe(3);
        done();
      });
    });

    it('should filter by search term', (done) => {
      service.updateState({ searchTerm: 'angular' });

      service.filteredProjects$.subscribe(projects => {
        expect(projects.length).toBe(1);
        expect(projects[0].name).toBe('Angular Project');
        done();
      });
    });

    it('should filter by tech stack', (done) => {
      service.updateState({ selectedTechs: ['TypeScript'] });

      service.filteredProjects$.subscribe(projects => {
        expect(projects.length).toBe(2);
        expect(projects.map(p => p.name)).toContain('Angular Project');
        expect(projects.map(p => p.name)).toContain('Vue Project');
        done();
      });
    });

    it('should filter by multiple tech stack items', (done) => {
      service.updateState({ selectedTechs: ['Angular', 'React'] });

      service.filteredProjects$.subscribe(projects => {
        expect(projects.length).toBe(2);
        done();
      });
    });

    it('should combine search and tech filters', (done) => {
      service.updateState({
        searchTerm: 'project',
        selectedTechs: ['TypeScript']
      });

      service.filteredProjects$.subscribe(projects => {
        expect(projects.length).toBe(2);
        done();
      });
    });

    it('should sort by name ascending', (done) => {
      service.updateState({ sortOption: 'name-asc' });

      service.filteredProjects$.subscribe(projects => {
        expect(projects[0].name).toBe('Angular Project');
        expect(projects[1].name).toBe('React Project');
        expect(projects[2].name).toBe('Vue Project');
        done();
      });
    });

    it('should sort by name descending', (done) => {
      service.updateState({ sortOption: 'name-desc' });

      service.filteredProjects$.subscribe(projects => {
        expect(projects[0].name).toBe('Vue Project');
        expect(projects[1].name).toBe('React Project');
        expect(projects[2].name).toBe('Angular Project');
        done();
      });
    });

    it('should sort by stars descending', (done) => {
      service.updateState({ sortOption: 'stars-desc' });

      service.filteredProjects$.subscribe(projects => {
        expect(projects[0].stargazers_count).toBe(15);
        expect(projects[1].stargazers_count).toBe(10);
        expect(projects[2].stargazers_count).toBe(5);
        done();
      });
    });

    it('should sort by stars ascending', (done) => {
      service.updateState({ sortOption: 'stars-asc' });

      service.filteredProjects$.subscribe(projects => {
        expect(projects[0].stargazers_count).toBe(5);
        expect(projects[1].stargazers_count).toBe(10);
        expect(projects[2].stargazers_count).toBe(15);
        done();
      });
    });

    it('should sort by date descending', (done) => {
      service.updateState({ sortOption: 'date-desc' });

      service.filteredProjects$.subscribe(projects => {
        expect(projects[0].name).toBe('Vue Project'); // 2024-01-20
        expect(projects[1].name).toBe('Angular Project'); // 2024-01-15
        expect(projects[2].name).toBe('React Project'); // 2024-01-10
        done();
      });
    });

    it('should sort by date ascending', (done) => {
      service.updateState({ sortOption: 'date-asc' });

      service.filteredProjects$.subscribe(projects => {
        expect(projects[0].name).toBe('React Project'); // 2024-01-10
        expect(projects[1].name).toBe('Angular Project'); // 2024-01-15
        expect(projects[2].name).toBe('Vue Project'); // 2024-01-20
        done();
      });
    });
  });

  describe('availableTechs$', () => {
    it('should extract unique technologies', (done) => {
      service.setProjects(mockProjects);

      service.availableTechs$.subscribe(techs => {
        expect(techs.length).toBe(4);
        expect(techs).toContain('Angular');
        expect(techs).toContain('React');
        expect(techs).toContain('Vue');
        expect(techs).toContain('TypeScript');
        expect(techs).toContain('JavaScript');
        done();
      });
    });

    it('should return sorted technologies', (done) => {
      service.setProjects(mockProjects);

      service.availableTechs$.subscribe(techs => {
        expect(techs[0]).toBe('Angular');
        expect(techs[techs.length - 1]).toBe('Vue');
        done();
      });
    });

    it('should return empty array when no projects', (done) => {
      service.setProjects([]);

      service.availableTechs$.subscribe(techs => {
        expect(techs).toEqual([]);
        done();
      });
    });
  });
});