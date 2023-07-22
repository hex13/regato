import {
    tokenize,
} from './tokenize';
import { Parser } from './Parser';
import { AstNode } from './ast';

export function parseTokens(tokens: AstNode[], context: string): AstNode {
    const parser = new Parser(tokens);
    switch (context) {
        case 'block':
            return parser.parseBlock();
        case 'expr':
        default:
            return parser.parseExpression();
    }
}

export function parse(code: string, context: string = 'expr'): AstNode {
    const tokens = tokenize(code);
    return parseTokens(tokens, context);
}