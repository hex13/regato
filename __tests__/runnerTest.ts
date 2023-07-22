
import { parse } from '../src/language/parse';
import { run } from '../src/language/runner';
import { AstNode } from '../src/language/ast';

it('interpret number', () => {
    const ast: AstNode = parse('123');
    const result = run(ast);
    expect(result).toEqual(123);
});


it('interpret binary op +', () => {
    const ast: AstNode = parse('10 + 32');
    const result = run(ast);
    expect(result).toEqual(42);
});

it('interpret binary op -', () => {
    const ast: AstNode = parse('100 - 7');
    const result = run(ast);
    expect(result).toEqual(93);
});


it('interpret binary op *', () => {
    const ast: AstNode = parse('3 * 7');
    const result = run(ast);
    expect(result).toEqual(21);
});

it('interpret binary op /', () => {
    const ast: AstNode = parse('12 / 3');
    const result = run(ast);
    expect(result).toEqual(4);
});

