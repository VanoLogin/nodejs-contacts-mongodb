function parseType(maybeType) {
  if (typeof maybeType !== 'string') return undefined;
  const typeKeys = ['work', 'home', 'personal'];
  return typeKeys.includes(maybeType) ? maybeType : undefined;
}

// const parseIsFavourite = (isFavourite) => {
//   if (typeof isFavourite === 'undefined') {
//     return undefined;
//   }

//   if (typeof isFavourite === 'boolean') {
//     return isFavourite;
//   }

//   if (typeof isFavourite !== 'boolean') {
//     return undefined;
//   }

//   return isFavourite;
// };
const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'undefined') {
    return undefined;
  }

  if (isFavourite.toLowerCase() === 'true') {
    return true;
  }

  if (isFavourite.toLowerCase() === 'false') {
    return false;
  }

  return undefined;
};

function parseFilterParams(params) {
  const { contactType, isFavourite } = params;

  const parsedType = parseType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
}

export { parseFilterParams };
