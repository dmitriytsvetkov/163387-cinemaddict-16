import AbstractObservable from './abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  get comments() {
    return this.#comments;
  }

  setComment = (updateType, comments) => {
    this.#comments = comments;
    this._notify(updateType, comments);
  }
}
