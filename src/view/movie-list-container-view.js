import AbstractView from './abstract-view';

const createMovieListContainerTemplate = () => '<div class="films-list__container"></div>';

export default class MovieListContainerView extends AbstractView {
  get template() {
    return createMovieListContainerTemplate();
  }
}
