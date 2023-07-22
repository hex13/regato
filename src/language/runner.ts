import { AstNode } from './ast';
import { CALL_OPERATOR } from './tokenize';

const binaryOperators: Record<string, (a: any, b: any, ctx?: any) => any> = {
    '+': (a: any, b: any) => a + b,
    '-': (a: any, b: any) => a - b,
    '*': (a: any, b: any) => a * b,
    '/': (a: any, b: any) => a / b,
    [CALL_OPERATOR]: (left, right, ctx) => {
        return ctx.get(left)(right);
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
    constructor(builtins: Record<string, any>) {
        this.builtins = builtins;
    }
    get(key: any) {
        return this.builtins[key];
    }
}
export function run(node: AstNode, ctx?: Context): any {
    switch (node.kind) {
        case 'binaryop':
            if (Object.hasOwn(binaryOperators, node.value)) {
                const op = binaryOperators[node.value]!;
                return op(
                    run(node.left, ctx),
                    run(node.right, ctx),
                    ctx,
                );
            }
        default:
            return node.value;
    }
}