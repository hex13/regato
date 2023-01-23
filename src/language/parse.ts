import {
    tokenize,
    BINARY_OP,
    binaryOperators,
} from './tokenize';

export function parseTokens(tokens: any[]) {
    function next() {
        return tokens.shift();
    }

    function applyOperator(token: any) {
        const right = expressions.pop();
        const left = expressions.pop();
        expressions.push({
            kind: token.kind,
            value: token.value,
            left,
            right,
        });
    }

    let token;
    const operators = [];
    const expressions: any[] = [];
    while (token = next()) {
        if (token.kind == BINARY_OP) {
            const currentPrecedence = binaryOperators[token.value]![0];
            while (operators.length && binaryOperators[operators.at(-1)!.value]![0] >= currentPrecedence) {
                    applyOperator(operators.pop());
            }
            operators.push(token);
        } else {
            expressions.push(token);
        }
    }
    while (token = operators.pop()) {
        applyOperator(token);
    }
    return expressions[0];

}

export function parse(code: string) {
    const tokens = tokenize(code);
    return parseTokens(tokens);

}