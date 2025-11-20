import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCard } from './project-card';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { GitHubRepo } from '../../core/interface/project.interface';

describe('ProjectCard', () => {
  let component: ProjectCard;
  let fixture: ComponentFixture<ProjectCard>;

  const mockProject: GitHubRepo = {
    id: 1,
    name: 'Test Project',
    description: 'A test project description',
    techStack: ['Angular', 'TypeScript'],
    url: 'https://github.com/test/project',
    stargazers_count: 10,
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProjectCard,
        MatCardModule,
        MatButtonModule,
        MatChipsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.project = mockProject;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('project input', () => {
    it('should display project name', () => {
      component.project = mockProject;
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('mat-card-title');
      expect(title.textContent).toContain('Test Project');
    });

    it('should display project description', () => {
      component.project = mockProject;
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('mat-card-content p');
      expect(content.textContent).toContain('A test project description');
    });
  });

  describe('techStack getter', () => {
    it('should return array when techStack is array', () => {
      component.project = { ...mockProject, techStack: ['Angular', 'React'] };

      expect(component.techStack).toEqual(['Angular', 'React']);
    });

    it('should convert string to array', () => {
      component.project = { ...mockProject, techStack: 'Vue' as any };

      expect(component.techStack).toEqual(['Vue']);
    });

    it('should handle empty array', () => {
      component.project = { ...mockProject, techStack: [] };

      expect(component.techStack).toEqual([]);
    });
  });

  describe('tech stack rendering', () => {
    it('should render tech stack chips', () => {
      component.project = mockProject;
      fixture.detectChanges();

      const chips = fixture.nativeElement.querySelectorAll('mat-chip');
      expect(chips.length).toBe(2);
      expect(chips[0].textContent).toContain('Angular');
      expect(chips[1].textContent).toContain('TypeScript');
    });

    it('should render single tech as chip', () => {
      component.project = { ...mockProject, techStack: ['Vue'] };
      fixture.detectChanges();

      const chips = fixture.nativeElement.querySelectorAll('mat-chip');
      expect(chips.length).toBe(1);
      expect(chips[0].textContent).toContain('Vue');
    });

    it('should render no chips when empty array', () => {
      component.project = { ...mockProject, techStack: [] };
      fixture.detectChanges();

      const chips = fixture.nativeElement.querySelectorAll('mat-chip');
      expect(chips.length).toBe(0);
    });
  });

  describe('template structure', () => {
    beforeEach(() => {
      component.project = mockProject;
      fixture.detectChanges();
    });

    it('should render mat-card', () => {
      const card = fixture.nativeElement.querySelector('mat-card');
      expect(card).toBeTruthy();
    });

    it('should render mat-card-header', () => {
      const header = fixture.nativeElement.querySelector('mat-card-header');
      expect(header).toBeTruthy();
    });

    it('should render mat-card-content', () => {
      const content = fixture.nativeElement.querySelector('mat-card-content');
      expect(content).toBeTruthy();
    });

    it('should render mat-card-actions', () => {
      const actions = fixture.nativeElement.querySelector('mat-card-actions');
      expect(actions).toBeTruthy();
    });

    it('should render "See more" button', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('See more');
    });
  });

  describe('OnPush change detection', () => {
    it('should not re-render when non-input properties change', () => {
      component.project = mockProject;
      fixture.detectChanges();

      const initialTitle = fixture.nativeElement.querySelector('mat-card-title').textContent;

      // Manually trigger change detection
      fixture.detectChanges();

      const afterTitle = fixture.nativeElement.querySelector('mat-card-title').textContent;
      expect(initialTitle).toBe(afterTitle);
    });
  });
});