import React, { useEffect, useState } from 'react';

export const NumberTicker = ({ value, duration = 500, decimals = 2 }) => {
    const [displayValue, setDisplayValue] = useState(parseFloat(value));

    useEffect(() => {
        const target = parseFloat(value);
        const start = displayValue;
        const change = target - start;

        // If change is tiny, just set it
        if (Math.abs(change) < 0.01) {
            setDisplayValue(target);
            return;
        }

        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuart)
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = start + (change * ease);
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(target);
            }
        };

        requestAnimationFrame(animate);

    }, [value, duration]); // Intentionally omitting displayValue from deps to avoid re-triggering mid-animation weirdly

    return <>{displayValue.toFixed(decimals)}</>;
};
