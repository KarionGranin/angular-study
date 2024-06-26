import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, delay, fromEvent } from 'rxjs';
import {
  WordleGameOverType,
  WordleKeyboardKey,
  WordleKeyboardKeyType,
  WordleLetter,
  WordleLetterType,
  WordleWord,
  WordleWordLetterRepeats,
} from './wordle.interface';
import { WORDLE_CONFIG } from './wordle.config';
import { MatDialog } from '@angular/material/dialog';
import { WordleModalGameoverComponent } from './modal/wordle-modal-gameover.component';
import { WORD_COLLECTION } from './wordle-word-collection';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class WordleService {
  public readonly flipDelay: number = 200;

  private readonly defaultSize: number = 4;

  private size$$ = new BehaviorSubject<number>(this.defaultSize);

  public size$ = this.size$$.asObservable();

  private currentWord$$ = new BehaviorSubject<WordleWord>([]);

  public currentWord$ = this.currentWord$$.asObservable();

  private wordRows$$ = new BehaviorSubject<WordleWord[]>([]);

  public wordRows$ = this.wordRows$$.asObservable();

  public readonly tryesCount = 6;

  private secretWord: string = '';

  private gameOver$$ = new BehaviorSubject<WordleGameOverType>('unknown');

  public gameOver$ = this.gameOver$$.asObservable();

  private wordleWordLetterRepeats: WordleWordLetterRepeats = {};

  private wordleKeyboardKeyTypes$$ = new BehaviorSubject<WordleKeyboardKeyType>(
    {},
  );

  public wordleKeyboardKeyTypes$ = this.wordleKeyboardKeyTypes$$.asObservable();

  private get wordleKeyboardKeyTypes(): WordleKeyboardKeyType {
    return this.wordleKeyboardKeyTypes$$.getValue();
  }

  private get gameOver(): WordleGameOverType {
    return this.gameOver$$.getValue();
  }

  private get size(): number {
    return this.size$$.getValue();
  }

  private get currentWord(): WordleWord {
    return this.currentWord$$.getValue();
  }

  private set currentWord(word: WordleWord) {
    this.currentWord$$.next(word);
  }

  private get wordRows(): WordleWord[] {
    return this.wordRows$$.getValue();
  }

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.listenSizeChanges();
    this.listenKeyboard();
    this.listenGameover();
  }

  public keyboardKeyClick(key: WordleKeyboardKey | string): void {
    if (typeof key === 'object') {
      if (key.keyName === 'Backspace') {
        this.handleBackspace();
      } else {
        this.handleEnter();
      }
      return;
    }

    this.handleLetterKey(key);
  }

  public abortGame(): void {
    if (this.gameOver === 'unknown') {
      this.gameOver$$.next('lose');
    } else {
      this.reset();
    }
  }

  public changeSize(size: number): void {
    this.size$$.next(size);
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
    this.gameOver$$
      .pipe(delay(this.flipDelay * (this.size + 2)))
      .subscribe(() => {
        if (this.gameOver !== 'unknown') {
          this.openGameoverDialog();
        }
      });
  }

  private resetWords(): void {
    this.wordRows$$.next([]);
  }

  private reset(): void {
    this.currentWord = [];
    this.gameOver$$.next('unknown');
    this.resetWords();
    this.selectRandomWord();
    this.wordleKeyboardKeyTypes$$.next({});
  }

  private getRandom(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  private selectRandomWord(): void {
    const words: string[] = WORD_COLLECTION[this.size];
    this.secretWord = words[this.getRandom(0, words.length - 1)];

    this.wordleWordLetterRepeats = {};

    this.secretWord.split('').forEach((letter: string) => {
      if (!this.wordleWordLetterRepeats[letter]) {
        this.wordleWordLetterRepeats[letter] = 0;
      }
      this.wordleWordLetterRepeats[letter]++;
    });

    console.log(this.secretWord, this.wordleWordLetterRepeats);
  }

  private listenSizeChanges(): void {
    this.size$$.subscribe((size: number) => {
      this.reset();
    });
  }

  private wordIsCompleted(word: WordleWord): boolean {
    return word.every((letter: WordleLetter) => letter.type === 'has');
  }

  private handleBackspace(): void {
    if (this.currentWord.length > 0) {
      this.currentWord = this.currentWord.slice(0, -1);
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  private handleEnter(): void {
    if (this.currentWord.length < this.size) {
      this.showSnackbar('Букв меньше, чем надо');
      return;
    }

    if (
      !WORD_COLLECTION[this.size].includes(
        this.currentWord.map((letter: WordleLetter) => letter.letter).join(''),
      )
    ) {
      this.showSnackbar('Такого слова не существует!');
      return;
    }

    const letterCountByHas: { [key: string]: number } = {};
    const letterCountByHasbut: { [key: string]: number } = {};

    this.currentWord.forEach((letter: WordleLetter) => {
      if (this.secretWord[letter.index] === letter.letter) {
        if (!letterCountByHas[letter.letter]) {
          letterCountByHas[letter.letter] = 0;
        }

        letter.type = 'has';
        letterCountByHas[letter.letter]++;
      }

      if (this.secretWord.indexOf(letter.letter) === -1) {
        letter.type = 'hasnt';
      }
    });

    this.currentWord.forEach((letter: WordleLetter) => {
      if (letter.type === 'unknown') {
        if (!letterCountByHasbut[letter.letter]) {
          letterCountByHasbut[letter.letter] = 0;
        }

        const maxHasbutCount =
          this.wordleWordLetterRepeats[letter.letter] -
          (letterCountByHas[letter.letter] ?? 0);

        if (letterCountByHasbut[letter.letter] < maxHasbutCount) {
          letter.type = 'hasbut';
          letterCountByHasbut[letter.letter]++;
        } else {
          letter.type = 'hasnt';
        }
      }
    });

    this.currentWord.forEach((letter: WordleLetter) => {
      if (this.wordleKeyboardKeyTypes[letter.letter] !== 'has') {
        this.wordleKeyboardKeyTypes[letter.letter] = letter.type;
      }
    });

    this.wordleKeyboardKeyTypes$$.next({ ...this.wordleKeyboardKeyTypes });

    this.wordRows.push(this.currentWord);

    this.wordRows$$.next([...this.wordRows]);

    if (this.wordIsCompleted(this.currentWord)) {
      this.gameOver$$.next('win');
      return;
    }

    this.currentWord = [];

    if (this.wordRows.length === this.tryesCount) {
      this.gameOver$$.next('lose');
    }
  }

  private handleLetterKey(key: string): void {
    if (this.currentWord.length < this.size) {
      this.currentWord.push({
        letter: key,
        type: 'unknown',
        index: this.currentWord.length,
      });

      this.currentWord = [...this.currentWord];
    }
  }

  private listenKeyboard(): void {
    fromEvent<KeyboardEvent>(document, 'keydown').subscribe(
      (event: KeyboardEvent) => {
        if (this.gameOver !== 'unknown') {
          return;
        }

        if (event.key === 'Backspace') {
          this.handleBackspace();
          return;
        }
      },
    );

    fromEvent<KeyboardEvent>(document, 'keyup').subscribe(
      (event: KeyboardEvent) => {
        if (this.gameOver !== 'unknown') {
          return;
        }

        if (event.key === 'Enter') {
          this.handleEnter();
          return;
        }

        if (WORDLE_CONFIG.alphabet.includes(event.key.toLowerCase())) {
          this.handleLetterKey(event.key.toLowerCase());
        }
      },
    );
  }
}
