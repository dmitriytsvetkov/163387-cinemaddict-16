import AbstractView from './abstract-view';

const createMovieListTemplate = () => '<div class="films-list__container"></div>';

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }
}
