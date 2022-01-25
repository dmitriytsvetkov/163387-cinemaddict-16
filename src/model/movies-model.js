import AbstractObservable from './abstract-observable';
import {UpdateType} from '../constants';

export default class MoviesModel extends AbstractObservable {
  #movies = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  getMovies = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch (err) {
      this.#movies = [];
    }
  }

  init = async () => {
    await this.getMovies();

    this._notify(UpdateType.INIT);
  }

  updateMovie = async (updateType, updatedData) => {
    const index = this.#movies.findIndex((item) => item.id === updatedData.id);

    if (index === -1) {
      throw new Error('Cant update nonexistent movie');
    }

    try {
      const response = await this.#apiService.updateMovie(updatedData);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie);
    } catch (err) {
      throw new Error('Can\'t update movie');
    }
  };

  #adaptToClient = (movie) => {
    const adaptedMovie = {
      ...movie,
      actors: movie['film_info'].actors,
      ageRating: movie['film_info']['age_rating'],
      alternativeTitle: movie['film_info']['alternative_title'],
      description: movie['film_info']['description'],
      director: movie['film_info']['director'],
      genres: movie['film_info']['genre'],
      poster: movie['film_info']['poster'],
      writers: movie['film_info']['writers'],
      releaseCountry: movie['film_info']['release']['release_country'],
      releaseDate: new Date(movie['film_info']['release']['date']),
      duration: movie['film_info']['runtime'],
      title: movie['film_info']['title'],
      rating: movie['film_info']['total_rating'],
      isFavorite: movie['user_details']['favorite'],
      isInWatchlist: movie['user_details']['watchlist'],
      watchedDate: movie['user_details']['watching_date'],
      isWatched: movie['user_details']['already_watched'],
    };

    delete adaptedMovie['film_info'].actors;
    delete adaptedMovie['film_info']['age_rating'];
    delete adaptedMovie['film_info']['alternative_title'];
    delete adaptedMovie['film_info']['description'];
    delete adaptedMovie['film_info']['director'];
    delete adaptedMovie['film_info']['genre'];
    delete adaptedMovie['film_info']['poster'];
    delete adaptedMovie['film_info']['release']['release_country'];
    delete adaptedMovie['film_info']['release'];
    delete adaptedMovie['film_info']['runtime'];
    delete adaptedMovie['film_info']['title'];
    delete adaptedMovie['film_info']['writers'];
    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details']['favorite'];
    delete adaptedMovie['user_details']['watchlist'];
    delete adaptedMovie['user_details']['watching_date'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  }
}
