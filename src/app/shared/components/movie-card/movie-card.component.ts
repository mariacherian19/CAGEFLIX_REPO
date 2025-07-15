import { Component, Input } from '@angular/core';
import { Movie } from '../../../core/models/movie.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  trackByGenre(index: number, genre: string): string {
    return genre;
  }
}
