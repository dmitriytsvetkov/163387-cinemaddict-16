import AbstractView from './abstract-view';
import {SortType} from '../constants';
import {removeClassFromElementList} from '../utils/common';

const createSortTemplate = () => `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`;

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
