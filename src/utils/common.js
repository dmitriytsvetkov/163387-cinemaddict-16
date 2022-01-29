const removeItem = (items, id) => {
  const index = items.findIndex((item) => item === id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    ...items.slice(index + 1),
  ];
};

const makeItemsUniq = (items) => [...new Set(items)];

const getUserRank = (count) => {
  if (count > 0 && count <= 10) {
    return 'Novice';
  }

  if (count >= 11 && count <= 20) {
    return 'Fan';
  }

  if (count >= 21) {
    return 'Movie buff';
  }

  return '';
};

export {removeItem, makeItemsUniq, getUserRank};
