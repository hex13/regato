

export const KEYWORD = 'keyword';
export const IDENT = 'ident';
export const LEFT_BRACE = 'leftbrace';
export const RIGHT_BRACE = 'rightbrace';
export const LEFT_PAREN = 'leftparen';
export const RIGHT_PAREN = 'rightparen';
export const SEMICOLON = 'semicolon';
export const NUMBER = 'number';
export const STRING = 'string';
export const BINARY_OP = 'binaryop';
export const BLOCK = 'block';
export const LET = 'let';
export const FOR = 'for';
export const IF = 'if';
export const LIST = 'list';
export const CALL = 'call';
export const ARRAY = 'array';
export const LEFT_SQUARE_BRACKET = 'left_sq_bracket';
export const RIGHT_SQUARE_BRACKET = 'right_sq_bracket';


export const CALL_OPERATOR = '()';



const re = /\d+\.\d+|\w+|\".*?\"|\*\*|<-|<=|[{}()\-+*/<>.;=,\[\]]/g
type Kind = string;
type Value = string | number;
export const Token = (kind: Kind, value: Value) => ({kind, value});
export const Semicolon = () => Token(SEMICOLON, ';');
export const Keyword = (value: string) => Token(KEYWORD, value);
export const Ident = (value: string) => Token(IDENT, value);
export const BinaryOp = (value: string) => Token(BINARY_OP, value);

export const keywords = ['await', 'if', 'for', 'let', 'of'];

export const binaryOperators: Record<string, [number]> = {
    '.': [15],
    '<': [10],
    '=': [5],
    '**': [10],
    '*': [20],
    '+': [10],
    '-': [10],
    '/': [20],
    '<-': [10],
    '<=': [10],
    ',': [8],
    '()': [4],
};



function canBePostfixReceiver(token: any) {
    if (!token) return false;
    return token.kind == IDENT;
}

export function tokenize(code: string) {
    const tokens: any[] = [];
    Array.from(code.matchAll(re)).forEach((match: any, i) => {
        let value = match[0];
        let kind = '?';
        const number = parseFloat(value);
        if (keywords.includes(value)) {
            kind = KEYWORD;
        } else if (!isNaN(number)) {
            kind = NUMBER;
            value = number;
        } else if (value.at(0) == '"' && value.at(-1) == '"') {
            kind = STRING;
            value = value.slice(1, -1);
        } else if (value.match(/[a-zA-Z]\w*/)) {
            kind = IDENT;
        } else if (value == '{') {
            kind = LEFT_BRACE;
        } else if (value == '}') {
            kind = RIGHT_BRACE;
        } else if (value == ';') {
            kind = SEMICOLON;
        } else if (value == '(') {
            if (canBePostfixReceiver(tokens.at(-1))) {
                tokens.push(Token(BINARY_OP, CALL_OPERATOR));
            }
            kind = LEFT_PAREN;
        } else if (value == ')') {
            kind = RIGHT_PAREN;
        } else if (value == '[' ) {
            kind = LEFT_SQUARE_BRACKET;
        } else if (value == ']') {
            kind = RIGHT_SQUARE_BRACKET;
        } else if (Object.hasOwn(binaryOperators, value)) {
            kind = BINARY_OP;
        }

        tokens.push(Token(kind, value));
    });
    return tokens;
}




