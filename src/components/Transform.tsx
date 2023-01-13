export type GameObject = {
    position: {x: number, y: number};
    velocity: {x: number, y: number};
    events: any;
    id: number;
}
interface TransformProps {
    object: GameObject
}

export function Transform({ object }: TransformProps) {
    const { x, y } = object.position;
    return <div
        style={{width: 60, height: 60, background: 'red', position: 'absolute', transform: `translate(${~~x}px, ${~~y}px)`}}
        onClick={object.events.click}
    >
    </div>
}