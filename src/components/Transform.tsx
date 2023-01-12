interface TransformProps {
    transform: any
}

export function Transform({ transform }: TransformProps) {
    const { x, y } = transform.position;
    return <div style={{width: 10, height: 10, background: 'red', position: 'absolute', transform: `translate(${~~x}px, ${~~y}px)`}}>
    </div>
}