import AbstractView from './abstract-view';
import {SortType} from '../constants';

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

  removeClass = (nodeList, className) => {
    const elements = nodeList.querySelectorAll('.sort__button');
    elements.forEach((element) => {
      element.classList.remove(className);
    });
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.setSortType(evt.target.dataset.sortType);
    this.removeClass(this.element, 'sort__button--active');
    evt.target.classList.add('sort__button--active');
  }
}
