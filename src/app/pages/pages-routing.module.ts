import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WordleComponent } from './wordle/wordle.component';
import { FiftyComponent } from './fifty/fifty.component';
import { SudokuComponent } from './sudoku/sudoku.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wordle',
    pathMatch: 'full',
  },
  {
    path: 'wordle',
    component: WordleComponent,
  },
  {
    path: 'fifty',
    component: FiftyComponent,
  },
  {
    path: 'sudoku',
    component: SudokuComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
