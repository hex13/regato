import { tokenize,
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN,
    LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET,
    BINARY_OP, NUMBER, STRING, SEMICOLON, VOID,
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

it('adds parentheses when needed on the left side', () => {
    let ast, tokens;
    ast = parse(`
        (3+4+5) * 2;
    `, 'block');
    tokens = compileToTokens(ast.body[0]);
    expect(tokens).toEqual([
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 3},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 4},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 5},
        {kind: RIGHT_PAREN, value: ')'},
        {kind: BINARY_OP, value: '*'},
        {kind: NUMBER, value: 2},
    ]);
});

it('adds parentheses when needed on the right side', () => {
    let ast, tokens;
    ast = parse(`
        2 * (3+4+5);
    `, 'block');
    tokens = compileToTokens(ast.body[0]);
    expect(tokens).toEqual([
        {kind: NUMBER, value: 2},
        {kind: BINARY_OP, value: '*'},
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 3},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 4},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 5},
        {kind: RIGHT_PAREN, value: ')'},
    ]);
});

it('adds nested parentheses', () => {
    let ast, tokens;
    ast = parse(`
        2 * ( 3 + 4 * (5 + 6))
    `, 'block');
    tokens = compileToTokens(ast.body[0]);
    expect(tokens).toEqual([
        {kind: NUMBER, value: 2},
        {kind: BINARY_OP, value: '*'},
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 3},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 4},
        {kind: BINARY_OP, value: '*'},
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 5},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 6},
        {kind: RIGHT_PAREN, value: ')'},
        {kind: RIGHT_PAREN, value: ')'},
    ]);
});

it('compile list', () => {
    let ast, tokens;
    ast = parse('123, 456, 789');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: NUMBER, value: 123},
        {kind: BINARY_OP, value: ','},
        {kind: NUMBER, value: 456},
        {kind: BINARY_OP, value: ','},
        {kind: NUMBER, value: 789},
    ]);
});

it('compile array', () => {
    let ast, tokens;
    ast = parse('[123, 456, 789]');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: LEFT_SQUARE_BRACKET, value: '['},
        {kind: NUMBER, value: 123},
        {kind: BINARY_OP, value: ','},
        {kind: NUMBER, value: 456},
        {kind: BINARY_OP, value: ','},
        {kind: NUMBER, value: 789},
        {kind: RIGHT_SQUARE_BRACKET, value: ']'},
    ]);
});


it('compile function call with one argument', () => {
    let ast, tokens;
    ast = parse('foo(123)');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: IDENT, value: 'foo'},
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 123},
        {kind: RIGHT_PAREN, value: ')'},
    ]);
});

it('compile function call with multiple arguments', () => {
    let ast, tokens;
    ast = parse('foo(123, 456 + 789)');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: IDENT, value: 'foo'},
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 123},
        {kind: BINARY_OP, value: ','},
        {kind: NUMBER, value: 456},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 789},
        {kind: RIGHT_PAREN, value: ')'},
    ]);
});

it('compile function call on multiple member expressions', () => {
    let ast, tokens;
    ast = parse('foo.bar.baz(123, 456 + 789)');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: IDENT, value: 'foo'},
        {kind: BINARY_OP, value: '.'},
        {kind: IDENT, value: 'bar'},
        {kind: BINARY_OP, value: '.'},
        {kind: IDENT, value: 'baz'},
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 123},
        {kind: BINARY_OP, value: ','},
        {kind: NUMBER, value: 456},
        {kind: BINARY_OP, value: '+'},
        {kind: NUMBER, value: 789},
        {kind: RIGHT_PAREN, value: ')'},
    ]);
});


it('compile `await`', () => {
    let ast, tokens;
    ast = parse('await foo(1)');
    tokens = compileToTokens(ast);
    expect(tokens).toEqual([
        {kind: VOID, value: ''},
        {kind: BINARY_OP, value: 'await'},
        {kind: IDENT, value: 'foo'},
        {kind: LEFT_PAREN, value: '('},
        {kind: NUMBER, value: 1},
        {kind: RIGHT_PAREN, value: ')'},
    ]);
});



it('compile example', () => {
    let ast, tokens;
    // TODO make this compiled (keep parens in such cases):
    // `console.log("hello " + "world " + ( 2000 + 20 + 3));`
    ast = parse(`
        console.log("hello " + "world " + 2023);
        let arr = [10, 20, 30];
        console.log(arr);
        for a of arr {
            let b = a + 11;
            let a = await foo();
            console.log(b);
        }
    `, 'block');

    tokens = compileToTokens(ast);
    // console.log("TTTTT%%%%%", tokens)
    fs.writeFileSync('out.js', tokens
        .map(t => t.kind == STRING? `"${t.value}"` : t.value)
        .map(t => t == ';' || t == '{' || t == '}'? t + '\n': t).join(' '), 'utf8',);
});