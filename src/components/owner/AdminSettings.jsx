import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, RefreshCw, AlertTriangle, Save } from 'lucide-react';

const AdminSettings = () => {
    const { updateOwnerPassword, factoryReset } = useApp();
    const [newPassword, setNewPassword] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword.length < 4) {
            alert("Password must be at least 4 characters long.");
            return;
        }
        updateOwnerPassword(newPassword);
        setNewPassword('');
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-[#D5D9D9] mb-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#C7511F]">
                <Settings className="text-[#C7511F]" />
                Admin Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Change Password */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        Change Owner Password
                    </h3>
                    <form onSubmit={handlePasswordChange} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
                        />
                        <button
                            type="submit"
                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black transition-colors flex items-center gap-2"
                        >
                            <Save size={16} /> Save
                        </button>
                    </form>
                    <p className="text-xs text-gray-500">
                        Default password is <strong>@craftisland</strong>. Changes are saved locally.
                    </p>
                </div>

                {/* Factory Reset */}
                <div className="space-y-4 border-l pl-0 md:pl-8 border-gray-200">
                    <h3 className="font-bold text-[#f73737] flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Danger Zone
                    </h3>
                    <p className="text-sm text-gray-600">
                        Resetting will delete <strong>ALL</strong> recent orders, user profiles, and clear cart data. Does not delete products.
                    </p>
                    <button
                        onClick={factoryReset}
                        className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-md hover:bg-red-100 transition-colors font-bold flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Factory Reset Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
