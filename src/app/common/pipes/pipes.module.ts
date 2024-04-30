import { NgModule } from '@angular/core';
import { ArrayFromNumberPipe } from './array-from-number.pipe';

@NgModule({
  declarations: [ArrayFromNumberPipe],
  exports: [ArrayFromNumberPipe],
})
export class PipesModule {}
