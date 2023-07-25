#[derive(PartialEq, Debug, Copy, Clone)]
enum Kind {
    Default,
    Number,
    Operator,
    Identifier,
    Call,
    LeftParenthesis,
    RightParenthesis,
}

const precedence: [(&str, i32); 4] = [
    ("+", 10),
    ("-", 10),
    ("*", 20),
    ("/", 20),
];

fn get_precedence(op: &Node) -> i32 {
    for (s, prec) in precedence {
        if op.value == s {
            return prec;
        }
    }
    return 0;
}
#[derive(Debug)]
struct Node {
    kind: Kind,
    value: String,
}

fn tokenize(code: &str) -> Vec<Node> {
    let mut state = Kind::Default;
    let mut prev_state = Kind::Default;

    let mut tokens = vec![];
    let mut start = 0;
    fn  next_token(i: usize, ch: char) {
    
    }
    
    let mut chars = code.chars();
    for i in 0..code.len() + 1 {
        let ch = chars.next().unwrap_or(' ');
        next_token(i, ch);
        let kind = match ch {
            '0'..='9' if state != Kind::Identifier => Kind::Number,
            '0'..='9' if state == Kind::Identifier => Kind::Identifier,
            'a'..='z' | 'A'..='Z' => Kind::Identifier,
            '+' | '-' | '*' | '/' | ',' => Kind::Operator,
            '(' => Kind::LeftParenthesis,
            ')' => Kind::RightParenthesis,
            _ => Kind::Default,
        };
        println!("{}, {:?}, {:?}", ch, kind, state);
        if state != Kind::Default {
            if state != kind {
                if state == Kind::LeftParenthesis && prev_state == Kind::Identifier {
                    tokens.push(Node { kind: Kind::Call, value: "()".to_string()});
                }
                tokens.push(Node { kind: state, value: code[start..i].to_string()});
                prev_state = state;
                state = Kind::Default;
            }
        }
        if state == Kind::Default {
            state = kind;
            start = i;
        }
    }
    
    tokens
}

fn parse(tokens: &Vec<Node>) -> Vec<&Node> {
    let mut out: Vec<&Node> = vec![];
    let apply_operator = |op| {
        out.push(op);
    };
    let mut opStack: Vec<&Node> = vec![];
    for token in tokens {
        if token.kind == Kind::LeftParenthesis {
            opStack.push(token);
        } else if token.kind == Kind::RightParenthesis {
            while opStack.len() > 0 && opStack.last().unwrap().kind != Kind::LeftParenthesis {
                out.push(opStack.pop().unwrap());
            }
            opStack.pop(); // left parenthesis
        } else if token.kind == Kind::Operator {
            while opStack.len() > 0 && get_precedence(&opStack.last().unwrap()) > get_precedence(&token) {
                out.push(opStack.pop().unwrap());
            }
            opStack.push(&token);
        } else {
            out.push(&token);
        }
    }
    while let Some(op) = opStack.pop() {
        out.push(op);
    }
    
    out
}

fn run(program: &Vec<&Node>) {
    let mut stack: Vec<f32> = vec![];
    for node in program {
        if node.kind == Kind::Number {
            stack.push(node.value.parse::<f32>().unwrap());
        } else if node.kind == Kind::Operator {
            let b = stack.pop().unwrap();
            let a = stack.pop().unwrap();
            let result = match node.value.as_str() {
                "+" => a + b,
                "-" => a - b,
                "*" => a * b,
                "/" => a / b,
                _ => panic!("uknown operator `{}`", node.value),
            };
            stack.push(result);
        }
        println!("{:?}", node);
        
    }
    println!("= {}", stack[0]);

}

fn main() {
    let code = "(7 + 2) * (3 + 4)    *     2+1010-33*(4+3)*7";
    // let code = "foo123(abc, 12 + 11) 3 * ( 4 + 7 ) ";
    let tokens = tokenize(code);
    println!("tokens = {:?}", tokens);
    let program = parse(&tokens);
    println!("PROGRAM = \n");
    run(&program);

}
