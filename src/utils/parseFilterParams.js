function parseBoolean(value) {
    const isString = typeof value === 'string';

    if (isString !== true) {
        return undefined;
    }

    if (value === 'true') {
        console.log('TRUE');
        return true;
    }

    if (value === 'false') {
        console.log('FALSE');
        return false;
    }
    return undefined;
}

function parseContactType(value) {
    const isString = typeof value === 'string';

    if (isString !== true) {
        return undefined;
    }
    const keysOfTypes = ['work', 'home', 'personal'];

    if (keysOfTypes.includes(value)) {
        return value;
    }

    return undefined;
}

export function parseFilterParams(query) {
    const { isFavourite, type } = query;

    const parsedIsFavorite = parseBoolean(isFavourite);
    const parsedType = parseContactType(type);

    return {
        isFavourite: parsedIsFavorite,
        type: parsedType,
    };
}
