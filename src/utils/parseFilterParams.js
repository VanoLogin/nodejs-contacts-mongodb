function parseType(maybeType) {
  if (typeof maybeType !== 'string') return;
  const typeKeys = ['work', 'home', 'personal'];
  if (typeKeys.includes(maybeType)) return maybeType;
}

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'undefined') {
    return undefined;
  }

  const isBoolean = typeof isFavourite === 'boolean';
  if (isBoolean) {
    return isFavourite;
  }

  const parsedIsFavourite = JSON.parse(isFavourite.toLowerCase());
  if (typeof parsedIsFavourite !== 'boolean') {
    return undefined;
  }

  return parsedIsFavourite;
};

function parseFilterParams(params) {
  const { type, isFavourite } = params;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
}

export { parseFilterParams };
