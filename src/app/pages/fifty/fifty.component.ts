import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-fifty',
  templateUrl: './fifty.component.html',
  styleUrl: './fifty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiftyComponent {}
