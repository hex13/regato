const assert = require('assert');

const KEYWORD = 'keyword';
const IDENT = 'ident';
const LEFT_BRACE = 'leftbrace';
const RIGHT_BRACE = 'rightbrace';
const LEFT_PAREN = 'leftparen';
const RIGHT_PAREN = 'rightparen';
const SEMICOLON = 'semicolon';
const NUMBER = 'number';
const STRING = 'string';
const BINARY_OP = 'binaryop';

const code = `
for item of array {
    await abc();
    foo.bar.baz;
    
    if 12< 3{
        sth = 1.234;
        let foo <-bar + b - c + d * e / f;
        o <= c;
        "kotek + * - ";
        2**3;
    }
}
`;

const re = /\d+\.\d+|\w+|\".*\"|\*\*|<-|<=|[{}()\-+*/<>.;=]/g
const Token = (kind, value) => ({kind, value});
const Semicolon = () => Token(SEMICOLON, ';');
const Keyword = (value) => Token(KEYWORD, value);
const Ident = (value) => Token(IDENT, value);
const BinaryOp = (value) => Token(BINARY_OP, value);

const keywords = ['await', 'if', 'for', 'let', 'of'];
const binaryOperators = {
    '.': [],
    '<': [],
    '=': [],
    '**': [],
    '*': [],
    '+': [],
    '-': [],
    '/': [],
    '<-': [],
    '<=': [],
};

const tokens = Array.from(code.matchAll(re)).map(match => {
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
        kind = LEFT_PAREN;
    } else if (value == ')') {
        kind = RIGHT_PAREN;
    } else if (Object.hasOwn(binaryOperators, value)) {
        kind = BINARY_OP;
    }

    return Token(kind, value);
});


const expected =  [
    Token(KEYWORD, 'for'),
    Token(IDENT , 'item'),
    Token(KEYWORD, 'of'),
    Token(IDENT, 'array'),
    Token(LEFT_BRACE, '{'),

    Token(KEYWORD, 'await'),
    Token(IDENT, 'abc'),
    Token(LEFT_PAREN, '('),
    Token(RIGHT_PAREN, ')'),
    Semicolon(),

    Token(IDENT, 'foo'),
    Token(BINARY_OP, '.'),
    Token(IDENT, 'bar'),
    Token(BINARY_OP, '.'),
    Token(IDENT, 'baz'),

    Semicolon(),

    Token(KEYWORD, 'if'),
    Token(NUMBER, 12),
    Token(BINARY_OP, '<'),
    Token(NUMBER, 3),
    Token(LEFT_BRACE, '{'),

    Ident('sth'),
    Token(BINARY_OP, '='),
    Token(NUMBER, 1.234),

    Semicolon(),
    Keyword('let'),
    Ident('foo'),
    Token(BINARY_OP, '<-'),
    Ident('bar'),
    BinaryOp('+'),
    Ident('b'),
    BinaryOp('-'),
    Ident('c'),
    BinaryOp('+'),
    Ident('d'),
    BinaryOp('*'),
    Ident('e'),
    BinaryOp('/'),
    Ident('f'),
    Semicolon(),

    Ident('o'),
    BinaryOp('<='),
    Ident('c'),
    Semicolon(),

    Token(STRING, "kotek + * - "),

    Semicolon(),

    Token(NUMBER, 2),
    BinaryOp('**'),
    Token(NUMBER, 3),

    Semicolon(),

    Token(RIGHT_BRACE, '}'),
    Token(RIGHT_BRACE, '}'),


];

assert.deepStrictEqual(tokens, expected);
console.log(tokens);

