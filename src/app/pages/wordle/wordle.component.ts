import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WordleService } from './wordle.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { WordleGameOverType, WordleWord } from './wordle.interface';

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.scss',
  providers: [WordleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordleComponent {
  public size$: Observable<number> = this.wordleService.size$;

  public gameOver$: Observable<WordleGameOverType> =
    this.wordleService.gameOver$;

  public currentRowIndex$: Observable<number> =
    this.wordleService.currentRowIndex$;

  public readonly tryesCount: number = this.wordleService.tryesCount;

  public wordRows$: Observable<WordleWord[]> = this.wordleService.wordRows$;

  constructor(private wordleService: WordleService) {}

  public abortGame(): void {
    this.wordleService.abortGame();
  }

  public changeSize(size: number): void {
    this.wordleService.changeSize(size);
  }
}
