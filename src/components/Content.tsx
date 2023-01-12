import React from 'react';

import { Transform } from './Transform';

export function Content() {
    const radius = 100;
    const [angle, setAngle] = React.useState(0);
    const [center, setCenter] = React.useState({x: 300, y: 300});
    React.useEffect(() => {
        const interval = setInterval(() => {
            setAngle(angle => angle + 0.01);
        }, 20);
        return () => {
            clearInterval(interval);
        }
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCenter(center => ({x: center.x + 2, y: center.y}));
        }, 30);
        return () => {
            clearInterval(interval);
        }
    }, []);
    return <>
        <Transform transform={{position: {x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius}}}/>
        <Transform transform={{position: center}}/>
    </>
}
