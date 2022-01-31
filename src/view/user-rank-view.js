import AbstractView from './abstract-view';
import {createUserRankTemplate} from './templates/user-rank-template';

export default class UserRankView extends AbstractView {

  constructor(moviesLength) {
    super();
    this._data = {
      moviesLength,
    };
  }

  get template() {
    return createUserRankTemplate(this._data.moviesLength);
  }
}
