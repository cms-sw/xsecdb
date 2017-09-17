import qs from 'query-string';

RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const and = '&&', or = '||', assign = '=', openBrac = '(', closingBrac = ')';

const _and = RegExp.escape('&&');
const _or = RegExp.escape('||');
const _assign = RegExp.escape('=');
const _openBrac = RegExp.escape('(');
const _closingBrac = RegExp.escape(')');

//REGEX EXPLAINED:
//KEY part
//  [a-zA-Z_0-9]+ - self explainatory
//  ={1} - one equality symbol
//VALUE part
//  \\\\ - backslash support to allow escape character: '\'
//  a-zA-Z0-9_ - allow word chars
//  \\-  - allow dash symbol '-'
//  \[\^\$\.\?\*\+\{\} - allow '[', '^', '$', '.', '?', '*', '+', '{', '}'
//  \\\[\\\] - allow '[', ']'

let reStringKeyVal = `[a-zA-Z_0-9]+={1}[\\\\a-zA-Z0-9_%"\\-\[\^\$\.\?\*\+\{\}\\\[\\\]]+`;
let reString = `^(${reStringKeyVal}|${_and}|${_or}|${_openBrac}|${_closingBrac})`;

const reToken = new RegExp(reString);
const reKeyVal = new RegExp(reStringKeyVal);

const BASE_ERR_MSG = "Incorrect search query format";


export const getQueryObject = (query = "") => {
    query = query.replace(/\s/g, '');

    // >> SHUNTING YARD ALGORITHM
    const outQueue = [];
    const opStack = [];
    let keyValCount = 0, opCount = 0;

    const precedence = {
        [and]: 2,
        [or]: 1
    }

    while (query.length > 0) {
        //Match one of possible tokens: key=value, or operator, and operator, parentheses
        let matches = query.match(reToken);
        if (matches === null) {
            throw new Error(BASE_ERR_MSG);
        }

        const token = matches[0];
        query = query.slice(token.length);

        if (!token) {
            throw new Error(BASE_ERR_MSG);
        }

        if (token.match(reKeyVal)) {
            outQueue.push(token);
            keyValCount++;
        } else if (token === and || token === or) {
            while (precedence[opStack[opStack.length - 1]] >= precedence[token]) {
                outQueue.push(opStack.pop());
            }
            opStack.push(token);
            opCount++;
        } else if (token === openBrac) {
            opStack.push(token);
        } else if (token === closingBrac) {
            while (opStack[opStack.length - 1] !== openBrac) {
                if (opStack[opStack.length - 1] === undefined) {
                    throw new Error(`${BASE_ERR_MSG}: missmatched parentheses`);
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
    } else {
        throw new Error(BASE_ERR_MSG);
    }
    // << SHUNTING YARD ALGORITHM

    if (keyValCount - 1 !== opCount) {
        throw new Error(`${BASE_ERR_MSG}: operator and key=value counts do not match`);
    }

    // >> INTERPRET THE OUT PUT AND FORM MONGO QUERY
    const mongoOperators = {
        [or]: '$or',
        [and]: '$and'
    }

    const stack = [];

    for (let i = 0; i < outQueue.length; i++) {
        const elem = outQueue[i];

        if (elem === and || elem === or) {
            const a = stack.pop();
            const b = stack.pop();

            const res = {
                [mongoOperators[elem]]: [
                    a,
                    b
                ]
            }
            stack.push(res);
        } else if (elem === openBrac || elem === closingBrac) {
            throw new Error(`${BASE_ERR_MSG}: missmatched parentheses`);
        } else {
            const pair = elem.split(assign);

            try {
                const reg = new RegExp(pair[1]);
            } catch (e) {
                throw new Error(`${BASE_ERR_MSG}: value is incorrect RegExp. Maybe you need to use escape char \\ ?`);
            }

            stack.push({ [pair[0]]: pair[1] });
        }
    }

    const result = stack.pop();
    // << INTERPRET THE OUT PUT AND FORM MONGO QUERY

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
        query = { searchQuery: searchState.searchField }
    }

    // Selected Columns
    if (searchState.columns.length !== 0) {
        query[columnParameterName] = getVisibleColumnsInt(searchState.columns);
    }

    //Pagination and order by
    query = Object.assign({}, query, searchState.pagination, searchState.orderBy);
    const redirectSearchUrl = '/?' + qs.stringify(query);
    return redirectSearchUrl;
}