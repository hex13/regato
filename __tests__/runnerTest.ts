
import { parse } from '../src/language/parse';
import { run, Context } from '../src/language/runner';
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

it('interpret function call', () => {
    const ast: AstNode = parse('foo(10)');
    const result = run(ast, new Context({
        foo: (x: number) => x + 123,
    }));
    expect(result).toEqual(133);
});

it('interpret member expression', () => {
    const ast: AstNode = parse('foo.bar');
    const result = run(ast, new Context({
        foo: {
            bar: 8
        }
    }));
    expect(result).toEqual(8);
});

it('interpret method call (member expression + function call)', () => {
    const ast: AstNode = parse('foo.bar(10)');
    const result = run(ast, new Context({
        foo: {
            bar: (x: number) => x + 100,
        }
    }));
    expect(result).toEqual(110);
});

it('interpret member expression (recursive)', () => {
    const ast: AstNode = parse('foo.bar.baz');
    const result = run(ast, new Context({
        foo: {
            bar: {
                baz: 1234,
            }
        }
    }));
    expect(result).toEqual(1234);
});


it('interpret larger expression', () => {
    const ast: AstNode = parse('foo.bar.baz + 10 * 2 + 1');
    const result = run(ast, new Context({
        foo: {
            bar: {
                baz: 1234,
            }
        }
    }));
    expect(result).toEqual(1255);
});
