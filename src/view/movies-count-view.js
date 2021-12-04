import {createElement} from '../render';

const createMoviesCountTemplate = (moviesCount) => `<p>${moviesCount} movies inside</p>`;

export default class MoviesCountView {
  #element = null;
  #moviesCount = null;

  constructor(moviesCount) {
    this.#moviesCount = moviesCount;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMoviesCountTemplate(this.#moviesCount);
  }
}
