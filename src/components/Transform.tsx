export type GameObject = {
    position: {x: number, y: number};
    velocity: {x: number, y: number};
    id: number;
}
interface TransformProps {
    object: GameObject
}

export function Transform({ object }: TransformProps) {
    const { x, y } = object.position;
    return <div style={{width: 10, height: 10, background: 'red', position: 'absolute', transform: `translate(${~~x}px, ${~~y}px)`}}>
    </div>
}