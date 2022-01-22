const createSiteMenuNavigationTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${name}" data-name="${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name}<span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createSiteMenuNavigationTemplate(filter, currentFilterType)).join('');

  return `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`;
};

export {createFilterTemplate};
