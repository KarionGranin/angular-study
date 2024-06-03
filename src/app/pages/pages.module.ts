import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordleModule } from './wordle/wordle.module';
import { PagesRoutingModule } from './pages-routing.module';
import { SudokuModule } from './sudoku/sudoku.module';
import { FiftyModule } from './fifty/fifty.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    WordleModule,
    SudokuModule,
    FiftyModule,
  ],
})
export class PagesModule {}
