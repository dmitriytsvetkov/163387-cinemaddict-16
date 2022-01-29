import {getUserRank} from '../../utils/common';

const createUserRankTemplate = (moviesLength) => `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(moviesLength)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export {createUserRankTemplate};
