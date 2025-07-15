import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../../../core/models/movie.models';
import { MovieService } from '../../../../core/services/movie.service';
import { SearchService } from '../../../../core/services/search.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SearchFilterComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  genres: string[] = [];
  private destroy$ = new Subject<void>();
  moviesByGenre: { [key: string]: Movie[] } = {};
  constructor(
    private movieService: MovieService,
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const filterType = this.route.snapshot.data['filter'];

    let movies$;
    if (filterType === 'movie') {
      movies$ = this.movieService.getMovies();
    } else if (filterType === 'tv') {
      movies$ = this.movieService.getSeries();
    } else {
      movies$ = this.movieService.getCombined();
    }

    combineLatest([movies$, this.searchService.currentSearchTerm])
      .pipe(
        takeUntil(this.destroy$),
        map(([movies, searchTerm]) => this.searchMovies(movies, searchTerm))
      )
      .subscribe((filteredMovies) =>
        this.organizeMoviesByGenre(filteredMovies)
      );
  }

  searchMovies(movies: Movie[], searchTerm: string): Movie[] {
    if (!searchTerm.trim()) return movies;

    const term = searchTerm.toLowerCase().trim();

    return movies.filter((movie) => {
      const titleMatch = movie?.title.toLowerCase().includes(term);
      const genreMatch = movie?.genres.some((g) =>
        g.toLowerCase().includes(term)
      );
      const actorMatch =
        movie?.coActors?.some((g) => g.toLowerCase().includes(term)) ?? false;
      const descMatch =
        movie?.description.toLowerCase().includes(term) ?? false;
      const yearMatch = movie?.year.toString().toLowerCase().includes(term);

      return titleMatch || genreMatch || descMatch || yearMatch || actorMatch;
    });
  }

  private organizeMoviesByGenre(movies: any[]): void {
    this.genres = [...new Set(movies.flatMap((movie) => movie.genres))];
    this.genres.forEach((genre) => {
      this.moviesByGenre[genre] = movies.filter((movie) =>
        movie.genres.includes(genre)
      );
    });
  }

  trackByGenre(index: number, genre: string): string {
    return genre;
  }

  trackByMovie(index: number, movie: Movie): string {
    return movie.id;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
