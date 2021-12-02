import {createElement} from '../render';

const createLoadMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

class LoadMoreButtonView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createLoadMoreButtonTemplate();
  }

  removeElement = () => {
    this.#element = null;
  }
}

export {LoadMoreButtonView};
