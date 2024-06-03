import {
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { FiftyService } from './fifty.service';
import { FiftyComponent } from './fifty.component';

const CELLS_SIZE: number = 64;

@Directive({
  selector: '[fiftyCell]',
})
export class FiftyCellDirective implements OnInit {
  @Input() public fiftyCell: number = 0;

  @HostBinding('style.top.px') public top: number = 0;

  @HostBinding('style.left.px') public left: number = 0;

  public get i(): number {
    return this.fiftyService.cellsState[this.fiftyCell].i;
  }

  public get j(): number {
    return this.fiftyService.cellsState[this.fiftyCell].j;
  }

  private recalculatePosition(): void {
    this.top = this.i * CELLS_SIZE;
    this.left = this.j * CELLS_SIZE;
  }

  private move(): void {
    if (this.fiftyCell === 0) {
      return;
    }

    const moveHandler = (): boolean => {
      const zeroCellState = this.fiftyService.cellsState[0];
      const currentCellState = this.fiftyService.cellsState[this.fiftyCell];

      // Проверка для движения влево
      if (this.i === zeroCellState.i && this.j - 1 === zeroCellState.j) {
        currentCellState.j -= 1;
        zeroCellState.j += 1;
        return true;
      }

      // Проверка для движения вправо
      if (this.i === zeroCellState.i && this.j + 1 === zeroCellState.j) {
        currentCellState.j += 1;
        zeroCellState.j -= 1;
        return true;
      }

      // Проверка для движения вверх
      if (this.i === zeroCellState.i - 1 && this.j === zeroCellState.j) {
        currentCellState.i += 1;
        zeroCellState.i -= 1;
        return true;
      }

      // Проверка для движения вниз
      if (this.i === zeroCellState.i + 1 && this.j === zeroCellState.j) {
        currentCellState.i -= 1;
        zeroCellState.i += 1;
        return true;
      }

      return false;
    };

    if (moveHandler()) {
      this.recalculatePosition();
      this.parent.zeroCell?.recalculatePosition();

      this.fiftyService.moveHandler();
    }
  }

  constructor(
    private readonly fiftyService: FiftyService,
    private readonly parent: FiftyComponent,
  ) {}

  public ngOnInit(): void {
    this.recalculatePosition();
  }

  @HostListener('click') public onClick(): void {
    this.move();
  }
}
