import React from 'react';
import { Transform } from './Transform';
import { GameObject } from '../objects';

interface ObjectLayerProps {
    objects: Array<GameObject>;
}

const gameObjectComponents: Record<string, (props: any) => React.ReactElement> = {
    Rectangle: ({ object }) => <div style={{width: object.size.x, height: object.size.y,  border: '1px solid red'}} />,
    Circle: ({ object }) => <div style={{borderRadius: '50%', width: object.size.x, height: object.size.y, border: '1px solid red'}} />,
    Default: () => <div>???</div>,
}

function renderGameObject(object: GameObject) {
    const C = (Object.hasOwn(gameObjectComponents, object.kind)? gameObjectComponents[object.kind] : gameObjectComponents.Default)!;
    return <C object={object}/>;
}

export function ObjectLayer({ objects }: ObjectLayerProps) {
    return <>
        {
            objects.map(object => <Transform key={object.id} object={object}>
                {renderGameObject(object)}
            </Transform>)
        }
    </>
}