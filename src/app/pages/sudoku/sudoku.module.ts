import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../common/pipes/pipes.module';
import { SudokuComponent } from './sudoku.component';

@NgModule({
  declarations: [SudokuComponent],
  imports: [CommonModule, ReactiveFormsModule, PipesModule],
})
export class SudokuModule {}
