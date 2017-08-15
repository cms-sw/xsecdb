import qs from 'query-string';

//Parses search string into key:value object
export const getQueryObject = (query = "") => {
    const _and = ",", _assing = "=";

    //remove whitespace
    query = query.replace(/\s/g, "");

    const pairs = query.split(_and);
    const conditions = {};

    pairs.map(pair => {
        const pp = pair.split(_assing);
        conditions[pp[0]] = pp[1];
    })
    return conditions;
}

//Parses boolean array -> binary representation -> integer respesention
export const getVisibleColumnsInt = (columns) => {
    let selectionArray = columns.map(c => c.isVisible | 0);
    return parseInt(selectionArray.join(''), 2);
}

//Parses integer -> binary -> boolean array of required length
export const getVisibleColumnsArray = (integerSelection, reqLength) => {
    if (!integerSelection) {
        return Array(reqLength).fill(true);
    }

    let binary = parseInt(integerSelection).toString(2);

    if (binary.length < reqLength) {
        binary = Array(reqLength - binary.length + 1).join("0") + binary;
    }

    const result = binary.split('').map(val => val == "1");
    return result;
}

//forms url string from searchState (search query, selected columns, pagination) 
export const getSearchPageUrlByParams = (searchState, columnParameterName) => {
    let query = {};

    // Search query
    if(searchState.searchField){
        query = getQueryObject(searchState.searchField);
    }

    // Selected Columns
    if(searchState.columns.length !== 0){
        query[columnParameterName] = getVisibleColumnsInt(searchState.columns);
    }

    //Pagination 
    query = Object.assign({}, query, searchState.pagination);
    const redirectSearchUrl = '/?' + qs.stringify(query);
    return redirectSearchUrl;
}