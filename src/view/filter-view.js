import AbstractView from './abstract-view';
import {createSiteMenuTemplate} from './templates/site-menu-template';

export default class FilterView extends AbstractView {
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
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.childNodes[0].textContent);
  }
}
