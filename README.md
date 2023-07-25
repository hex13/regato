
Regato - game editor (WIP)
===

RegatoScript - scripting language compiled to JS
Interpreter will be implemented soon!

Regato is research work for making frontend dev better.
Now it's written in TypeScript, but will be rewritten partially to Rust.

Plans:
- reactive scripting language 
- templates for writing GUI
- language tooling (debugger, inspector, VSCode plugin etc.)
- visual IDE for creating games
- frontend GUI library (either new one or integration with existing library like React)
- WebGL/WebGPU renderer (either from scratch or integration of Three.js)
- possibility of writing 3D/2D shaders
- flow/node based visual editor of logic

```
console.log("hello " + "world " + 2023);
let arr = [10, 20, 30];
console.log(arr);
for a of arr {
    let b = a + 11;
    console.log(a);
}
```

Language is still on design phase. It should be simple yet powerful. 

