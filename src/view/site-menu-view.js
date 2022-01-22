import AbstractView from './abstract-view';
import {MenuItem} from '../constants';

const createSiteMenuTemplate = () => (
  '<nav class="main-navigation"></nav>'
);

export default class SiteMenuView extends AbstractView {
  get template() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATS);
  }
}
