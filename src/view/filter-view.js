import AbstractView from './abstract-view';
import {createFilterTemplate} from './templates/filter-template';
import {MenuItem} from '../constants';

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, filterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = filterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('[data-name]').forEach((item) => {
      item.addEventListener('click', this.#filterTypeChangeHandler);
    });
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.closest('[data-name]').dataset.name);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClickHandler = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();

    const item = evt.target.closest('.main-navigation__item');

    if (item) {
      this._callback.menuClickHandler(MenuItem.FILMS);
    }
  }
}
