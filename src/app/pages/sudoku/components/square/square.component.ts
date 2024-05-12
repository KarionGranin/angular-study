import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sudoku-square',
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquareComponent {}
