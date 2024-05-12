import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SudokuService } from './sudoku.service';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss',
  providers: [SudokuService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuComponent {
  constructor(private readonly sudokuService: SudokuService) {}
}
