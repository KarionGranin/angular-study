import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordleComponent } from './wordle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../common/pipes/pipes.module';

@NgModule({
  declarations: [WordleComponent],
  imports: [CommonModule, ReactiveFormsModule, PipesModule],
})
export class WordleModule {}
