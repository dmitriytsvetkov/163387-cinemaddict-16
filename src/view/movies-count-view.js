import AbstractView from './abstract-view';
import {createMoviesCountTemplate} from './templates/movie-count-template';

export default class MoviesCountView extends AbstractView {
  #moviesCount = null;

  constructor(moviesCount) {
    super();
    this.#moviesCount = moviesCount;
  }

  get template() {
    return createMoviesCountTemplate(this.#moviesCount);
  }
}
