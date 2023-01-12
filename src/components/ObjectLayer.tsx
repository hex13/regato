import React from 'react';
import { Transform, GameObject } from './Transform';

interface ObjectLayerProps {
    objects: Array<GameObject>;
}
export function ObjectLayer({ objects }: ObjectLayerProps) {
    return <>
        {
            objects.map(object => <Transform key={object.id} object={object}/>)
        }
    </>
}