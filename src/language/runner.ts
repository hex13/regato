import { AstNode } from './ast';

const binaryOperators: Record<string, (a: any, b: any) => any> = {
    '+': (a: any, b: any) => a + b,
    '-': (a: any, b: any) => a - b,
    '*': (a: any, b: any) => a * b,
    '/': (a: any, b: any) => a / b,
};

export function run(node: AstNode): any {
    console.log("KIND:", node);
    switch (node.kind) {
        case 'binaryop':
            if (Object.hasOwn(binaryOperators, node.value)) {
                const op = binaryOperators[node.value]!;
                return op(
                    run(node.left),
                    run(node.right)
                );
            }
        default:
            return node.value;
    }
}