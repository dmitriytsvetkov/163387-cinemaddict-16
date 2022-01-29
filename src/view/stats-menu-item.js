import SmartView from './smart-view';
import {MenuItem} from '../constants';
import {createStatsMenuItemTemplate} from './templates/stats-menu-item-template';

export default class StatsMenuItem extends SmartView {
  constructor() {
    super();
    this._data = {
      active: false
    };
  }

  restoreHandlers = () => {
    this.setMenuClickHandler(this._callback.menuClick);
  }

  get template() {
    return createStatsMenuItemTemplate(this._data.active);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATS);
  }
}
