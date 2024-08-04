function parseNumber(number, defaultValue) {
  if (typeof number !== 'string') {
    return defaultValue;
  }

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }
  return parsedNumber;
}

function parsePaginationParams(params) {
  const { page, perPage } = params;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
}

export { parsePaginationParams };
