import { useState, useEffect } from 'react';
import { addMonths, differenceInMonths, isSameMonth, parseISO, startOfToday, isAfter, isBefore, startOfMonth, isSameDay } from 'date-fns';

function useLocalStorage(key, initialValue) {
    // Get from local storage then parse stored json or return initialValue
    const readValue = () => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState(readValue);

    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    };

    return [storedValue, setValue];
}

const CONFIG_KEY = 'alc_config';
const ENTRIES_KEY = 'alc_entries';

const DEFAULT_CONFIG = {
    currentAnnualBalance: 0, // days or hours
    monthlyAnnualAccrual: 2.33, // standard italian ~28 days/year -> 2.33
    annualUnit: 'days', // 'days' | 'hours'

    currentPermessiBalance: 0, // hours
    monthlyPermessiAccrual: 6, // hours (typical ROL is ~72h/year -> 6h/month)
};

export function useLeaveCalculator() {
    const [config, setConfig] = useLocalStorage(CONFIG_KEY, DEFAULT_CONFIG);
    const [entries, setEntries] = useLocalStorage(ENTRIES_KEY, []);

    // Actions
    const updateConfig = (newConfig) => {
        setConfig({ ...config, ...newConfig });
    };

    const addEntry = (entry) => {
        // entry: { id, date: ISOString, type: 'ferie'|'permessi', amount: number }
        setEntries((prev) => [...prev, { ...entry, id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }]);
    };

    const removeEntry = (id) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    // Calculations
    const getForecast = (targetDate = new Date()) => {
        try {
            const today = startOfToday();

            // 1. Calculate Accrual
            // We accrue on the 15th of each month.
            let accruedFerie = 0;
            let accruedPermessi = 0;

            // Iterate months from current month to target month
            let iter = startOfMonth(today);
            const end = startOfMonth(targetDate);

            // Safety break
            let safety = 0;
            while ((isBefore(iter, end) || isSameMonth(iter, end)) && safety < 120) { // Cap at 10 years
                // Use standard JS getFullYear
                const accrualDate = new Date(iter.getFullYear(), iter.getMonth(), 1);

                // Check if this accrualDate is strictly in the future relative to Today
                // AND within the Target range (<= TargetDate)
                if (isAfter(accrualDate, today) && (isBefore(accrualDate, targetDate) || isSameDay(accrualDate, targetDate))) {
                    accruedFerie += Number(config.monthlyAnnualAccrual);
                    accruedPermessi += Number(config.monthlyPermessiAccrual);
                }

                iter = addMonths(iter, 1);
                safety++;
            }

            // 2. Spending
            const futureEntries = entries.filter(e => {
                const entryDate = parseISO(e.date);
                return isAfter(entryDate, today) && (isBefore(entryDate, targetDate) || isSameDay(entryDate, targetDate));
            });

            const plannedFerie = futureEntries
                .filter(e => e.type === 'ferie')
                .reduce((acc, e) => acc + Number(e.amount), 0);

            const plannedPermessi = futureEntries
                .filter(e => e.type === 'permessi')
                .reduce((acc, e) => acc + Number(e.amount), 0);

            return {
                ferie: (Number(config.currentAnnualBalance) + accruedFerie - plannedFerie).toFixed(2),
                permessi: (Number(config.currentPermessiBalance) + accruedPermessi - plannedPermessi).toFixed(2),
                details: {
                    accruedFerie,
                    plannedFerie,
                    accruedPermessi,
                    plannedPermessi
                }
            };
        } catch (err) {
            console.error("Forecast Error:", err);
            return { ferie: "0.0", permessi: "0.0", details: {} };
        }
    };

    return {
        config,
        entries,
        updateConfig,
        addEntry,
        removeEntry,
        getForecast
    };
}
