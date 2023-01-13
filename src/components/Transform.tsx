import React from 'react';
import { GameObject } from '../objects';

interface TransformProps {
    object: GameObject
}

export function Transform({ object }: TransformProps) {
    const { x, y } = object.position;
    return <div
        style={{width: 60, height: 60, background: 'red', position: 'absolute', transform: `translate(${~~x}px, ${~~y}px)`}}
        onClick={e => {
            const handler = object.events.click;
            if (handler) handler(e, object)
        }}
    >
    </div>
}