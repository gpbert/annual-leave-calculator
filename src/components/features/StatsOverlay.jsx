import React from 'react';
import { format } from 'date-fns';

export function StatsOverlay({ forecast, targetDate }) {
    // Simplification for vanilla css: static overlay at bottom
    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(20,20,20,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid #333', padding: '16px' }}>
            <div className="container flex-row justify-center gap-md items-center">
                <div style={{ padding: '0 16px', textAlign: 'center' }}>
                    <span className="text-xs text-subtle uppercase block mb-1">
                        Balance on {targetDate ? format(targetDate, 'dd MMM yyyy') : 'Year End'}
                    </span>
                </div>
                <div style={{ width: '1px', background: '#333' }}></div>
                <div style={{ padding: '0 16px', textAlign: 'center' }}>
                    <span className="text-xs text-subtle uppercase block">Projected Ferie</span>
                    <span className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>
                        {forecast.ferie} <span className="text-xs font-normal text-subtle">h</span>
                        <span className="text-xs font-normal text-subtle ml-1">({(forecast.ferie / 8).toFixed(1)}d)</span>
                    </span>
                </div>
                <div style={{ width: '1px', background: '#333' }}></div>
                <div style={{ padding: '0 16px', textAlign: 'center' }}>
                    <span className="text-xs text-subtle uppercase block">Projected Permessi</span>
                    <span className="text-lg font-bold" style={{ color: 'var(--accent-yellow)' }}>
                        {forecast.permessi} <span className="text-xs font-normal text-subtle">h</span>
                        <span className="text-xs font-normal text-subtle ml-1">({(forecast.permessi / 8).toFixed(1)}d)</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
