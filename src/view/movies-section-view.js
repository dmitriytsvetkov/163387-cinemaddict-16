import AbstractView from './abstract-view';

const createMovieSectionTemplate = () => '<section class="films"></section>';

export default class MoviesSectionView extends AbstractView {
  get template() {
    return createMovieSectionTemplate();
  }
}
