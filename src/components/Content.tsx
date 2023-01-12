import React from 'react';
import { Transform } from './Transform';
import { useInterval } from './helpers';
import { ObjectLayer } from './ObjectLayer';

const initialObjects = [
    {id: 1, position: {x: 100, y: 200}, velocity: {x: 1, y: 0}},
    {id: 2, position: {x: 200, y: 300}, velocity: {x: 0, y: -1}},
    {id: 3, position: {x: 200, y: 300}, velocity: {x: -0.5, y: -0.5}},
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
