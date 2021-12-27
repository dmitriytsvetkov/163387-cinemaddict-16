import AbstractView from './abstract-view';
import {removeClassFromElementList} from '../utils/common';
import {createSortTemplate} from './templates/sort-template';

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.setSortType = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.setSortType(evt.target.dataset.sortType);
    removeClassFromElementList(this.element.querySelectorAll('.sort__button'), 'sort__button--active');
    evt.target.classList.add('sort__button--active');
  }
}
