import {
    tokenize,
    BINARY_OP,
    BLOCK,
    LEFT_BRACE,
    RIGHT_BRACE,
    LEFT_PAREN,
    RIGHT_PAREN,
    LEFT_SQUARE_BRACKET,
    RIGHT_SQUARE_BRACKET,
    KEYWORD,
    IDENT,
    LET,
    FOR,
    IF,
    SEMICOLON,
    LIST,
    ARRAY,
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
        if (!token) {
            throw new Error(`Syntax error. Expected '${value}' but found end of file.'`);
        }
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
                    case 'if':
                        body.push(this.parseIf());
                        break;
                    default:
                        throw new Error(`Unexpected keyword '${nextToken.value}'.`);
                }
            } else {
                body.push(this.parseExpression());
            }
        }
        if (this.peek()  && this.peek().kind == RIGHT_BRACE) {
            this.next();
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
    parseIf() {
        this.eat('if');
        const condition = this.parseExpression();
        this.eat('{');
        const block = this.parseBlock();
        const nextToken = this.peek();
        let elseBlock;
        if (nextToken && nextToken.kind == IDENT && nextToken.value == 'else') {
            this.eat('else');
            this.eat('{');
            elseBlock = this.parseBlock();
        }
        return {
            kind: IF,
            condition,
            block,
            elseBlock,
        };
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
        const applyOperator = (token: any) => {
            const right = expressions.pop();
            const left = expressions.pop();
            if (token.value == ',') {
                if (left.kind == LIST) {
                    left.items.push(right);
                    expressions.push(left);
                } else {
                    expressions.push({
                        kind: LIST,
                        items: [left, right],
                    });
                }
            } else if (token.kind == LEFT_SQUARE_BRACKET){
                this.assert(!left, 'Assertion error: left should be undefined');
                expressions.push({
                    kind: ARRAY,
                    items: right.kind == LIST? right.items : [right],
                });
            } else {
                expressions.push({
                    kind: token.kind,
                    value: token.value,
                    left,
                    right,
                });
            }
        }

        let token;
        const operators: any[] = [];
        const expressions: any[] = [];
        while (token = this.next()) {
            const isLeftBracket = token.kind == LEFT_SQUARE_BRACKET;
            const isRightBracket = token.kind == RIGHT_SQUARE_BRACKET;
            if (token.kind == SEMICOLON) {
                break;
            } if (token.kind == LEFT_PAREN || token.kind == LEFT_SQUARE_BRACKET) {
                operators.push(token);
            } else if (token.kind == RIGHT_PAREN || isRightBracket) {
                let counterpart = LEFT_PAREN;
                if (isRightBracket) counterpart = LEFT_SQUARE_BRACKET;

                while (operators.length && operators.at(-1).kind !== counterpart) {
                    applyOperator(operators.pop());
                }
                const op = operators.pop();
                if (op.kind == LEFT_SQUARE_BRACKET) {
                    applyOperator(op);
                }
            } else if (token.kind == BINARY_OP) {
                const currentPrecedence = binaryOperators[token.value]![0];
                const greaterPrecedence = () => {
                    const opInfo = binaryOperators[operators.at(-1)!.value];
                    if (opInfo) {
                        return opInfo[0] >= currentPrecedence;
                    }
                    return false;
                }
                while (operators.length && operators.at(-1).kind !== LEFT_PAREN && greaterPrecedence()) {
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
