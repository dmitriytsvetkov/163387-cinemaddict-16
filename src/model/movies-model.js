import AbstractObservable from './abstract-observable';

export default class MoviesModel extends AbstractObservable {
  #movies = [];

  set movies(movies) {
    this.#movies = [...movies];
  }

  get movies() {
    return this.#movies;
  }

  updateMovie = (updateType, updatedData) => {
    const index = this.#movies.findIndex((item) => item.id === updatedData.id);

    if (index === -1) {
      throw new Error('Cant update nonexistent movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      updatedData,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, updatedData);
  };
}
