import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSelectedTechs'] && changes['initialSelectedTechs'].currentValue) {
      this.selectedTechs = [...changes['initialSelectedTechs'].currentValue];
    }
  }

  onSelectionChange(selectedTechs: string[]): void {
    this.filterChange.emit(selectedTechs);
  }
}
