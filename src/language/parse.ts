import {
    tokenize,
} from './tokenize';
import { Parser } from './Parser';

export function parseTokens(tokens: any[], context: string) {
    const parser = new Parser(tokens);
    switch (context) {
        case 'block':
            return parser.parseBlock();
        case 'expr':
        default:
            return parser.parseExpression();
    }
}

export function parse(code: string, context: string = 'expr') {
    const tokens = tokenize(code);
    return parseTokens(tokens, context);
}