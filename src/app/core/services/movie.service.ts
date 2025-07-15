import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.models';
import { combineLatest, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<any[]>('/assets/cage-movies.json')
      .pipe(map((movies) => movies.map((m) => this.transformMovieData(m))));
  }

  getSeries(): Observable<Movie[]> {
    return this.http
      .get<any[]>('/assets/cage-shows.json')
      .pipe(map((series) => series.map((s) => this.transformMovieData(s))));
  }

  getCombined(): Observable<Movie[]> {
    return combineLatest([this.getMovies(), this.getSeries()]).pipe(
      map(([movies, series]) => [...movies, ...series])
    );
  }

  private transformMovieData(movie: any): Movie {
    return {
      id: movie.id,

      type: movie.titleType,
      title: movie.title,
      year: movie.year || '',
      genres: movie.genres,
      coActors: movie.actors,
      description: movie.description,
      imageUrl: movie.imageUrl,
    };
  }
}
