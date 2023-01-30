import { tokenize,
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN, BINARY_OP, NUMBER, STRING, CALL, CALL_OPERATOR, ARRAY,
    BLOCK, LET, FOR, IF, LIST, VOID, FUNCTION,
} from '../src/language/tokenize';
import { parse } from '../src/language/parse';

it('parse number', () => {
    const ast = parse('2.34');
    expect(ast).toEqual({
        kind: NUMBER,
        value: 2.34,
    });
});

it('parse identifier', () => {
    const ast = parse('foo');
    expect(ast).toEqual({
        kind: IDENT,
        value: "foo",
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

it('parse parentheses.', () => {
    const ast = parse('(3 + 4) * 5');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: '*',
        left: {
            kind: BINARY_OP,
            value: '+',
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
        },
    });
});

it('parse nested parentheses.', () => {
    const ast = parse('(3 + 4 * (10 + 20)) * 5');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: '*',
        left: {
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
                    kind: BINARY_OP,
                    value: '+',
                    left: {
                        kind: NUMBER,
                        value: 10,
                    },
                    right: {
                        kind: NUMBER,
                        value: 20,
                    }
                }
            }
        },
        right: {
            kind: NUMBER,
            value: 5,
        },
    });
});



it('parse assignment of expression to variable', () => {
    const ast = parse('abc = 10 + 2');
    expect(ast).toEqual({
        kind: BINARY_OP,
        left: {
            kind: IDENT,
            value: "abc",
        },
        right: {
            kind: BINARY_OP,
            value: '+',
            left: {
                kind: NUMBER,
                value: 10,
            },
            right: {
                kind: NUMBER,
                value: 2,
            }
        },
        value: '='
    });
});

it('parse commas', () => {
    const ast = parse('a, b, c + d, e');
    expect(ast).toEqual({
        kind: LIST,
        items: [
            {kind: IDENT, value: 'a'},
            {kind: IDENT, value: 'b'},
            {
                kind: BINARY_OP,
                value: '+',
                left: {kind: IDENT, value: 'c'},
                right: {kind: IDENT, value: 'd'},
            },
            {kind: IDENT, value: 'e'},
        ]
    });
});

it('parse function calls without arguments', () => {
    const ast = parse('someFunc()');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: CALL_OPERATOR,
        left: {
            kind: IDENT, value: 'someFunc',
        },
        right: {
            kind: VOID, value: '',
        },
    });
});

it('parse function calls as part of + expression', () => {
    // TODO it depends on precedence of operators 
    // and maybe we need either some additional tests for other operators
    // or just precedence of operators should be rethought 
    const ast = parse('someFunc() + 2');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: '+',
        left: {
            kind: BINARY_OP,
            value: CALL_OPERATOR,
            left: {
                kind: IDENT, value: 'someFunc',
            },
            right: {
                kind: VOID, value: '',
            },
        },
        right: {kind: NUMBER, value: 2},
    });
});


it('parse function calls with one argument', () => {
    const ast = parse('sin(alpha)');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: CALL_OPERATOR,
        left: {
            kind: IDENT, value: 'sin',
        },
        right: {
            kind: IDENT, value: 'alpha'
        },
    });
});


it('parse function calls with many arguments', () => {
    const ast = parse('foo(10, 20 + 1, 30)');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: CALL_OPERATOR,
        left: {
            kind: IDENT, value: 'foo',
        },
        right: {
            kind: LIST,
            items: [
                {kind: NUMBER, value: 10},
                {
                    kind: BINARY_OP,
                    value: '+',
                    left: {kind: NUMBER, value: 20},
                    right: {kind: NUMBER, value: 1},

                },
                {kind: NUMBER, value: 30},
            ]
        }
    });
});

it('parse nested function calls', () => {
    const ast = parse('foo(bar(2))');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: CALL_OPERATOR,
        left: {kind: IDENT, value: 'foo'},
        right: {
            kind: BINARY_OP,
            value: CALL_OPERATOR,
            left: {
                kind: IDENT,
                value: 'bar',
            },
            right: {
                kind: NUMBER,
                value: 2,
            },
        },
    });
});


it('parse member expression calls', () => {
    const ast = parse('foo.bar(10)');
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: CALL_OPERATOR,
        left: {
            kind: BINARY_OP,
            value: '.',
            left: {
                kind: IDENT,
                value: 'foo',
            },
            right: {
                kind: IDENT,
                value: 'bar',
            },
        },
        right: {kind: NUMBER, value: 10},
    });
});

it('parse array expressions with one element', () => {
    const ast = parse('[a]');
    expect(ast).toEqual({
        kind: ARRAY,
        items: [
            {kind: IDENT, value: 'a'},
        ]
    });
});

it('parse array expressions with multiple elements', () => {
    const ast = parse('[a, b + 2, c]');
    expect(ast).toEqual({
        kind: ARRAY,
        items: [
            {kind: IDENT, value: 'a'},
            {
                kind: BINARY_OP,
                value: '+',
                left: {kind: IDENT, value: 'b'},
                right: {kind: NUMBER, value: 2},
            },
            {kind: IDENT, value: 'c'},
        ]
    });
});


it('parse empty block', () => {
     const ast = parse(``, 'block');
     expect(ast).toEqual({
        kind: BLOCK,
        body: [],
     })
});

