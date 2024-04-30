import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WordleService } from './wordle.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.scss',
  providers: [WordleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordleComponent {
  public size$: Observable<number> = this.wordleService.size$;

  public sizeControl: FormControl<string> = this.wordleService.sizeControl;

  public readonly tryesCount: number = this.wordleService.tryesCount;

  constructor(private wordleService: WordleService) {}
}
