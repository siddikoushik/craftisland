import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock } from 'lucide-react';

const OwnerLogin = () => {
    const [password, setPassword] = useState('');
    const { setUserRole, verifyOwnerPassword } = useApp();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (verifyOwnerPassword(password)) {
            setUserRole('owner');
            navigate('/owner');
        } else {
            alert('Incorrect Owner Password');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--amz-bg)] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-lg border border-[var(--amz-border)] p-8 shadow-sm">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-[var(--amz-orange)] rounded-full flex items-center justify-center text-white">
                        <Lock size={24} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-6 text-center text-[var(--text-heading)]">Owner Access</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-[var(--text-body)]">Password</label>
                        <input
                            type="password"
                            placeholder="Enter owner password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md outline-none focus:border-[var(--amz-orange)] transition-colors"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Access Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-sm text-gray-500 hover:text-black mt-2"
                    >
                        Return to Store
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OwnerLogin;
