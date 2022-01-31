import {NoMoviesTextType} from '../../constants';

const createNoMoviesViewTemplate = (textType) => {
  const text = NoMoviesTextType[textType];

  return `<h2 class="films-list__title">${text}</h2>`;
};

export {createNoMoviesViewTemplate};
