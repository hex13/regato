import {
    tokenize,
    BINARY_OP,
    BLOCK,
    LEFT_BRACE,
    RIGHT_BRACE,
    KEYWORD,
    IDENT,
    LET,
    FOR,
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
    eat(value: string) {
        const token = this.next();
        if (token.value != value) {
            throw new Error(`Syntax error. Expected '${value}' but found '${token.value}'`);
        }
    }
    parseBlock(): any {
        const body = [];
        while (!this.end() && this.peek().kind != RIGHT_BRACE) {
            const nextToken = this.peek();
            if (nextToken.kind == LEFT_BRACE) {
                this.next();
                body.push(this.parseBlock());
            } else if (nextToken.kind == KEYWORD) {
                switch (nextToken.value) {
                    case 'let':
                        body.push(this.parseLet());
                        break;
                    case 'for':
                        body.push(this.parseFor());
                        break;
                    default:
                        throw new Error(`Unexpected keyword '${nextToken.value}'.`);
                }
            } else {
                body.push(this.parseExpression());
            }

        }
        return {
            kind: BLOCK,
            body,
        }
    }
    assert(cond: Boolean, msg: string) {
        if (!cond) {
            throw new Error(msg);
        }
    }
    assertIdentifier(ident: any) {
        this.assert(ident.kind === IDENT, 'Syntax error: expected identifier. found ' + ident.value);
    }
    parseLet() {
        this.eat('let');
        const ident = this.next();
        this.assertIdentifier(ident);
        const nextToken = this.peek();
        let init;
        if (nextToken.kind == BINARY_OP && nextToken.value == '=') {
            this.next();
            init = this.parseExpression();
        } else {
            this.eat(';');
        }

        return {
            kind: LET,
            name: ident.value,
            init,
        }
    }
    parseFor() {
        this.eat('for');

        const ident = this.next();
        this.assertIdentifier(ident);
        const item = ident.value;

        this.eat('of');

        const iterable = this.parseExpression();

        this.eat('{');
        const block = this.parseBlock();

        return {
            kind: FOR,
            item,
            iterable,
            block,
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

            if (this.peek() && this.peek().kind == LEFT_BRACE) {
                break;
            }
        }
        while (token = operators.pop()) {
            applyOperator(token);
        }

        return expressions[0];
    }

}
