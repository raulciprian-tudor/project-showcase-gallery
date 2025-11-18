import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProjectInterface } from '../../core/interface/project.interface';
@Component({
  selector: 'app-project-card',
  imports: [MatCardModule, MatButtonModule, DatePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  @Input() project!: ProjectInterface;
}
