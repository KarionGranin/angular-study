import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../common/pipes/pipes.module';
import { FiftyComponent } from './fifty.component';

@NgModule({
  declarations: [FiftyComponent],
  imports: [CommonModule, ReactiveFormsModule, PipesModule],
})
export class FiftyModule {}
