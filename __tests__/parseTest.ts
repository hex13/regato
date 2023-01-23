import { tokenize,
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN, BINARY_OP, NUMBER, STRING,
} from '../src/language/tokenize';
import { parse } from '../src/language/parse';

it('parse number', () => {
    const ast = parse('2.34');
    expect(ast).toEqual({
        kind: NUMBER,
        value: 2.34,
    });
});


it('parse binary expression', () => {
    const ast = parse('2 + 3');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: '+',
        left: {
            kind: NUMBER,
            value: 2,
        },
        right: {
            kind: NUMBER,
            value: 3,
        }
    });
});


it('parse two binary left-associative expressions with same precedence', () => {
    const ast = parse('10 - 9 + 1');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: '+',
        left: {
            kind: BINARY_OP,
            value: '-',
            left: {
                kind: NUMBER,
                value: 10,
            },
            right: {
                kind: NUMBER,
                value: 9,
            }
        },
        right: {
            kind: NUMBER,
            value: 1,
        }
    });
});


it('parse two binary left-associative expressions when first operator has greater precedence.', () => {
    const ast = parse('3 * 4 + 5');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: '+',
        left: {
            kind: BINARY_OP,
            value: '*',
            left: {
                kind: NUMBER,
                value: 3,
            },
            right: {
                kind: NUMBER,
                value: 4,
            }
        },
        right: {
            kind: NUMBER,
            value: 5,
        }
    });
});

it('parse two binary left-associative expressions when second operator has greater precedence.', () => {
    const ast = parse('3 + 4 * 5');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: '+',
        left: {
            kind: NUMBER,
            value: 3,
        },
        right: {
            kind: BINARY_OP,
            value: '*',
            left: {
                kind: NUMBER,
                value: 4,
            },
            right: {
                kind: NUMBER,
                value: 5,
            }
        },
    });
});