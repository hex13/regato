import React from 'react';
import { GameObject } from '../objects';

export function CommandEditor({ object } : { object: GameObject }) {
    const [code, setCode] = React.useState(object.eventCodes.click);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);
        object.eventCodes.click = e.target.value;
    };
    return <textarea onChange={handleChange} value={code}/>
}