import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, MapPin, Phone, LogOut } from 'lucide-react';

const UserProfile = () => {
    const { userProfile, updateUserProfile, authLoading, handleSignOut } = useApp();
    const navigate = useNavigate();

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white font-bold">Loading Profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 max-w-lg">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Your Profile</h1>

            <div className="glass p-8 rounded-2xl space-y-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl text-white font-bold mb-4">
                        {userProfile.name ? userProfile.name[0].toUpperCase() : <User />}
                    </div>
                    <p className="text-slate-400">Manage your shipping details</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
                        <div className="relative">
                            <User size={18} className="absolute top-3 left-3 text-slate-500" />
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:outline-none focus:border-pink-500"
                                value={userProfile.name}
                                onChange={e => updateUserProfile({ name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Phone Number</label>
                        <div className="relative">
                            <Phone size={18} className="absolute top-3 left-3 text-slate-500" />
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:outline-none focus:border-pink-500"
                                value={userProfile.phone}
                                onChange={e => updateUserProfile({ phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Pincode</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute top-3 left-3 text-slate-500" />
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:outline-none focus:border-pink-500"
                                value={userProfile.location}
                                onChange={e => updateUserProfile({ location: e.target.value })}
                                placeholder="Enter 6-digit Pincode"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Home Address</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute top-3 left-3 text-slate-500" />
                            <textarea
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:outline-none focus:border-pink-500"
                                value={userProfile.homeAddress || ''}
                                onChange={e => updateUserProfile({ homeAddress: e.target.value })}
                                placeholder="Enter your full home address"
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (!userProfile.name || !userProfile.location || !userProfile.phone || !userProfile.homeAddress) {
                            alert("All fields including Home Address are mandatory.");
                            return;
                        }
                        // Save is handled via onChange, so we just navigate
                        navigate('/');
                    }}
                    className="w-full btn-primary mt-4"
                >
                    Save Changes
                </button>

                <button
                    onClick={() => {
                        handleSignOut();
                        navigate('/');
                    }}
                    className="w-full btn-outline mt-2 flex items-center justify-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>



            </div>
        </div>
    );
};

export default UserProfile;
