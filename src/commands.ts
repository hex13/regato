type Line = string[];

import { GameObject } from './objects';

export function runCommands(self: GameObject, lines: Line[]) {
    console.log("RUN ", lines)
    lines.forEach(line => {
        switch (line[0]) {
            case 'setPosition':
                self.position.x = parseFloat(line[1] as string);
                self.position.y = parseFloat(line[2] as string);
                break;
        }
    })
}

export function parseCommands(code: string): Line[] {
    const res = code.split('\n')
        .map(s => s.split(' ').filter(x => x))
        .filter(s => s.length)
    return res;
}