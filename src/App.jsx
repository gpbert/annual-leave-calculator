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
          <h1 className="text-2xl font-bold mb-1">Leave Calc</h1>
          <p className="text-subtle text-sm">Plan your year.</p>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Action Panel - Only visible when days are selected */}
          {selectedDates.length > 0 && (
            <div className="mb-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700 animate-in fade-in slide-in-from-left-4">
              <h3 className="text-sm font-bold text-white mb-3">
                {selectedDates.length} Day{selectedDates.length > 1 ? 's' : ''} Selected
              </h3>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAction('ferie')}
                  className="w-full bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-800/50 hover:border-green-700 p-2 rounded flex items-center justify-center gap-2 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Mark as Ferie
                </button>

                <button
                  onClick={() => handleAction('permessi')}
                  className="w-full bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 border border-yellow-800/50 hover:border-yellow-700 p-2 rounded flex items-center justify-center gap-2 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Mark as Permessi
                </button>

                <button
                  onClick={() => handleAction('clear')}
                  className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800/50 hover:border-red-700 p-2 rounded flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <X size={14} />
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          <ConfigSection config={config} updateConfig={updateConfig} />
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800">
          <div className="flex-col gap-2">
            <div className="flex-row justify-between">
              <span className="text-subtle text-xs uppercase">Projected Ferie</span>
              <span className="font-bold text-green-500">{forecast.ferie}h <span className="text-xs text-subtle">({(forecast.ferie / 8).toFixed(1)}d)</span></span>
            </div>
            <div className="flex-row justify-between">
              <span className="text-subtle text-xs uppercase">Projected Permessi</span>
              <span className="font-bold text-yellow-500">{forecast.permessi}h <span className="text-xs text-subtle">({(forecast.permessi / 8).toFixed(1)}d)</span></span>
            </div>
            <div className="text-xs text-center text-subtle mt-2">
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
