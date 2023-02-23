export type GameObjectKind = string;
export type GameObject = {
    kind: GameObjectKind,
    position: {x: number, y: number};
    velocity: {x: number, y: number};
    events: Record<string, (e: any, self: GameObject) => void>;
    eventCodes: Record<string, string>;
    id: number;
}
