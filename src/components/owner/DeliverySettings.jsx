import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Plus, Trash2 } from 'lucide-react';

const DeliverySettings = () => {
    const { serviceablePincodes, addPincode, removePincode } = useApp();
    const [newPincode, setNewPincode] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newPincode.trim().length === 6 && !isNaN(newPincode)) {
            addPincode(newPincode.trim());
            setNewPincode('');
        } else {
            alert('Please enter a valid 6-digit pincode.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--amz-border)]">
            <h2 className="text-xl font-bold text-[var(--text-heading)] mb-4 flex items-center gap-2">
                <MapPin className="text-[var(--amz-orange)]" />
                Delivery Range Settings
            </h2>
            <p className="text-sm text-[var(--text-body)] mb-4">
                Restrict orders to specific locations. Only users with these Pincodes in their address can place orders.
            </p>

            {/* Input Form */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Enter 6-digit Pincode"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="flex-1 border p-2 rounded-md outline-none focus:border-[var(--amz-orange)]"
                    maxLength={6}
                />
                <button
                    type="submit"
                    className="bg-[var(--amz-blue)] text-white px-4 py-2 rounded-md hover:bg-[var(--btn-primary-hover)] flex items-center gap-1 font-bold"
                >
                    <Plus size={18} /> Add
                </button>
            </form>

            {/* List */}
            <div className="bg-[var(--bg-section)] rounded-md p-4 max-h-[300px] overflow-y-auto">
                <h3 className="font-bold text-sm mb-2 text-[var(--text-heading)]">Allowed Pincodes ({serviceablePincodes.length})</h3>
                {serviceablePincodes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No restrictions set (or all blocked? Logic implies must be in list).</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {serviceablePincodes.map(code => (
                            <div key={code} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-[var(--amz-border)]">
                                <span className="font-mono text-[var(--text-heading)]">{code}</span>
                                <button
                                    onClick={() => removePincode(code)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Remove Pincode"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliverySettings;
