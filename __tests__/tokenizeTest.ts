import { tokenize, 
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN, BINARY_OP, NUMBER, STRING,
} from '../src/language/tokenize';
const assert = require('assert');
test('tokenize()', () => {
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
    assert.deepStrictEqual(tokenize(code), expected);
    
    
});