import { Component } from '@angular/core';
import { WordleService } from './wordle.service';

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.scss',
  providers: [WordleService],
})
export class WordleComponent {
  constructor(private wardleService: WordleService) {}
}
