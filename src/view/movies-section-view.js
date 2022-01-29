import AbstractView from './abstract-view';
import {createMovieSectionTemplate} from './templates/movies-section-template';

export default class MoviesSectionView extends AbstractView {
  get template() {
    return createMovieSectionTemplate();
  }
}
