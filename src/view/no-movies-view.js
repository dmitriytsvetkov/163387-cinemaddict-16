import {createElement} from '../render';

const createNoMoviesViewTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class NoMoviesView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoMoviesViewTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
