import AbstractView from './abstract-view';
import {createLoadMoreButtonTemplate} from './templates/load-more-button-template';

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
