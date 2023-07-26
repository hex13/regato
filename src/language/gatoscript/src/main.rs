use std::collections::HashMap;

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

#[derive(Debug, Clone)]
enum Value {
    Float(f32),
    String(String),
}


const precedence: [(&str, i32); 5] = [
    ("+", 10),
    ("-", 10),
    ("*", 20),
    ("/", 20),
    ("()", 100),
];

fn get_precedence(op: &Node) -> i32 {
    for (s, prec) in precedence {
        if op.text() == s {
            return prec;
        }
    }
    return 0;
}

#[derive(Debug, Clone)]
struct Node {
    kind: Kind,
    value: Value,
}

impl Node {
    fn new(kind: Kind, value: Value) -> Node {
        Node { kind, value: value.clone() }
    }
    fn text(&self) -> &str {
        if let Value::String(text) = &self.value {
            text
        } else {
            ""
        }
    }
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
                    tokens.push(Node::new(Kind::Operator, Value::String("()".to_string())));
                }
                tokens.push(Node::new(state, Value::String(code[start..i].to_string())));
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
    let mut apply_operator = |op| {
        out.push(op);
    };
    let mut opStack: Vec<&Node> = vec![];
    for token in tokens {
        if token.kind == Kind::LeftParenthesis {
            opStack.push(token);
        } else if token.kind == Kind::RightParenthesis {
            while opStack.len() > 0 && opStack.last().unwrap().kind != Kind::LeftParenthesis {
                apply_operator(opStack.pop().unwrap());
            }
            opStack.pop(); // left parenthesis
        } else if token.kind == Kind::Operator {
            while opStack.len() > 0 && get_precedence(&opStack.last().unwrap()) > get_precedence(&token) {
                apply_operator(opStack.pop().unwrap());
            }
            opStack.push(&token);
        } else {
            apply_operator(&token);
        }
    }
    while let Some(op) = opStack.pop() {
        apply_operator(op);
    }

    out
}

type Builtins = HashMap<&'static str, Box<dyn Fn(f32) -> f32>>;
fn run(program: &Vec<&Node>, builtins: &Builtins) {
    let mut stack: Vec<Value> = vec![];
    for node in program {
        if node.kind == Kind::Number {
            stack.push(Value::Float(node.text().parse::<f32>().unwrap()));
        } else if node.kind == Kind::Operator {
            let b = stack.pop().unwrap();
            let a = stack.pop().unwrap();
            let result = match node.text() {
                op @ ("+" | "-" | "*" | "/") => {
                    if let (Value::Float(a), Value::Float(b)) = (a, b) {
                        Value::Float(match op {
                            "+" => a + b,
                            "-" => a - b,
                            "*" => a * b,
                            "/" => a / b,
                            _ => 0.0
                        })
                    } else {
                        Value::Float(0.0)
                    }
                },
                "()" => {
                    if let Value::String(func_name) = a {
                        let func = builtins.get(func_name.as_str()).unwrap();
                        if let Value::Float(arg) = b {
                            Value::Float(func(arg))
                        } else {
                            Value::Float(0.0)
                        }
                    } else {
                        Value::Float(0.0)
                    }
                }
                _ => panic!("uknown operator `{}`", node.text()),
            };
            stack.push(result);
        } else {
            stack.push(node.value.clone());
        }

        println!("{:?}", node);
    }
    println!("= {:?}", stack[0]);

}

fn main() {

    let mut builtins: Builtins = HashMap::new();

    builtins.insert("ten", Box::new(|x: f32| {
        x * 10.0
    }));

    builtins.insert("hundred", Box::new(|x: f32| {
        x * 100.0
    }));

    // let code = "(7 + 2) * (3 + 4)    *     2+1010-33*(4+3)*7";
    let code = "ten(3) + 3 + hundred(2)";
    // let code = "foo123(abc, 12 + 11) 3 * ( 4 + 7 ) ";
    let tokens = tokenize(code);
    println!("tokens = {:?}", tokens);
    let program = parse(&tokens);
    println!("PROGRAM = \n");
    for node in &program {
        println!("= {:?}", node);
    }

    run(&program, &builtins);

}
