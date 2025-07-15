import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm
    .asObservable()
    .pipe(distinctUntilChanged());

  updateSearchTerm(term: string): void {
    this.searchTerm.next(term.trim());
  }

  clearSearch(): void {
    this.searchTerm.next('');
  }
}
