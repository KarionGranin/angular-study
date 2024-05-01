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

@Injectable()
export class WordleService {
  private readonly defaultSize: number = 4;

  private size$$ = new BehaviorSubject<number>(this.defaultSize);

  public size$ = this.size$$.asObservable();

  private wordRows$$ = new BehaviorSubject<WordleWord[]>([]);

  public wordRows$ = this.wordRows$$.asObservable();

  private currentRowIndex: number = 0;

  public sizeControl = new FormControl<string>(this.defaultSize.toString(), {
    nonNullable: true,
  });

  public readonly tryesCount = 6;

  private secretWord: string = '';

  private gameOver$$ = new BehaviorSubject<WordleGameOverType>('unknown');

  public gameOver$ = this.gameOver$$.asObservable();

  private readonly alphabet: string[] = [
    'а',
    'б',
    'в',
    'г',
    'д',
    'е',
    'ё',
    'ж',
    'з',
    'и',
    'й',
    'к',
    'л',
    'м',
    'н',
    'о',
    'п',
    'р',
    'с',
    'т',
    'у',
    'ф',
    'х',
    'ц',
    'ч',
    'ш',
    'щ',
    'ъ',
    'ы',
    'ь',
    'э',
    'ю',
    'я',
  ];

  private readonly wordCollection: WordCollection = {
    [4]: [],
    [5]: [],
    [6]: [],
  };

  private get size(): number {
    return this.size$$.getValue();
  }

  constructor() {
    this.listenSizeChanges();
    this.listenSizeControlChanges();
    this.listenKeyboard();
  }

  private resetWords(): void {
    this.wordRows$$.next([...new Array(this.tryesCount)].map(() => []));
  }

  private reset(): void {
    this.currentRowIndex = 0;
    this.resetWords();
    this.selectRandomWord();
  }

  private getRandom(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  private selectRandomWord(): void {
    const words: string[] = this.wordCollection[this.size];
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

    if (wordLetterIndex === index) {
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

        if (this.alphabet.includes(event.key) && wordSize < this.size) {
          this.handleLetterKey(event.key, wordRows, currentWord);
        }
      }
    );
  }
}
