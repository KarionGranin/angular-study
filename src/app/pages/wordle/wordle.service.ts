import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, fromEvent } from 'rxjs';
import {
  WordCollection,
  WordleGameOverType,
  WordleLetter,
  WordleLetterType,
  WordleWord,
} from './wordle.interface';
import { WORDLE_CONFIG } from './wordle.config';
import { MatDialog } from '@angular/material/dialog';
import { WordleModalGameoverComponent } from './modal/wordle-modal-gameover.component';
import { WORD_COLLECTION } from './wordle-word-collection';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class WordleService {
  private readonly defaultSize: number = 4;

  private size$$ = new BehaviorSubject<number>(this.defaultSize);

  public size$ = this.size$$.asObservable();

  private wordRows$$ = new BehaviorSubject<WordleWord[]>([]);

  public wordRows$ = this.wordRows$$.asObservable();

  private currentRowIndex$$ = new BehaviorSubject<number>(0);

  public currentRowIndex$ = this.currentRowIndex$$.asObservable();

  public sizeControl = new FormControl<string>(this.defaultSize.toString(), {
    nonNullable: true,
  });

  public readonly tryesCount = 6;

  private secretWord: string = '';

  private gameOver$$ = new BehaviorSubject<WordleGameOverType>('unknown');

  public gameOver$ = this.gameOver$$.asObservable();

  private get currentRowIndex(): number {
    return this.currentRowIndex$$.getValue();
  }

  private set currentRowIndex(index: number) {
    this.currentRowIndex$$.next(index);
  }

  private get gameOver(): WordleGameOverType {
    return this.gameOver$$.getValue();
  }

  private get size(): number {
    return this.size$$.getValue();
  }

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.listenSizeChanges();
    this.listenSizeControlChanges();
    this.listenKeyboard();
    this.listenGameover();
  }

  public abortGame(): void {
    if (this.gameOver === 'unknown') {
      this.gameOver$$.next('lose');
    } else {
      this.reset();
    }
  }

  private openGameoverDialog(): void {
    const dialogRef = this.dialog.open(WordleModalGameoverComponent, {
      data: { secretWord: this.secretWord, gameoverType: this.gameOver },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.reset();
      }
    });
  }

  private listenGameover(): void {
    this.gameOver$$.subscribe(() => {
      if (this.gameOver !== 'unknown') {
        this.openGameoverDialog();
      }
    });
  }

  private resetWords(): void {
    this.wordRows$$.next([...new Array(this.tryesCount)].map(() => []));
  }

  private reset(): void {
    this.currentRowIndex = 0;
    this.gameOver$$.next('unknown');
    this.resetWords();
    this.selectRandomWord();
  }

  private getRandom(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  private selectRandomWord(): void {
    const words: string[] = WORD_COLLECTION[this.size];
    this.secretWord = words[this.getRandom(0, words.length - 1)];
    console.log(this.secretWord);
  }

  private listenSizeChanges(): void {
    this.size$$.subscribe((size: number) => {
      this.reset();
    });
  }

  private listenSizeControlChanges(): void {
    this.sizeControl.valueChanges.subscribe((size: string) => {
      this.size$$.next(+size);
    });
  }

  private getTypeForLetter(
    letter: WordleLetter,
    index: number
  ): WordleLetterType {
    const wordLetterIndex: number = this.secretWord.indexOf(letter.letter);

    if (wordLetterIndex === -1) {
      return 'hasnt';
    }

    if (this.secretWord[index] === letter.letter) {
      return 'has';
    }

    return 'hasbut';
  }

  private wordIsCompleted(word: WordleWord): boolean {
    return word.every((letter: WordleLetter) => letter.type === 'has');
  }

  private handleBackspace(
    wordRows: WordleWord[],
    currentWord: WordleWord
  ): void {
    wordRows[this.currentRowIndex] = currentWord.slice(0, -1);

    this.wordRows$$.next([...wordRows]);
  }

  private handleEnter(wordRows: WordleWord[], currentWord: WordleWord): void {
    if (
      !WORD_COLLECTION[this.size].includes(
        currentWord.map((letter: WordleLetter) => letter.letter).join('')
      )
    ) {
      this.snackBar.open('Такого слова не существует!', '', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
      });
      return;
    }

    currentWord.forEach(
      (letter: WordleLetter, index: number) =>
        (letter.type = this.getTypeForLetter(letter, index))
    );

    this.wordRows$$.next([...wordRows]);

    if (this.wordIsCompleted(currentWord)) {
      this.gameOver$$.next('win');

      return;
    }

    if (this.currentRowIndex < this.tryesCount - 1) {
      this.currentRowIndex++;
    } else {
      this.gameOver$$.next('lose');
    }
  }

  private handleLetterKey(
    key: string,
    wordRows: WordleWord[],
    currentWord: WordleWord
  ): void {
    currentWord.push({ letter: key, type: 'unknown' });
    this.wordRows$$.next([...wordRows]);
  }

  private listenKeyboard(): void {
    fromEvent<KeyboardEvent>(document, 'keyup').subscribe(
      (event: KeyboardEvent) => {
        if (this.gameOver !== 'unknown') {
          return;
        }

        const wordRows: WordleWord[] = this.wordRows$$.getValue();
        const currentWord: WordleWord = wordRows[this.currentRowIndex];
        const wordSize: number = currentWord.length;

        if (event.key === 'Backspace' && wordSize > 0) {
          this.handleBackspace(wordRows, currentWord);
          return;
        }

        if (event.key === 'Enter' && wordSize === this.size) {
          this.handleEnter(wordRows, currentWord);
          return;
        }

        if (
          WORDLE_CONFIG.alphabet.includes(event.key.toLowerCase()) &&
          wordSize < this.size
        ) {
          this.handleLetterKey(event.key.toLowerCase(), wordRows, currentWord);
        }
      }
    );
  }
}
