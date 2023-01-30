import { tokenize, 
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN, BINARY_OP, NUMBER, STRING, CALL,
    LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET, VOID,
} from '../src/language/tokenize';
const assert = require('assert');
test('tokenize()', () => {
    const code = `
    fn someFunc() {}
    let arr = [10, 20, 30];
    for item of arr {
        await abc(10,20);
        foo.bar.baz;

        if 12< 3{
            sth = 1.234;
            let foo <-bar + b - c + d * e / f;
            o <= c;
            "kotek + * - ";
            2**3;
            "kot" + "pies";
            foo();
        }
    }
    `;

    const expected =  [
        Token(KEYWORD, 'fn'),
        Token(IDENT, 'someFunc'),
        Token(BINARY_OP, '()'),
        Token(LEFT_PAREN, '('),
        Token(VOID, ''),
        Token(RIGHT_PAREN, ')'),
        Token(LEFT_BRACE, '{'),
        Token(RIGHT_BRACE, '}'),

        Token(KEYWORD, 'let'),
        Token(IDENT, 'arr'),
        Token(BINARY_OP, '='),

        Token(LEFT_SQUARE_BRACKET, '['),
        Token(NUMBER, 10),
        Token(BINARY_OP, ','),
        Token(NUMBER, 20),
        Token(BINARY_OP, ','),
        Token(NUMBER, 30),
        Token(RIGHT_SQUARE_BRACKET, ']'),
        Semicolon(),

        Token(KEYWORD, 'for'),
        Token(IDENT , 'item'),
        Token(KEYWORD, 'of'),
        Token(IDENT, 'arr'),
        Token(LEFT_BRACE, '{'),
    
        Token(VOID, ''),
        Token(BINARY_OP, 'await'),
        Token(IDENT, 'abc'),
        Token(BINARY_OP, '()'),
        Token(LEFT_PAREN, '('),
        Token(NUMBER, 10),
        Token(BINARY_OP, ','),
        Token(NUMBER, 20),
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

        Token(STRING, 'kot'),
        Token(BINARY_OP, '+'),
        Token(STRING, 'pies'),

        Semicolon(),

        Token(IDENT, 'foo'),
        Token(BINARY_OP, '()'),
        Token(LEFT_PAREN, '('),
        Token(VOID, ''),
        Token(RIGHT_PAREN, ')'),
        Semicolon(),

        Token(RIGHT_BRACE, '}'),
        Token(RIGHT_BRACE, '}'),
    ];
    assert.deepStrictEqual(tokenize(code), expected);
    
    
});