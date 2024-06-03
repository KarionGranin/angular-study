import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CellsState {
  [k: number]: {
    i: number;
    j: number;
  };
}

@Injectable()
export class FiftyService {
  private readonly winCells: number[] = [
    ...[...new Array(15)].map((_, index) => index + 1),
    0,
  ];

  private readonly initialCells$$ = new BehaviorSubject<number[]>([]);

  public readonly initialCells$ = this.initialCells$$.asObservable();

  public winState: CellsState = {};

  public cellsState: CellsState = {};

  public attemptsCount: number = 0;

  private checkWin(): boolean {
    return JSON.stringify(this.cellsState) === JSON.stringify(this.winState);
  }

  private calculateStateForCells(cells: number[]): CellsState {
    return [...new Array(4)]
      .map((_, index: number) => cells.slice(index * 4, (index + 1) * 4))
      .reduce((total: CellsState, row: number[], rowIndex: number) => {
        row.forEach(
          (n: number, colIndex: number) =>
            (total[n] = { i: rowIndex, j: colIndex }),
        );
        return total;
      }, {});
  }

  constructor() {
    this.reset();
  }

  public reset(): void {
    const initialCells: number[] = [...new Array(16)]
      .map((_, index) => index)
      .sort(() => Math.random() - 0.5);

    //    const initialCells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15];

    this.initialCells$$.next([...initialCells]);

    this.cellsState = this.calculateStateForCells(initialCells);
    this.winState = this.calculateStateForCells(this.winCells);
    console.log(this.cellsState, this.winState);
  }

  public moveHandler(): void {
    this.attemptsCount++;
    if (this.checkWin()) {
      console.log('ВЫПОЕБИДИЛ');
    }
  }
}
