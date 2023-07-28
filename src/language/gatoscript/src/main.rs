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
    Empty,
}

#[derive(PartialEq, Debug, Clone)]
enum Value {
    Float(f32),
    String(String),
    List(Vec<Value>),
    Function(fn(ArgList) -> Value),
    Object(Object),
    Property(Box<Value>, Box<Value>),
    Error(String),
}

impl Value {
    fn evaluate(&self) -> Self {
        if let Value::Property(obj, prop) = &self {
            obj.evaluate().get_property(prop)
        } else {
            self.clone()
        }
    }
    fn get_property(&self, prop: &Value) -> Value {
        if let Value::Object(obj) = self {
            if let Value::String(prop_name) = &prop {
                if let Some(value) = obj.data.get(prop_name.as_str()) {
                    value.clone()
                } else {
                    Value::Error(format!("{:?} is not a property of {:?}", &prop, self))
                }
            } else {
                Value::Error(format!("{:?} is not a string and only string properties are supported.", &prop))
            }
        } else {
            Value::Error(format!("{:?} is not an object.", self))
        }
    }
}

#[derive(PartialEq, Debug, Clone)]
struct Object {
    data: HashMap<&'static str, Value>,
}
struct ArgList {
    data: Vec<Value>,
}

impl ArgList {
    fn get_float(&self, idx: usize) -> Option<f32> {
        if let Value::Float(x) = self.data[idx] {
            Some(x)
        } else {
            None
        }
    }
}


