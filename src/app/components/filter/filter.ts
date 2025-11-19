import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  imports: [MatToolbarModule, MatChipsModule, FormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter {
  selectedTechs: string[] = [];
}
