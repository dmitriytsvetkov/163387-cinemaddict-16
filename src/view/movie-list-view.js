import AbstractView from './abstract-view';
import {createMovieListTemplate} from './templates/movie-list-template';

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }
}
