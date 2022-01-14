const createSiteMenuNavigationTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name}<span class="main-navigation__item-count">${count}</span></a>`;
};

const createSiteMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createSiteMenuNavigationTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export {createSiteMenuTemplate};
