import React, {useContext} from 'react';
import { GameObject } from '../objects';
import { Dispatcher } from './Dispatcher';

interface TransformProps {
    object: GameObject,
    children: any,
}

export function Transform({ object, children }: TransformProps) {
    const { x, y } = object.position;
    const dispatch = useContext(Dispatcher);
    const handleEvent = (e: any) => {
        dispatch(e, object);
    };
    return <div
        style={{position: 'absolute', transform: `translate(${~~x}px, ${~~y}px)`}}
        onClick={handleEvent}
    >
        {children}
    </div>
}