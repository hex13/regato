import React from 'react';
import { Transform } from './Transform';
import { GameObject } from '../objects';
import { useInterval } from './helpers';
import { ObjectLayer } from './ObjectLayer';
import { CommandEditor } from './CommandEditor';
import { runCommands, parseCommands } from '../commands';
import { Dispatcher } from './Dispatcher';

const GRAVITATION = 0.01;
const GROUND_Y = 600;

const initialObjects: Array<GameObject> = [
    {kind: 'Rectangle', id: 1, position: {x: 100, y: 200}, velocity: {x: 0, y: 0}, size: {x: 60, y: 60}, events: {
        click(e: any) {
            if (this.eventCodes.click) runCommands(this, parseCommands(this.eventCodes.click))
        }
    }, eventCodes: {
        click: 'setPosition 300 300',
    }},
    {kind: 'Rectangle', id: 2, position: {x: 200, y: 300}, velocity: {x: 0, y: 0}, size: {x: 60, y: 60}, events: {
        click() {
            this.position.x = 350;
        }
    }, eventCodes: {}},
    {kind: 'Circle', id: 3, position: {x: 200, y: 300}, velocity: {x: -0.5, y: -0.5}, size: {x: 60, y: 60}, events: {}, eventCodes: {}},
    {kind: 'Rectangle', static: true, id: 4, position: {x: 0, y: GROUND_Y}, size: {x: 600, y: 3}, velocity: {x: 0, y: 0}, events: {
    }, eventCodes: {}},
];

function dispatch(e: any, object: GameObject ) {
    console.log(`event ${e.type}@${object.kind}#${object.id}`);
    const handler = object.events.click;
    if (handler) handler.call(object, e)
}

export function Content() {
    const [objects, setObjects] = React.useState(initialObjects);
    const move = (a) => {
        setObjects(objects => {
            const v = objects[0]!.velocity;
            let multiplier = 1;
            if (Math.sign(a.x) != Math.sign(v.x)) {
                multiplier = 0.3;
            }
            return [{...objects[0]!, velocity: {x: v.x * multiplier + a.x, y: v.y * multiplier + a.y }}, ...objects.slice(1)]
        });
    }
    React.useEffect(() => {
        const h = e => {
            if (e.code == 'ArrowLeft') {
                move({x: -0.3, y: 0});
            } else if (e.code == 'ArrowRight') {
                move({x: 0.3, y: 0});
            } else  if (e.code == 'ArrowUp') {
                    move({x: 0, y: -3});
            }
        }
        document.addEventListener('keydown', h);
        return () => {
            document.removeEventListener('keydown', h);
        }
    }, [objects]);
    useInterval(() => {
        setObjects(objects => objects.map(o => {
            let velocity: {x: number, y: number};
            let onGround = o.position.y + o.size.y >= GROUND_Y;
            if (!o.static && !onGround) {
                velocity = {x: o.velocity.x, y: o.velocity.y += GRAVITATION};
            } else {
                velocity = onGround? {x: o.velocity.x, y: 0} : o.velocity;

            }
            return {...o, position: {x: o.position.x + o.velocity.x, y: o.position.y + o.velocity.y }, velocity}
        }));
    }, 16);

    return <>
        <Dispatcher.Provider value={dispatch}>
            <ObjectLayer objects={objects}/>
            <CommandEditor object={objects[0] as GameObject}/>
        </Dispatcher.Provider>
    </>
}
