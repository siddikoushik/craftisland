import { Link } from 'react-router-dom';
import { ShoppingBag, User, Flame, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
    const { userRole, setUserRole, cart } = useApp();

    const toggleRole = () => {
        setUserRole(prev => prev === 'user' ? 'owner' : 'user');
    };

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold gradient-text">
                <Flame className="text-pink-500" />
                CraftIsland
            </Link>

            <div className="flex items-center gap-6">
                {/* Role Toggler for Demo */}
                <button
                    onClick={toggleRole}
                    className="text-xs px-2 py-1 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-gray-400"
                >
                    View as: <span className="text-white font-bold uppercase">{userRole}</span>
                </button>

                {userRole === 'user' ? (
                    <>
                        <Link to="/cart" className="relative hover:text-pink-400 transition-colors">
                            <ShoppingBag />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] grid place-items-center w-5 h-5 rounded-full font-bold">
                                    {cart.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>
                        <Link to="/profile" className="hover:text-purple-400 transition-colors">
                            <User />
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-purple-300">Owner Panel</span>
                        <Link to="/" onClick={() => setUserRole('user')} title="Logout">
                            <LogOut size={20} className="hover:text-red-400" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
