import { AstNode } from './ast';
import { CALL_OPERATOR } from './tokenize';


const binaryOperators: Record<string, (a: any, b: any, ctx?: any) => any> = {
    '+': (a: any, b: any) => a + b,
    '-': (a: any, b: any) => a - b,
    '*': (a: any, b: any) => a * b,
    '/': (a: any, b: any) => a / b,
    [CALL_OPERATOR]: (left, right, ctx) => {
        return left(right);
    },
    '.': (left, right, ctx) => {
        let obj;
        if (typeof left == 'string') {
            obj = ctx.get(left);
        } else {
            obj = left;
        }
        return Object.hasOwn(obj, right)? obj[right] : undefined;
    }
};

export class Context {
    builtins: Record<string, any>;
    parents: any[];
    constructor(builtins: Record<string, any>) {
        this.builtins = builtins;
        this.parents = [];
    }
    get(key: any) {
        return this.builtins[key];
    }
    parent() {
        return this.parents[this.parents.length - 2] || {kind: 'none'};
    }
}

export function run(node: AstNode, ctx?: Context): any {
    console.log('run ', node);
    let result = node.value;
    if (ctx) ctx.parents.push(node);
    switch (node.kind) {
        case 'binaryop':
            if (Object.hasOwn(binaryOperators, node.value)) {
                const op = binaryOperators[node.value]!;
                result = op(
                    run(node.left, ctx),
                    run(node.right, ctx),
                    ctx,
                );
            }
            break;
        case 'ident':
            const parent =  ctx!.parent();
            if (!(parent.kind == 'binaryop' && parent.value == '.')) {
                result = ctx?.get(node.value);
            }
            break;
    }
    if (ctx) ctx.parents.pop();
    return result;
}