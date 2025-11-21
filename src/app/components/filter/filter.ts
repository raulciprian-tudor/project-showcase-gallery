import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

/**
 * Component for filtering projects by technology stack.
 * Features:
 * - Multi-select chip-based technology filter
 * - Syncs with parent state
 * - Emits filter changes to parent component
 */
@Component({
  selector: 'app-filter',
  imports: [MatToolbarModule, MatChipsModule, FormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter implements OnChanges {
  @Input() availableTechs: string[] = [];
  @Input() initialSelectedTechs: string[] = [];
  @Output() filterChange = new EventEmitter<string[]>();

  selectedTechs: string[] = [];

  /**
   * Syncs local selected techs with parent state on input changes.
   *
   * @param changes - Input property changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSelectedTechs'] && changes['initialSelectedTechs'].currentValue) {
      this.selectedTechs = [...changes['initialSelectedTechs'].currentValue];
    }
  }

  /**
   * Emits filter change event to parent component.
   *
   * @param selectedTechs - Array of selected technology names
   */
  onSelectionChange(selectedTechs: string[]): void {
    this.filterChange.emit(selectedTechs);
  }
}
