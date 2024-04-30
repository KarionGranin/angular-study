import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'arrayFromNumber' })
export class ArrayFromNumberPipe implements PipeTransform {
  transform(size: number): number[] {
    return [...new Array(size)].map((_, index) => index);
  }
}
