import AbstractView from './abstract-view';

const createMovieListExtraTemplate = (title) => `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
    </section>`;

export default class MovieListExtraView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createMovieListExtraTemplate(this.#title);
  }
}