const precedence: [(&str, i32); 7] = [
    (",", 4),
    ("+", 10),
    ("-", 10),
    ("*", 20),
    ("/", 20),
    ("()", 30),
    (".", 30),
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

type Builtins = HashMap<&'static str, Value>;

fn tokenize(code: &str) -> Vec<Node> {
    let mut state = Kind::Default;
    let mut prev_state = Kind::Default;

    let mut tokens = vec![];
    let mut start = 0;
    fn  next_token(i: usize, ch: char) {
    
    }
    
    let mut chars = code.chars();
    let mut part = 0;
    for i in 0..code.len() + 1 {
        let ch = chars.next().unwrap_or(' ');
        next_token(i, ch);
        let kind = match ch {
            '0'..='9' if state != Kind::Identifier => Kind::Number,
            '0'..='9' if state == Kind::Identifier => Kind::Identifier,
            'a'..='z' | 'A'..='Z' => Kind::Identifier,
            '.' if state == Kind::Number && part == 0 => {
                part += 1;
                Kind::Number
            },
            '+' | '-' | '*' | '/' | ',' | '.' => Kind::Operator,
            '(' => Kind::LeftParenthesis,
            ')' => Kind::RightParenthesis,
            _ => Kind::Default,
        };
        if state != Kind::Default {
            if state != kind {
                if state == Kind::LeftParenthesis && prev_state == Kind::Identifier {
                    tokens.push(Node::new(Kind::Operator, Value::String("()".to_string())));
                }
                if state == Kind::RightParenthesis && prev_state == Kind::LeftParenthesis {
                    tokens.push(Node::new(Kind::Empty, Value::Float(0.0)));
                }
                tokens.push(Node::new(state, Value::String(code[start..i].to_string())));
                prev_state = state;
                state = Kind::Default;
            }
        }
        if state == Kind::Default {
            state = kind;
            start = i;
            part = 0;
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
            while opStack.len() > 0 && get_precedence(&opStack.last().unwrap()) >= get_precedence(&token) {
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

fn run(program: &Vec<&Node>, builtins: &Builtins) -> Value {
    let mut stack: Vec<Value> = vec![];
    for node in program {
        if node.kind == Kind::Number {
            stack.push(Value::Float(node.text().parse::<f32>().unwrap()));
        } else if node.kind == Kind::Operator {
            let b = stack.pop().unwrap();
            let a = stack.pop().unwrap();
            let result = match node.text() {
                op @ ("+" | "-" | "*" | "/") => {
                    if let (Value::Float(a), Value::Float(b)) = (a.evaluate(), b.evaluate()) {
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
                "," => {
                    if let Value::List(mut list) = a {
                        list.push(b);
                        Value::List(list)
                    } else {
                        Value::List(vec![a, b])
                    }
                }
                "." => {
                    let obj = if let Value::String(var_name) = &a {
                        builtins.get(var_name.as_str())
                            .unwrap_or(&Value::Error(format!("unknown variable: {}", var_name)))
                            .clone()
                    } else {
                        a
                    };
                    Value::Property(Box::new(obj), Box::new(b))
                }
                "()" => {
                    let func = if let Value::String(func_name) = a {
                        if let func @ Value::Function(_) = builtins.get(func_name.as_str()).unwrap() {
                            func.clone()
                        } else {
                            Value::Error(format!("{:?} is not a function name", func_name))
                        }
                    } else {
                        a.evaluate()
                    };

                    if let Value::Function(func) = func {
                        if let Value::List(args) = b {
                            func(ArgList { data: args })
                        } else {
                            func(ArgList { data: vec![b] })
                        }
                    } else {
                        Value::Error(format!("{:?} is not a function", func))
                    }
                }
                _ => panic!("unknown operator `{}`", node.text()),
            };
            stack.push(result);
        } else {
            stack.push(node.value.clone());
        }

        println!("{:?}", node);
    }
    println!("= {:?}", stack[0]);
    stack[0].clone()

}


fn builtin_ten(args: ArgList) -> Value {
    Value::Float(args.get_float(0).unwrap() * 10.0)
}


fn builtin_hundred(args: ArgList) -> Value {
    Value::Float(args.get_float(0).unwrap() * 100.0)
}


fn main() {

    let mut builtins: Builtins = HashMap::new();

    builtins.insert("hello", Value::Function(|args: ArgList| {
        Value::String("Hello World :)".into())
    }));
    builtins.insert("ten", Value::Function(builtin_ten));
    builtins.insert("hundred", Value::Function(builtin_hundred));

    builtins.insert("add", Value::Function(|args: ArgList| {
        Value::Float(args.get_float(0).unwrap() + args.get_float(1).unwrap() + args.get_float(2).unwrap())
    }));

    // let code = "(7 + 2) * (3 + 4)    *     2+1010-33*(4+3)*7";
    // let code = "ten(3) + 3 + hundred(2) + add(10, 20, 30)";
    let code = "hello()";
    // let code = "add(50,1, 13) + hundred(30)";
    // let code = "foo.bar.baz";
    // let code = "50,1, 13";
    // let code = "ten(2) + hundred(30)";
    // let code = "foo123(abc, 12 + 11) 3 * ( 4 + 7 ) ";
    let tokens = tokenize(code);
    println!("tokens = {:?}", tokens);
    let program = parse(&tokens);
    println!("\nPROGRAM");
    for node in &program {
        println!("instr: {:?}", node);
    }
    println!("END PROGRAM");

    run(&program, &builtins);

}


#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn numbers() {
        let mut builtins: Builtins = HashMap::new();
        let code = "2";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::Float(2.0));

        let code = "3.14";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::Float(3.14));

        let code = "9.1.2";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::Property(Box::new(Value::Float(9.1)), Box::new(Value::Float(2.0))));
    }
    #[test]
    fn expression_with_left_associativity() {
        let mut builtins: Builtins = HashMap::new();
        let code = "2 - 5 + 1";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::Float(-2.0));
    }
    #[test]
    fn function_calls() {
        let mut builtins: Builtins = HashMap::from_iter([
            (
                "hello",
                Value::Function(|args: ArgList| {
                    Value::String("Hello World :)".into())
                })
            ),
            (
                "addTwo",
                Value::Function(|args: ArgList| {
                    Value::Float(args.get_float(0).unwrap() + 2.0)
                })
            ),
            (
                "sum",
                Value::Function(|args: ArgList| {
                    let mut sum = 0.0;
                    for i in 0..args.data.len() {
                        sum += args.get_float(i).unwrap();
                    }
                    Value::Float(sum)
                })
            ),
        ]);
        let code = "hello()";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::String("Hello World :)".into()));

        let code = "addTwo(3)";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::Float(5.0));

        let code = "sum(3, 10)";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::Float(13.0));

        let code = "sum(3, 10, 20)";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value, Value::Float(33.0));
    }

    #[test]
    fn member_expression() {
        let capital = Value::Object(
            Object {
                data: HashMap::from_iter([("name", Value::String("Warszawa".into()))])
            }
        );
        let data: HashMap<&str, Value> = HashMap::from_iter([
            ("capital", capital),
            (
                "playAnthem",
                Value::Function(|argList| {
                    Value::String("Jeszcze Polska nie zginęła...".into())
                }),
            ),
        ]);
        let builtins: Builtins = HashMap::from_iter([
            ("Poland", Value::Object(Object { data })),
        ]);
        let code = "Poland.capital.name";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value.evaluate(), Value::String("Warszawa".to_string()));

        let code = "Poland.playAnthem()";
        let tokens = tokenize(code);
        let program = parse(&tokens);
        let value = run(&program, &builtins);
        assert_eq!(value.evaluate(), Value::String("Jeszcze Polska nie zginęła...".to_string()));

    }

}
