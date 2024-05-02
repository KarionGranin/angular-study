import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WordleService } from './wordle.service';
import { Observable } from 'rxjs';
import {
  WordleGameOverType,
  WordleWord,
  WordleKeyboard,
  WordleKeyboardKey,
  WordleKeyboardKeyType,
} from './wordle.interface';
import { WORDLE_KEYBOARD } from './wordle.config';

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.scss',
  providers: [WordleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordleComponent {
  public wordleKeyboardKeyTypes$: Observable<WordleKeyboardKeyType> =
    this.wordleService.wordleKeyboardKeyTypes$;

  public size$: Observable<number> = this.wordleService.size$;

  public gameOver$: Observable<WordleGameOverType> =
    this.wordleService.gameOver$;

  public currentRowIndex$: Observable<number> =
    this.wordleService.currentRowIndex$;

  public readonly tryesCount: number = this.wordleService.tryesCount;

  public wordRows$: Observable<WordleWord[]> = this.wordleService.wordRows$;

  public readonly wordleKeyboard: WordleKeyboard = WORDLE_KEYBOARD;

  constructor(private wordleService: WordleService) {}

  public abortGame(): void {
    this.wordleService.abortGame();
  }

  public changeSize(size: number): void {
    this.wordleService.changeSize(size);
  }

  public keyboardKeyIsObject(
    key: WordleKeyboardKey | string
  ): key is WordleKeyboardKey {
    return typeof key === 'object';
  }

  public getKeySymbol(key: WordleKeyboardKey | string): string {
    if (this.keyboardKeyIsObject(key)) {
      return key.key;
    }
    return key;
  }

  public keyIsWide(key: WordleKeyboardKey | string): boolean {
    return this.keyboardKeyIsObject(key) ? !!key.wide : false;
  }

  public keyboardKeyClick(key: WordleKeyboardKey | string): void {
    this.wordleService.keyboardKeyClick(key);
  }
}
