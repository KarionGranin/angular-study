import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FiftyService } from './fifty.service';
import { Observable } from 'rxjs';
import { FiftyCellDirective } from './fifty-cell.directive';

@Component({
  selector: 'app-fifty',
  templateUrl: './fifty.component.html',
  styleUrl: './fifty.component.scss',
  providers: [FiftyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiftyComponent implements AfterViewInit {
  public readonly initialCells$: Observable<number[]> =
    this.fiftyService.initialCells$;

  @ViewChildren(FiftyCellDirective)
  private cells?: QueryList<FiftyCellDirective>;

  public zeroCell?: FiftyCellDirective;

  constructor(private readonly fiftyService: FiftyService) {}

  public ngAfterViewInit(): void {
    this.zeroCell = this.cells?.find(
      (d: FiftyCellDirective) => d.fiftyCell === 0,
    );
    console.log(this.zeroCell);
  }
}
