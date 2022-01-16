import {FilterType} from '../../constants';

const createSiteMenuNavigationTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  switch (name) {
    case FilterType.STATISTIC:
      return `<a href="#${name}" data-name="${name}" class="main-navigation__additional ${type === currentFilterType ? 'main-navigation__additional--active' : ''}"">Stats</a>`;
    default: return `<a href="#${name}" data-name="${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name}<span class="main-navigation__item-count">${count}</span></a>`;
  }
};

const createSiteMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => {
    if (filter.name === FilterType.STATISTIC) {
      return;
    }
    return createSiteMenuNavigationTemplate(filter, currentFilterType);
  }).join('');

  const navItemsAdditionalTemplate = filterItems.map((filter) => {
    if (filter.name === FilterType.STATISTIC) {
      return createSiteMenuNavigationTemplate(filter, currentFilterType);
    }
  }).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    ${navItemsAdditionalTemplate}
  </nav>`;
};

export {createSiteMenuTemplate};
