import AbstractView from './abstract-view';

const createNoMoviesViewTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class NoMoviesView extends AbstractView {
  get template() {
    return createNoMoviesViewTemplate();
  }
}
