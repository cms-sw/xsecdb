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
    if(!columns){
        columns
    }

    let selectionArray = columns.map(c => c.isVisible | 0);
 
    return parseInt(selectionArray.join(''), 2);
}

//Parses integer -> binary -> boolean array of required length
export const getVisibleColumnsArray = (intSelection, reqLength) => {
    if (!intSelection) {
        return Array(reqLength).fill(true);
    }

    let binary = parseInt(intSelection).toString(2);

    if (binary.length < reqLength) {
        binary = Array(reqLength - binary.length + 1).join("0") + binary;
    }

    const result = binary.split('').map(val => val == "1");
    return result;
}

export const getSearchPageUrlByParams = (searchState, columnParameterName) => {
    let query = {};
    if(searchState.searchField){
        query = getQueryObject(searchState.searchField);
    }

    if(searchState.columns.length !== 0){
        query[columnParameterName] = getVisibleColumnsInt(searchState.columns);
    }
    
    const redirectSearchUrl = '/?' + qs.stringify(query);

    return redirectSearchUrl;
}