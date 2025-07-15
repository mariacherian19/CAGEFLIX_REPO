import { Component } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
})
export class SearchFilterComponent {
  searchQuery: string = '';
  constructor(private searchService: SearchService) {}

  onSearchChange() {
    this.searchService.updateSearchTerm(this.searchQuery);
  }
  clearSearch(): void {
    this.searchQuery = '';
    this.searchService.clearSearch();
  }
}
