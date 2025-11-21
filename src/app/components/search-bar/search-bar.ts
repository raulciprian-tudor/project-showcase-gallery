import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

/**
 * Search bar component with debounced input.
 * Features:
 * - Debounced search input (300ms)
 * - Clear button
 * - Syncs with parent state
 * - Prevents duplicate search events
 */
@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnChanges, OnDestroy {
  @Input() initialValue: string = '';
  @Output() searchChange = new EventEmitter<string>();

  searchControl = new FormControl<string>('');
  private destroy$ = new Subject<void>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.searchChange.emit(value || '')
      });
  }

  /**
   * Syncs search input with parent state on input changes.
   *
   * @param changes - Input property changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue']?.currentValue !== undefined) {
      this.searchControl.setValue(changes['initialValue'].currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Clears search input and triggers search event.
   */
  clearSearch() {
    this.searchControl.setValue('', { emitEvent: true });
  }
}
