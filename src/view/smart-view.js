import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  _data = {};
  #scrollPosition = null;

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.#scrollPosition = prevElement.scrollTop;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);
    this.restoreScrollPosition(this.#scrollPosition);
    this.restoreHandlers();
  }

  updateData = (update) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    this.updateElement();
  }

  restoreScrollPosition = (prevScrollPosition) => {
    if (!prevScrollPosition) {
      return;
    }

    this.element.scrollTop = prevScrollPosition;
    prevScrollPosition = null;
  }
}
