import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class WordleService {
  private size$$ = new BehaviorSubject<number>(4);

  public size$ = this.size$$.asObservable();

  public sizeControl = new FormControl<string>('', { nonNullable: true });

  public readonly tryesCount = 6;

  constructor() {
    this.listenSizeChanges();
    this.listenSizeControlChanges();
  }

  private listenSizeChanges(): void {
    // this.size$$.subscribe((size: number) => {});
  }

  private listenSizeControlChanges(): void {
    this.sizeControl.valueChanges.subscribe((size: string) => {
      this.size$$.next(+size);
    });
  }
}
