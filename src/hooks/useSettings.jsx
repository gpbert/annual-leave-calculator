import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, countries } from '../lib/translations';

const SETTINGS_KEY = 'leave-calc-settings';

const defaultSettings = {
    language: 'it', // Default to Italian
    country: 'IT',  // Default to Italy
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            return stored ? JSON.parse(stored) : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const t = (key) => {
        return translations[settings.language]?.[key] || translations.en[key] || key;
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            t,
            countries,
            translations
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
