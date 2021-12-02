import {createElement} from '../render';

const createMovieListTemplate = () => '<div class="films-list__container"></div>';

class MovieListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMovieListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

export {MovieListView};
