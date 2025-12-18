import React from 'react';

// This component is now unused - balances are displayed directly in App.jsx
// Keeping for potential future "edit balance" modal functionality

export function ConfigSection({ config, updateConfig }) {
    const handleTextChange = (e) => {
        const { name, value } = e.target;
        updateConfig({ [name]: value.replace(/,/g, '.') });
    };

    return null; // Not rendered currently
}
