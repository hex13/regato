import React from 'react';

export function useInterval(handler: Function, delay: number) {
    React.useEffect(() => {
        const interval = setInterval(handler, delay);
        return () => {
             clearInterval(interval);
        }
    }, []);
}