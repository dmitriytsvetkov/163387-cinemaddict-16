import {createElement} from '../render';

const createMoviesCountTemplate = () => '<p>130 291 movies inside</p>';

export default class MoviesCountView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMoviesCountTemplate();
  }
}
