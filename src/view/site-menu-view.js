import AbstractView from './abstract-view';
import {createSiteMenuTemplate} from './templates/site-menu-template';

export default class SiteMenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, filterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = filterType;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters, this.#currentFilter);
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
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClickHandler();
  }
}
