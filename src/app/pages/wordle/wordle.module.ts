import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordleComponent } from './wordle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../common/pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { WordleModalGameoverComponent } from './modal/wordle-modal-gameover.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [WordleComponent, WordleModalGameoverComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipesModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class WordleModule {}
