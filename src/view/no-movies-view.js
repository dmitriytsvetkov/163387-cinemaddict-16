import AbstractView from './abstract-view';
import {createNoMoviesViewTemplate} from './templates/no-movies-template';

export default class NoMoviesView extends AbstractView {
  #textType = null;

  constructor(textType) {
    super();
    this.#textType = textType;
  }

  get template() {
    return createNoMoviesViewTemplate(this.#textType);
  }
}
