import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Filter } from './filter';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleChange } from '@angular/core';

describe('Filter', () => {
  let component: Filter;
  let fixture: ComponentFixture<Filter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Filter,
        FormsModule,
        MatToolbarModule,
        MatChipsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Filter);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('availableTechs input', () => {
    it('should display available tech options', () => {
      component.availableTechs = ['Angular', 'React', 'Vue'];
      fixture.detectChanges();

      const chips = fixture.nativeElement.querySelectorAll('mat-chip-option');
      expect(chips.length).toBe(3);
    });

    it('should display empty list when no techs available', () => {
      component.availableTechs = [];
      fixture.detectChanges();

      const chips = fixture.nativeElement.querySelectorAll('mat-chip-option');
      expect(chips.length).toBe(0);
    });
  });

  describe('initialSelectedTechs input', () => {
    it('should update selectedTechs when initialSelectedTechs changes', () => {
      const initialTechs = ['Angular', 'TypeScript'];
      component.ngOnChanges({
        initialSelectedTechs: new SimpleChange(null, initialTechs, true)
      });

      expect(component.selectedTechs).toEqual(initialTechs);
    });

    it('should create a new array reference', () => {
      const initialTechs = ['React'];
      component.ngOnChanges({
        initialSelectedTechs: new SimpleChange(null, initialTechs, true)
      });

      expect(component.selectedTechs).not.toBe(initialTechs);
      expect(component.selectedTechs).toEqual(initialTechs);
    });

    it('should handle empty array', () => {
      component.ngOnChanges({
        initialSelectedTechs: new SimpleChange(null, [], true)
      });

      expect(component.selectedTechs).toEqual([]);
    });

    it('should handle null/undefined', () => {
      component.ngOnChanges({
        initialSelectedTechs: new SimpleChange(null, null, true)
      });

      expect(component.selectedTechs).toEqual([]);
    });
  });

  describe('filterChange output', () => {
    it('should emit when selection changes', (done) => {
      component.filterChange.subscribe((techs: string[]) => {
        expect(techs).toEqual(['Angular']);
        done();
      });

      component.onSelectionChange(['Angular']);
    });

    it('should emit empty array when clearing selection', (done) => {
      component.selectedTechs = ['Angular', 'React'];

      component.filterChange.subscribe((techs: string[]) => {
        expect(techs).toEqual([]);
        done();
      });

      component.onSelectionChange([]);
    });

    it('should emit multiple selected techs', (done) => {
      component.filterChange.subscribe((techs: string[]) => {
        expect(techs).toEqual(['Angular', 'React', 'Vue']);
        done();
      });

      component.onSelectionChange(['Angular', 'React', 'Vue']);
    });
  });

  describe('template rendering', () => {
    it('should render mat-toolbar', () => {
      fixture.detectChanges();
      const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
      expect(toolbar).toBeTruthy();
    });

    it('should render mat-chip-listbox with multiple selection', () => {
      fixture.detectChanges();
      const chipListbox = fixture.nativeElement.querySelector('mat-chip-listbox');
      expect(chipListbox).toBeTruthy();
      expect(chipListbox.getAttribute('multiple')).not.toBeNull();
    });

    it('should have correct aria-label', () => {
      fixture.detectChanges();
      const chipListbox = fixture.nativeElement.querySelector('mat-chip-listbox');
      expect(chipListbox.getAttribute('aria-label')).toBe('Tech Selection');
    });
  });
});