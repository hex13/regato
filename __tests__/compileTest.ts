import { tokenize,
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN, BINARY_OP, NUMBER, STRING, SEMICOLON,
    BLOCK, LET, FOR, IF,
} from '../src/language/tokenize';
import { compileToTokens } from '../src/language/compile';
import { parse } from '../src/language/parse';
const fs = require('fs');

it('compile binary expression', () => {
    const ast = parse('123 + 567');
    const tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: NUMBER, value: 123},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 567},
    ]);
});


it('compile nested binary expressions', () => {
    let ast, tokens;
    ast = parse('2 * 3 + 4');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: NUMBER, value: 2},
        {kind: BINARY_OP, value: '*'},
        {kind: NUMBER, value: 3},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 4},
    ]);

    ast = parse('2 + 3 * 4');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: NUMBER, value: 2},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 3},
        {kind: BINARY_OP, value: '*'},
        {kind: NUMBER, value: 4},
    ]);
});

it('compile empty block', () => {
    let ast, tokens;
    ast = parse('', 'block');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: LEFT_BRACE, value: '{'},
        {kind: RIGHT_BRACE, value: '}'},
    ]);
});

it('compile block with some expressions in body', () => {
    let ast, tokens;
    ast = parse(`
        10;
        20;
    `, 'block');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: LEFT_BRACE, value: '{'},
        {kind: NUMBER, value: 10},
        {kind: SEMICOLON, value: ';'},
        {kind: NUMBER, value: 20},
        {kind: SEMICOLON, value: ';'},
        {kind: RIGHT_BRACE, value: '}'},
    ]);
});


it('compile `for`', () => {
    let ast, tokens;
    ast = parse(`
        for a of arr {
            123 + 456;
        }
    `, 'block');
    tokens = compileToTokens(ast.body[0]);
    expect(tokens).toEqual([
        {kind: FOR, value: 'for'},
        {kind: LEFT_PAREN, value: '('},
        {kind: KEYWORD, value: 'const'},
        {kind: IDENT, value: 'a'},
        {kind: KEYWORD, value: 'of'},
        {kind: IDENT, value: 'arr'},
        {kind: RIGHT_PAREN, value: ')'},
        {kind: LEFT_BRACE, value: '{'},
        {kind: NUMBER, value: 123},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 456},
        {kind: SEMICOLON, value: ';'},
        {kind: RIGHT_BRACE, value: '}'},
    ]);
});

it('compile `let` declaration without initialization', () => {
    let ast, tokens;
    ast = parse(`
        let foo;
    `, 'block');
    tokens = compileToTokens(ast.body[0]);
    expect(tokens).toEqual([
        {kind: LET, value: 'let'},
        {kind: IDENT, value: 'foo'},
    ]);
});

it('compile `let` declaration with initialization', () => {
    let ast, tokens;
    ast = parse(`
        let foo = a;
    `, 'block');
    tokens = compileToTokens(ast.body[0]);
    expect(tokens).toEqual([
        {kind: LET, value: 'let'},
        {kind: IDENT, value: 'foo'},
        {kind: BINARY_OP, value: '='},
        {kind: IDENT, value: 'a'},
    ]);
});

// TODO make it working
xit('compile example', () => {
    let ast, tokens;
    ast = parse(`
        let arr = $;
        for a of arr {
            item = 123 + 456;
        }
    `, 'block');
    tokens = compileToTokens(ast);
    fs.writeFileSync('out.js', tokens.map(t => t.value).join(' '), 'utf8',);
});