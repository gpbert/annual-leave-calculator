import React, { useState } from 'react';
import { useLeaveCalculator } from './hooks/useLeaveCalculator';
import { ConfigSection } from './components/features/ConfigSection';
import { CalendarWidget } from './components/features/CalendarWidget';
import { format, isSameDay, parseISO } from 'date-fns';
import { X } from 'lucide-react';

function App() {
  const { config, entries, updateConfig, addEntry, removeEntry, getForecast } = useLeaveCalculator();
  const [selectedDates, setSelectedDates] = useState([]); // Array of ISO strings

  // Forecast target: Last selected date or End of Year
  const lastSelected = selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;
  const forecastTarget = lastSelected ? parseISO(lastSelected) : new Date(new Date().getFullYear(), 11, 31);
  const forecast = getForecast(forecastTarget);

  const handleSelectDates = (dates) => {
    // dates is array of ISO strings from CalendarWidget
    setSelectedDates(dates);
  };

  // Action Handler
  const handleAction = (action) => { // 'ferie', 'permessi', 'clear'
    if (selectedDates.length === 0) return;

    if (action === 'clear') {
      selectedDates.forEach(dateStr => {
        const existing = entries.find(e => isSameDay(parseISO(e.date), parseISO(dateStr)));
        if (existing) removeEntry(existing.id);
      });
      // Keep selection? Yes.
      return;
    }

    // Add entries
    selectedDates.forEach(dateStr => {
      // Remove existing first to avoid dupes/overlaps
      const existing = entries.find(e => isSameDay(parseISO(e.date), parseISO(dateStr)));
      if (existing) removeEntry(existing.id);

      addEntry({
        date: dateStr,
        type: action,
        amount: 8 // Default 8h for now
      });
    });

    // Clear selection so user sees the new state color immediately
    setSelectedDates([]);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <header>
          <h1>Leave Calc</h1>
          <p>Plan your year.</p>
        </header>

        <div className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Action Panel - Only visible when days are selected */}
          {selectedDates.length > 0 && (
            <div className="group-box animate-in fade-in slide-in-from-left-4">
              <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>
                {selectedDates.length} Day{selectedDates.length > 1 ? 's' : ''} Selected
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => handleAction('ferie')}
                  style={{ backgroundColor: 'rgba(48, 209, 88, 0.15)', color: 'var(--accent-green)' }}
                >
                  Mark as Ferie
                </button>

                <button
                  onClick={() => handleAction('permessi')}
                  style={{ backgroundColor: 'rgba(255, 214, 10, 0.15)', color: 'var(--accent-yellow)' }}
                >
                  Mark as Permessi
                </button>

                <button
                  onClick={() => handleAction('clear')}
                  className="destructive"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          <ConfigSection config={config} updateConfig={updateConfig} />
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--separator-non-opaque)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="label">Projected Ferie</span>
              <span className="value" style={{ color: 'var(--accent-green)' }}>{forecast.ferie}h <span style={{ opacity: 0.5 }}>({(forecast.ferie / 8).toFixed(1)}d)</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="label">Projected Permessi</span>
              <span className="value" style={{ color: 'var(--accent-yellow)' }}>{forecast.permessi}h <span style={{ opacity: 0.5 }}>({(forecast.permessi / 8).toFixed(1)}d)</span></span>
            </div>
            <div style={{ fontSize: '11px', textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '8px' }}>
              Balance on {format(forecastTarget, 'd MMM yyyy')}
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="calendar-card">
          <CalendarWidget
            entries={entries}
            selectedDates={selectedDates}
            onSelectDates={handleSelectDates}
            onAction={handleAction}
          />
        </div>
      </main>
    </div>
  );
}


export default App;
