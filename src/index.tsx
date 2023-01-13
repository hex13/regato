import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { Content } from './components/Content';


const container = document.getElementById('app') as HTMLElement;

const root = ReactDOM.createRoot(container);
root.render(<App build={1}>
    <Content />
</App>);
