import React from 'react';
import { Transform } from './Transform';
import { useInterval } from './helpers';

export function Content() {
    const radius = 100;
    const [angle, setAngle] = React.useState(0);
    const [center, setCenter] = React.useState({x: 300, y: 300});
    useInterval(() => {
        setAngle(angle => angle + 0.01);
    }, 100);
    useInterval(() => {
        setCenter(center => ({x: center.x + 2, y: center.y}));
    }, 30);
    return <>
        <Transform transform={{position: {x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius}}}/>
        <Transform transform={{position: center}}/>
    </>
}
