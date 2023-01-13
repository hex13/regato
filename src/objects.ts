export type GameObject = {
    position: {x: number, y: number};
    velocity: {x: number, y: number};
    events: Record<string, (e: any, self: GameObject) => void>;
    id: number;
}
