import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordleGameOverModalData } from '../wordle.interface';

@Component({
  selector: 'app-wordle-modal-gameover',
  templateUrl: './wordle-modal-gameover.component.html',
  styleUrl: './wordle-modal-gameover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordleModalGameoverComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: WordleGameOverModalData) {}
}
