import { tokenize,
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN, BINARY_OP, NUMBER, STRING, SEMICOLON,
    BLOCK, LET, FOR, IF, binaryOperators,
    CALL_OPERATOR, LIST,
} from './tokenize';


export function compileToTokens(ast: any): any[] {
    const tokens: any[] = [];
    const visit = (node: any) => {
        switch (node.kind) {
            case BINARY_OP: {
                if (node.value == CALL_OPERATOR) {
                    visit(node.left);
                    tokens.push({kind: LEFT_PAREN, value: '('});
                    visit(node.right);
                    tokens.push({kind: RIGHT_PAREN, value: ')'});
                    return;
                }
                const currPrec = binaryOperators[node.value]![0];
                let needsParens;
                let subexpr;

                // TODO remove duplication
                needsParens = false;
                subexpr = node.left;
                if (subexpr.kind == BINARY_OP) {
                    const prec = binaryOperators[subexpr.value]![0];
                    if (prec < currPrec) needsParens = true;
                }
                if (needsParens) {
                    tokens.push({kind: LEFT_PAREN, value: '('});
                    visit(subexpr);
                    tokens.push({kind: RIGHT_PAREN, value: ')'});
                } else {
                    visit(subexpr);
                }

                tokens.push({kind: BINARY_OP, value: node.value});

                // TODO remove duplication
                needsParens = false;
                subexpr = node.right;
                if (subexpr.kind == BINARY_OP) {
                    const prec = binaryOperators[subexpr.value]![0];
                    if (prec < currPrec) needsParens = true;
                }
                if (needsParens) {
                    tokens.push({kind: LEFT_PAREN, value: '('});
                    visit(subexpr);
                    tokens.push({kind: RIGHT_PAREN, value: ')'});
                } else {
                    visit(subexpr);
                }
                break;
            }
            case BLOCK:
                tokens.push({kind: LEFT_BRACE, value: '{'});
                node.body.forEach((instr: any) => {
                    visit(instr);
                    tokens.push({kind: SEMICOLON, value: ';'});
                })
                tokens.push({kind: RIGHT_BRACE, value: '}'});
                break;
            case FOR:
                tokens.push({kind: node.kind, value: 'for'});
                tokens.push({kind: LEFT_PAREN, value: '('});
                tokens.push({kind: KEYWORD, value: 'const'});
                tokens.push({kind: IDENT, value: node.item});
                tokens.push({kind: KEYWORD, value: 'of'});
                visit(node.iterable);
                tokens.push({kind: RIGHT_PAREN, value: ')'});
                visit(node.block);
                break;
            case LET:
                tokens.push({kind: LET, value: 'let'});
                tokens.push({kind: IDENT, value: node.name});
                if (node.init) {
                    tokens.push({kind: BINARY_OP, value: '='});
                    visit(node.init);
                }
                break;
            case LIST:
                node.items.forEach((item: any, i: number) => {
                    visit(item);
                    if (i < node.items.length - 1) tokens.push({kind: BINARY_OP, value: ','});
                })
                break;

            default:
                tokens.push({kind: node.kind, value: node.value});
        }
    };
    visit(ast);
    return tokens;
}