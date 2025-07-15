export interface Movie {
  id: string;
  type: string;
  title: string;
  year: string;
  genres: string[];
  coActors: string[];
  description: string;
  imageUrl?: string;
}
