export const getParam = (field, value) => {
    return value && `${field}=${value}`;
};

export const removeNull = array => array.filter(Boolean);

export const getWhereParam = params => {
    const result = removeNull(params).join(' and ');
    return result && `where ${result}`;
};