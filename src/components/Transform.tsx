import React from 'react';
import { GameObject } from '../objects';

interface TransformProps {
    object: GameObject,
    children: any,
}

export function Transform({ object, children }: TransformProps) {
    const { x, y } = object.position;
    return <div
        style={{position: 'absolute', transform: `translate(${~~x}px, ${~~y}px)`}}
        onClick={e => {
            const handler = object.events.click;
            if (handler) handler.call(object, e)
        }}
    >
        {children}
    </div>
}