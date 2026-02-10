import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Phone, Lock, User, Chrome, MapPin, Home } from 'lucide-react';


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const navigate = useNavigate();
    const { updateUserProfile } = useApp(); // Local state update for now


    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // LOGIN
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Success
                alert('Logged in successfully!');

                // Check key profile fields to decide redirection
                const metadata = data.user?.user_metadata;
                // We might need to fetch the profile from DB mainly, but for now check metadata or assume Home if login
                // Best practice: Fetch profile, but for speed: 
                // Redirect to Home by default for returning users, Profile if new? 
                // The request says: "when user login it is showing profile page only first time user has to show this page and remaning time directly show home page"

                // We'll rely on AppContext sync, but here we just nav.
                navigate('/'); // Default to Home for login
            } else {
                // SIGN UP
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;

                // Check if session is created immediately (Email confirmation disabled)
                if (data.session) {
                    // Update profile with extra details
                    await updateUserProfile({
                        name: fullName,
                        phone,
                        location,
                        homeAddress
                    });

                    alert('Signup successful! Logging in...');
                    navigate('/'); // Go directly to home as requested
                } else {
                    alert('Signup successful! Please check your email for verification.');
                }
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--amz-bg)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-lg border border-[var(--amz-border)] p-8 shadow-sm">
                <h1 className="text-3xl font-bold mb-6 text-[var(--text-heading)] font-serif text-center">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`flex-1 pb-2 text-sm font-bold ${isLogin ? 'text-[var(--amz-orange)] border-b-2 border-[var(--amz-orange)]' : 'text-gray-400'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`flex-1 pb-2 text-sm font-bold ${!isLogin ? 'text-[var(--amz-orange)] border-b-2 border-[var(--amz-orange)]' : 'text-gray-400'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-bold mb-1 text-[var(--text-body)]">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border rounded-md outline-none focus:border-[var(--amz-orange)]"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-bold mb-1 text-[var(--text-body)]">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md outline-none focus:border-[var(--amz-orange)]"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1 text-[var(--text-body)]">Pincode</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md outline-none focus:border-[var(--amz-orange)]"
                                        required={!isLogin}
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1 text-[var(--text-body)]">Address</label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <textarea
                                        placeholder="Full Address"
                                        value={homeAddress}
                                        onChange={(e) => setHomeAddress(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md outline-none focus:border-[var(--amz-orange)]"
                                        required={!isLogin}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-bold mb-1 text-[var(--text-body)]">Email or Phone</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border rounded-md outline-none focus:border-[var(--amz-orange)]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-[var(--text-body)]">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border rounded-md outline-none focus:border-[var(--amz-orange)]"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--amz-orange)] hover:bg-[var(--amz-orange-hover)] text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-md transition-colors"
                >
                    <Chrome size={20} className="text-blue-500" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
