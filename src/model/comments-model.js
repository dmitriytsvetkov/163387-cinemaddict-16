import AbstractObservable from './abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  deleteComment(data) {
    const index = this.#comments.findIndex((comment) => comment.id === data.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];
  }

  addComment(comment) {
    this.#comments = [
      ...this.#comments,
      comment,
    ];
  }
}
