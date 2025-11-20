import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBar } from './search-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleChange } from '@angular/core';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchBar,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('searchControl', () => {
    it('should initialize with empty string', () => {
      expect(component.searchControl.value).toBe('');
    });

    it('should emit search changes with debounce', fakeAsync(() => {
      let emittedValue: string | undefined;
      component.searchChange.subscribe(value => {
        emittedValue = value;
      });

      component.searchControl.setValue('test');
      tick(200); // Before debounce time
      expect(emittedValue).toBeUndefined();

      tick(100); // After debounce time (300ms total)
      expect(emittedValue).toBe('test');
    }));

    it('should emit empty string when value is null', fakeAsync(() => {
      let emittedValue: string | undefined;
      component.searchChange.subscribe(value => {
        emittedValue = value;
      });

      component.searchControl.setValue(null);
      tick(300);
      expect(emittedValue).toBe('');
    }));

    it('should only emit distinct values', fakeAsync(() => {
      const emittedValues: string[] = [];
      component.searchChange.subscribe(value => {
        emittedValues.push(value);
      });

      component.searchControl.setValue('test');
      tick(300);

      component.searchControl.setValue('test'); // Same value
      tick(300);

      expect(emittedValues.length).toBe(1);
      expect(emittedValues[0]).toBe('test');
    }));

    it('should emit when distinct values change', fakeAsync(() => {
      const emittedValues: string[] = [];
      component.searchChange.subscribe(value => {
        emittedValues.push(value);
      });

      component.searchControl.setValue('test');
      tick(300);

      component.searchControl.setValue('test2'); // Different value
      tick(300);

      expect(emittedValues.length).toBe(2);
      expect(emittedValues).toEqual(['test', 'test2']);
    }));
  });

  describe('initialValue input', () => {
    it('should set control value on changes', () => {
      component.ngOnChanges({
        initialValue: new SimpleChange(null, 'initial', true)
      });

      expect(component.searchControl.value).toBe('initial');
    });

    it('should not emit when setting initial value', fakeAsync(() => {
      let emitted = false;
      component.searchChange.subscribe(() => {
        emitted = true;
      });

      component.ngOnChanges({
        initialValue: new SimpleChange(null, 'test', true)
      });
      tick(300);

      expect(emitted).toBe(false);
    }));

    it('should handle empty string', () => {
      component.ngOnChanges({
        initialValue: new SimpleChange(null, '', true)
      });

      expect(component.searchControl.value).toBe('');
    });

    it('should not set value when undefined', () => {
      component.searchControl.setValue('existing');

      component.ngOnChanges({
        initialValue: new SimpleChange(null, undefined, true)
      });

      expect(component.searchControl.value).toBe('existing');
    });
  });

  describe('clearSearch', () => {
    it('should clear the search control', () => {
      component.searchControl.setValue('test');
      component.clearSearch();

      expect(component.searchControl.value).toBe('');
    });

    it('should emit change when clearing', fakeAsync(() => {
      let emittedValue: string | undefined;
      component.searchChange.subscribe(value => {
        emittedValue = value;
      });

      component.searchControl.setValue('test');
      tick(300);

      component.clearSearch();
      tick(300);

      expect(emittedValue).toBe('');
    }));
  });

  describe('template rendering', () => {
    it('should render mat-form-field', () => {
      const formField = fixture.nativeElement.querySelector('mat-form-field');
      expect(formField).toBeTruthy();
    });

    it('should render input with correct attributes', () => {
      const input = fixture.nativeElement.querySelector('input');
      expect(input).toBeTruthy();
      expect(input.getAttribute('type')).toBe('text');
      expect(input.getAttribute('placeholder')).toBe('Search by project name...');
    });

    it('should show clear button when input has value', () => {
      component.searchControl.setValue('test');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear search"]');
      expect(clearButton).toBeTruthy();
    });

    it('should hide clear button when input is empty', () => {
      component.searchControl.setValue('');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear search"]');
      expect(clearButton).toBeFalsy();
    });

    it('should call clearSearch when clear button clicked', () => {
      spyOn(component, 'clearSearch');
      component.searchControl.setValue('test');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear search"]');
      clearButton.click();

      expect(component.clearSearch).toHaveBeenCalled();
    });
  });

  describe('memory cleanup', () => {
    it('should unsubscribe on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});