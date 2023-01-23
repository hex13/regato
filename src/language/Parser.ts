import {
    tokenize,
    BINARY_OP,
    BLOCK,
    LEFT_BRACE,
    RIGHT_BRACE,
    SEMICOLON,
    binaryOperators,
} from './tokenize';

export class Parser {
    tokens: any[];
    constructor(tokens: any[]) {
        this.tokens = [...tokens];
    }
    next() {
        return this.tokens.shift();
    }
    peek() {
        return this.tokens[0];
    }
    end() {
        return !this.tokens.length;
    }
    parseBlock(): any {
        const body = [];
        while (!this.end() && this.peek().kind != RIGHT_BRACE) {
            const nextToken = this.peek();
            if (nextToken.kind == LEFT_BRACE) {
                this.next();
                body.push(this.parseBlock());
            } else {
                body.push(this.parseExpression());
            }

        }
        return {
            kind: BLOCK,
            body,
        }
    }
    parseExpression() {
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
        while (token = this.next()) {
            if (token.kind == SEMICOLON) {
                break;
            } if (token.kind == BINARY_OP) {
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

}
