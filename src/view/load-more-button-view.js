import AbstractView from './abstract-view';

const createLoadMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }

  setLoadMoreClickHandler = (callback) => {
    this._callback.showMore = callback;
    this.element.addEventListener('click', this.#loadMoreHandler);
  }

  #loadMoreHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMore();
  }
}
