import { tokenize,
    Token, Semicolon, Keyword, Ident, BinaryOp,
    KEYWORD, IDENT, LEFT_BRACE, RIGHT_BRACE, LEFT_PAREN, RIGHT_PAREN, BINARY_OP, NUMBER, STRING, SEMICOLON,
    BLOCK, LET, FOR, IF,
} from './tokenize';


export function compileToTokens(ast: any): any[] {
    const tokens: any[] = [];
    const visit = (node: any) => {
        switch (node.kind) {
            case BINARY_OP:
                visit(node.left);
                tokens.push({kind: BINARY_OP, value: node.value});
                visit(node.right);
                break;
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
            default:
                tokens.push({kind: node.kind, value: node.value});
        }
    };
    visit(ast);
    return tokens;
}