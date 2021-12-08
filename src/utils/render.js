import AbstractView from '../view/abstract-view';

const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const render = (container, element, place) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFORE_BEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTER_BEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFORE_END:
      parent.append(child);
      break;
    case RenderPosition.AFTER_END:
      parent.after(child);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const remove = (component) => {
  if (remove === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

export {RenderPosition, createElement, render, remove};
