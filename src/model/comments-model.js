import AbstractObservable from './abstract-observable';
import {UpdateType} from '../constants';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  getComments = async (id) => {
    try {
      const comments = await this.#apiService.getComments(id);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.COMMENTS_INIT);

    return this.#comments;
  }

  deleteComment = async (comment) => {
    const index = this.#comments.findIndex((item) => item.id === comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete non-existing comment');
    }

    try {
      await this.#apiService.deleteComment(comment.id);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
    } catch (err){
      throw new Error ('Cannot delete comment');
    }
  }

  addComment = async (comment, movie, updateType) => {
    try {
      const response = await this.#apiService.addComment(comment, movie);
      const newComment = this.#adaptToClient(response);
      this.#comments = [
        ...this.#comments,
        newComment,
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Cannot add comment');
    }
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      text: comment['comment'],
      emoji: comment['emotion'],
    };

    delete adaptedComment['comment'];
    delete adaptedComment['emotion'];

    return adaptedComment;
  }
}
