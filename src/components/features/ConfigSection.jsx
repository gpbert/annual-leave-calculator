import React from 'react';

export function ConfigSection({ config, updateConfig }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateConfig({ [name]: parseFloat(value) || 0 });
    };

    return (
        <div className="card mb-8">
            <h2 className="mb-4 text-left">Settings</h2>
            <div className="config-grid">
                <div>
                    <h3 className="text-subtle uppercase mb-2 text-sm">Ferie (Annual Leave)</h3>
                    <div className="flex-col gap-2">
                        <label className="text-xs">Current Balance (Hours)</label>
                        <input
                            type="number"
                            name="currentAnnualBalance"
                            value={config.currentAnnualBalance}
                            onChange={handleChange}
                        />
                        <label className="text-xs mt-2">Monthly Accrual (Hours)</label>
                        <input
                            type="number"
                            name="monthlyAnnualAccrual"
                            value={config.monthlyAnnualAccrual}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-subtle uppercase mb-2 text-sm">Permessi (R.O.L.)</h3>
                    <div className="flex-col gap-2">
                        <label className="text-xs">Current Balance (Hours)</label>
                        <input
                            type="number"
                            name="currentPermessiBalance"
                            value={config.currentPermessiBalance}
                            onChange={handleChange}
                        />
                        <label className="text-xs mt-2">Monthly Accrual (Hours)</label>
                        <input
                            type="number"
                            name="monthlyPermessiAccrual"
                            value={config.monthlyPermessiAccrual}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
