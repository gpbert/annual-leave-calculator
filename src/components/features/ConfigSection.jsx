import React from 'react';

export function ConfigSection({ config, updateConfig }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateConfig({ [name]: parseFloat(value) || 0 });
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold px-1">Settings</h2>

            <div className="group-box">
                <h3 className="text-md font-medium mb-4 text-white">Annual Leave (Ferie)</h3>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="label">Current Balance (Hours)</label>
                        <input
                            type="number"
                            name="currentAnnualBalance"
                            value={config.currentAnnualBalance}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="label">Monthly Accrual (Hours)</label>
                        <input
                            type="number"
                            name="monthlyAnnualAccrual"
                            value={config.monthlyAnnualAccrual}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            <div className="group-box">
                <h3 className="text-md font-medium mb-4 text-white">R.O.L. (Permessi)</h3>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="label">Current Balance (Hours)</label>
                        <input
                            type="number"
                            name="currentPermessiBalance"
                            value={config.currentPermessiBalance}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="label">Monthly Accrual (Hours)</label>
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
