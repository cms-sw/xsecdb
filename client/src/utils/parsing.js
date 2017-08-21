import qs from 'query-string';

const _and = 'AND', _or = 'OR', _assing = '=', _openBrac = '(', _closingBrac = ')';
let reString = `^([a-zA-Z_]+={1}[a-zA-Z0-9_]+| ${_and} | ${_or} |\\(|\\))`;
const reToken = new RegExp(reString);
reString = `^[a-zA-Z0-9_]+={1}[a-zA-Z0-9_]+`;
const reKeyVal = new RegExp(reString);

//Parses search string into key:value object
export const getQueryObject = (query = "") => {
    const _and = 'AND', _or = 'OR', _assing = '=', _openBrac = '(', _closingBrac = ')';

    const outQueue = [];
    const opStack = [];

    const precedence = {
        [_and]: 2,
        [_or]: 1
    }

    while (query.length > 0) {
        console.log(outQueue)
        let token = query.match(reToken)[0];
        query = query.slice(token.length);
        token = token.trim();

        if (token.match(reKeyVal)) {
            outQueue.push(token);
        } else if (token === _and || token === _or) {
            while (precedence[opStack[opStack.length - 1]] >= precedence[token]) {
                outQueue.push(opStack.pop());
            }
            opStack.push(token);
        } else if (token === '(') {
            opStack.push(token);
        } else if (token === ')') {
            while (opStack[opStack.length - 1] !== '(') {
                if (opStack[opStack.length - 1] === undefined) {
                    console.log('ERROR: missmatched parentheses')
                    break;
                }
                outQueue.push(opStack.pop());
            }
            opStack.pop();
        }
    }

    if (query.length < 1) {
        while (opStack.length !== 0) {
            outQueue.push(opStack.pop());
        }
    }

    const mongoOperators = {
        [_or]: '$or',
        [_and]: '$and'
    }

    const stack = [];

    for (let i = 0; i < outQueue.length; i++) {
        const elem = outQueue[i];

        if (elem === _and || elem === _or) {
            const a = stack.pop();
            const b = stack.pop();

            const res = {
                [mongoOperators[elem]]: [
                    a,
                    b
                ]
            }
            stack.push(res);
        } else {
            const pair = elem.split(_assing);
            stack.push({ [pair[0]]: pair[1] });
        }
    }

    const result = stack.pop();
    console.log(JSON.stringify(result));

    return result || {};
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
    if (searchState.searchField) {
        query = {searchQuery: searchState.searchField}
    }

    // Selected Columns
    if (searchState.columns.length !== 0) {
        query[columnParameterName] = getVisibleColumnsInt(searchState.columns);
    }

    //Pagination 
    query = Object.assign({}, query, searchState.pagination);
    const redirectSearchUrl = '/?' + qs.stringify(query);
    return redirectSearchUrl;
}