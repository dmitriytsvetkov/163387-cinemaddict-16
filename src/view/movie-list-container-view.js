import AbstractView from './abstract-view';
import {createMovieListContainerTemplate} from './templates/movie-list-container-template';

export default class MovieListContainerView extends AbstractView {
  get template() {
    return createMovieListContainerTemplate();
  }
}
