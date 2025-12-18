import React, { useState } from 'react';
import { useLeaveCalculator } from './hooks/useLeaveCalculator';
import { CalendarWidget } from './components/features/CalendarWidget';
import { SettingsModal } from './components/ui/SettingsModal';
import { useSettings } from './hooks/useSettings';
import { format } from 'date-fns';
import { RotateCcw, Settings } from 'lucide-react';

function App() {
  const { config, entries, updateConfig, applyBulkAction, getForecast } = useLeaveCalculator();
  const { t } = useSettings();
  const [selectedDates, setSelectedDates] = useState([]);
  const [hoursInput, setHoursInput] = useState(4);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate stats
  const usedFerie = entries.filter(e => e.type === 'ferie').reduce((acc, e) => acc + Number(e.amount), 0);
  const usedPermessi = entries.filter(e => e.type === 'permessi').reduce((acc, e) => acc + Number(e.amount), 0);
  const upcomingDays = entries.length;

  const handleSelectDates = (dates) => {
    setSelectedDates(dates);
  };

  const handleAction = (action) => {
    if (selectedDates.length === 0) return;
    const amount = action === 'permessi' ? hoursInput : 8;
    applyBulkAction(selectedDates, action, amount);
    setSelectedDates([]);
  };

  // Progress calculation
  const calcProgress = (current, monthly) => {
    const yearly = monthly * 12;
    const percent = (parseFloat(current) / yearly) * 100;
    return Math.min(100, Math.max(5, percent));
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Settings Button */}
        <button
          className="settings-btn"
          onClick={() => setShowSettings(true)}
          title={t('settings')}
        >
          <Settings size={18} />
        </button>

        {/* Balances */}
        <div>
          <div className="section-label">{t('balances')}</div>
          <div className="balances-card">
            {/* Ferie */}
            <div className="balance-item">
              <div className="balance-header">
                <span className="balance-title">{t('annualLeave')} ({t('ferie')})</span>
                <span className="balance-accrual">+{config.monthlyAnnualAccrual}h {t('perMonth')}</span>
              </div>
              <div className="balance-value-row">
                <input
                  type="text"
                  inputMode="decimal"
                  className="balance-input"
                  value={config.currentAnnualBalance}
                  onChange={(e) => updateConfig({ currentAnnualBalance: e.target.value.replace(/,/g, '.') })}
                />
                <span className="balance-unit">h</span>
              </div>
              <div className="balance-subtitle">{t('available')}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill green"
                  style={{ width: `${calcProgress(config.currentAnnualBalance, config.monthlyAnnualAccrual)}%` }}
                />
              </div>
            </div>

            {/* Permessi */}
            <div className="balance-item">
              <div className="balance-header">
                <span className="balance-title">{t('rol')} ({t('permessi')})</span>
                <span className="balance-accrual">+{config.monthlyPermessiAccrual}h {t('perMonth')}</span>
              </div>
              <div className="balance-value-row">
                <input
                  type="text"
                  inputMode="decimal"
                  className="balance-input"
                  value={config.currentPermessiBalance}
                  onChange={(e) => updateConfig({ currentPermessiBalance: e.target.value.replace(/,/g, '.') })}
                />
                <span className="balance-unit">h</span>
              </div>
              <div className="balance-subtitle">{t('available')}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill blue"
                  style={{ width: `${calcProgress(config.currentPermessiBalance, config.monthlyPermessiAccrual)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <div className="section-label">{t('actions')}</div>
          <div className="actions-section">
            <button
              className="action-btn green"
              onClick={() => handleAction('ferie')}
              disabled={selectedDates.length === 0}
            >
              {t('markAsFerie')} <span className="hours">8h</span>
            </button>

            <div className="permessi-row">
              <button
                className="action-btn blue"
                onClick={() => handleAction('permessi')}
                disabled={selectedDates.length === 0}
              >
                {t('markAsPermessi')}
              </button>
              <div className="hours-input-wrapper">
                <input
                  type="number"
                  className="hours-input"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  min="0.5"
                  step="0.5"
                />
                <span className="hours-suffix">h</span>
              </div>
            </div>

            <button
              className="undo-btn"
              onClick={() => handleAction('clear')}
              disabled={selectedDates.length === 0}
            >
              <RotateCcw size={14} /> {t('undo')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <CalendarWidget
          entries={entries}
          selectedDates={selectedDates}
          onSelectDates={handleSelectDates}
          getForecast={getForecast}
          stats={{
            remaining: (parseFloat(config.currentAnnualBalance) / 8).toFixed(1),
            used: (usedFerie / 8).toFixed(1),
            upcoming: upcomingDays
          }}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default App;
