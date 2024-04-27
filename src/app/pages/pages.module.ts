import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordleModule } from './wordle/wordle.module';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, PagesRoutingModule, WordleModule],
})
export class PagesModule {}
