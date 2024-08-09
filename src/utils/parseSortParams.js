import { SORT_ORDER } from '../constants/index.js';

function parseSortOrder(sortOrder) {
  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)) {
    return sortOrder.toLowerCase();
  }
  return SORT_ORDER.ASC;
}

function parseSortBy(sortBy) {
  const keys = ['_id', 'name', 'isFavourite', 'contactType'];

  if (keys.includes(sortBy)) {
    return sortBy;
  }
  return '_id';
}

function parseSortParams(params) {
  const { sortBy, sortOrder } = params;
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}

export { parseSortParams, SORT_ORDER };