it('parse block with expressions inside of it', () => {
    const ast = parse(`
        2 + 3; 
        1 * 10; 
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: BINARY_OP,
                value: '+',
                left: {kind: NUMBER, value: 2},
                right: {kind: NUMBER, value: 3},
            },
            {
                kind: BINARY_OP,
                value: '*',
                left: {kind: NUMBER, value: 1},
                right: {kind: NUMBER, value: 10},
            },
        ]
    });
});

it('parse block with inner empty block', () => {
    const ast = parse(`
        {

        }
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: BLOCK,
                body: [
                ]
            },
        ]
    });
});

it('parse block with two inner empty blocks', () => {
    const ast = parse(`
        {

        }

        {

        }
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: BLOCK,
                body: [

                ]
            },
            {
                kind: BLOCK,
                body: [
                ]
            },
        ]
    });
});


it('parse `let` declarations without initialization', () => {
    const ast = parse(`
        let blah;
        let wow;
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: LET,
                name: "blah",
            },
            {
                kind: LET,
                name: "wow",
            }
        ]
    });
});

it('parse `let` declarations with initialization', () => {
    const ast = parse(`
        let greeting = "Hello World";
        let wow = 1 + 2;
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: LET,
                name: "greeting",
                init: {
                    kind: STRING,
                    value: "Hello World",
                }
            },
            {
                kind: LET,
                name: "wow",
                init: {
                    kind: BINARY_OP,
                    value: '+',
                    left: {
                        kind: NUMBER,
                        value: 1,
                    },
                    right: {
                        kind: NUMBER,
                        value: 2,
                    }
                }
            }
        ]
    });
});

it('parse `for of` loop', () => {
    const ast = parse(`
        for sth of arr {
            1; 2;
        }
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: FOR,
                item: 'sth',
                iterable: {
                    kind: IDENT,
                    value: 'arr',
                },
                block: {
                    kind: BLOCK,
                    body: [
                        {kind: NUMBER, value: 1},
                        {kind: NUMBER, value: 2},
                    ]
                }
            }
        ]
    })
});

it('parse `if`', () => {
    const ast = parse(`
        if 1 < 2 {
            3; 4;
        }
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: IF,
                condition: {
                    kind: BINARY_OP,
                    value: '<',
                    left: {
                        kind: NUMBER,
                        value: 1,
                    },
                    right: {
                        kind: NUMBER,
                        value: 2
                    }
                },
                block: {
                    kind: BLOCK,
                    body: [
                        {kind: NUMBER, value: 3},
                        {kind: NUMBER, value: 4},
                    ]
                }
            }
        ]
    })
});


it('parse `if else`', () => {
    const ast = parse(`
        if 1 < 2 {
            3; 4;
        } else {
            5; 6;
        }
    `, 'block');
    expect(ast).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: IF,
                condition: {
                    kind: BINARY_OP,
                    value: '<',
                    left: {
                        kind: NUMBER,
                        value: 1,
                    },
                    right: {
                        kind: NUMBER,
                        value: 2
                    }
                },
                block: {
                    kind: BLOCK,
                    body: [
                        {kind: NUMBER, value: 3},
                        {kind: NUMBER, value: 4},
                    ]
                },
                elseBlock: {
                    kind: BLOCK,
                    body: [
                        {kind: NUMBER, value: 5},
                        {kind: NUMBER, value: 6},
                    ]
                }
            }
        ]
    })
});


it('parse `await`', () => {
    let ast;
    ast = parse(`await foo`);
    expect(ast).toEqual({
        kind: BINARY_OP,
        value: 'await',
        left: {
            kind: VOID,
            value: '',
        },
        right: {
            kind: IDENT,
            value: 'foo',
        }
    });

    ast = parse(`await foo(1,2);`, 'block');
    expect(ast.body[0]).toEqual({
        kind: BINARY_OP,
        value: 'await',
        left: {
            kind: VOID,
            value: '',
        },
        right: {
            kind: BINARY_OP,
            value: CALL_OPERATOR,
            left: {
                kind: IDENT, value: 'foo',
            },
            right: {
                kind: LIST,
                items: [
                    {kind: NUMBER, value: 1},
                    {kind: NUMBER, value: 2},
                ],
            },
        }
    });
});


it('parse function declaration (without params)', () => {
    const ast = parse(`fn foo() { }`, 'block');
    expect(ast.body[0]).toEqual({
       kind: FUNCTION,
       name: 'foo',
       params: {
            kind: VOID,
            value: '',
       },
       block: {
            kind: BLOCK,
            body: [],
       }
    })
});

it('parse function declaration (with one param)', () => {
    const ast = parse(`fn foo(a) { }`, 'block');
    expect(ast.body[0]).toEqual({
       kind: FUNCTION,
       name: 'foo',
       params: {kind: IDENT, value: 'a'},
       block: {
            kind: BLOCK,
            body: [],
       }
    })
});


it('parse function declaration (with params)', () => {
    const ast = parse(`fn foo(a, b) { }`, 'block');
    expect(ast.body[0]).toEqual({
       kind: FUNCTION,
       name: 'foo',
       params: {
            kind: LIST,
            items: [
                {kind: IDENT, value: 'a'},
                {kind: IDENT, value: 'b'},
            ]
       },
       block: {
            kind: BLOCK,
            body: [],
       }
    })
});

it('parse body of function declaration', () => {
    const ast = parse(`fn foo() { 2 + 2; bar; }`, 'block');
    const node = ast.body[0];
    expect(node.kind).toEqual(FUNCTION);
    expect(node.block).toEqual({
        kind: BLOCK,
        body: [
            {
                kind: BINARY_OP,
                value: '+',
                left: {kind: NUMBER, value: 2},
                right: {kind: NUMBER, value: 2},
            },
            {kind: IDENT, value: 'bar'},
        ]
    });
});