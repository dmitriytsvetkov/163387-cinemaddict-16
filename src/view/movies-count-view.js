import AbstractView from './abstract-view';

const createMoviesCountTemplate = (moviesCount) => `<p>${moviesCount} movies inside</p>`;

export default class MoviesCountView extends AbstractView {
  #moviesCount = null;

  constructor(moviesCount) {
    super();
    this.#moviesCount = moviesCount;
  }

  get template() {
    return createMoviesCountTemplate(this.#moviesCount);
  }
}
