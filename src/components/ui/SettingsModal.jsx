import React from 'react';
import { X, Globe, Languages } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export function SettingsModal({ isOpen, onClose }) {
    const { settings, updateSettings, t, countries } = useSettings();

    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h2>{t('settings')}</h2>
                    <button className="settings-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="settings-content">
                    {/* Language Selection */}
                    <div className="settings-section">
                        <div className="settings-label">
                            <Languages size={18} />
                            <span>{t('language')}</span>
                        </div>
                        <div className="settings-options">
                            <button
                                className={`settings-option ${settings.language === 'en' ? 'active' : ''}`}
                                onClick={() => updateSettings({ language: 'en' })}
                            >
                                🇬🇧 {t('english')}
                            </button>
                            <button
                                className={`settings-option ${settings.language === 'it' ? 'active' : ''}`}
                                onClick={() => updateSettings({ language: 'it' })}
                            >
                                🇮🇹 {t('italian')}
                            </button>
                        </div>
                    </div>

                    {/* Country Selection */}
                    <div className="settings-section">
                        <div className="settings-label">
                            <Globe size={18} />
                            <span>{t('country')}</span>
                        </div>
                        <div className="settings-options country-grid">
                            {countries.map(country => (
                                <button
                                    key={country.code}
                                    className={`settings-option ${settings.country === country.code ? 'active' : ''}`}
                                    onClick={() => updateSettings({ country: country.code })}
                                >
                                    {t(country.nameKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
