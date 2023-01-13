import React from 'react';
import { Transform } from './Transform';
import { GameObject } from '../objects';
import { useInterval } from './helpers';
import { ObjectLayer } from './ObjectLayer';
import { runCommands, parseCommands } from '../commands';

const initialObjects: Array<GameObject> = [
    {id: 1, position: {x: 100, y: 200}, velocity: {x: 0.3, y: 0}, events: {
        click(e: any, self: GameObject) {

            runCommands(self, parseCommands(`
                setPosition 300 300
            `));
        }
    }},
    {id: 2, position: {x: 200, y: 300}, velocity: {x: 0, y: -0.7}, events: {}},
    {id: 3, position: {x: 200, y: 300}, velocity: {x: -0.5, y: -0.5}, events: {}},
];
export function Content() {
    const [objects, setObjects] = React.useState(initialObjects);
    useInterval(() => {
        setObjects(objects => objects.map(o => ({...o, position: {x: o.position.x + o.velocity.x, y: o.position.y + o.velocity.y }})));
    }, 16);

    return <>
        <ObjectLayer objects={objects}/>
    </>
}
