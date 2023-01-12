import React from 'react';

interface AppProps {
    build: number
    children: any
}

export function App({ build, children }: AppProps) {
    return <div>
        <h1>Hello World { build } </h1>
        { children }
    </div>
}