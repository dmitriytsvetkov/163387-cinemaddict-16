import AbstractView from './abstract-view';
import {createSiteMenuTemplate} from './templates/site-menu-template';

export default class SiteMenuView extends AbstractView {
  #filteredMovies = null;

  constructor(filteredMovies) {
    super();
    this.#filteredMovies = filteredMovies;
  }

  get template() {
    return createSiteMenuTemplate(this.#filteredMovies);
  }
}
