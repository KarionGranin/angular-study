import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuComponent {}
