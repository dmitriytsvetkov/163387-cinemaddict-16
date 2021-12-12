import AbstractView from './abstract-view';

const createMovieListExtraTemplate = () => '<div class="films-list films-list--extra"></div>';

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListExtraTemplate();
  }
}
