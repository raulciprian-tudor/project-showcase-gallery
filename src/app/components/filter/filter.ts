import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { GitHubRepo } from '../../core/interface/project.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter',
  imports: [MatToolbarModule, MatChipsModule, FormsModule, MatIconModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter implements OnChanges {
  @Output() filterChange = new EventEmitter<string[]>();
  @Input() initialSelectedTechs: string[] = [];
  @Input() availableTechs: string[] = [];
  private _selectedTechs: string[] = [];

  get selectedTechs(): string[] {
    return this._selectedTechs;
  }

  set selectedTechs(value: string[]) {
    this._selectedTechs = value;
    this.filterChange.emit(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['initialSelectedTechs'] && changes['initialSelectedTechs'].currentValue) {
        this._selectedTechs = [...changes['initialSelectedTechs'].currentValue];
      }
  }
}
