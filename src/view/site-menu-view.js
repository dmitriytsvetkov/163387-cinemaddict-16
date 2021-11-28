const createSiteMenuNavigationTemplate = (filteredMovies) => filteredMovies.map((filteredMovie) => `<a href="#${filteredMovie.name}" class="main-navigation__item">${filteredMovie.name} <span class="main-navigation__item-count">${filteredMovie.count}</span></a>`);

const createSiteMenuTemplate = (filteredMovies) => {
  const filteredMoviesTemplateMenu = createSiteMenuNavigationTemplate(filteredMovies).join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filteredMoviesTemplateMenu}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export {createSiteMenuTemplate};
