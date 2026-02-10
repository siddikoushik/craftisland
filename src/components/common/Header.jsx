import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, Menu, X, User, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = () => {
    const { cart, userRole, setUserRole, userProfile, updateUserProfile, handleSignOut } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchQuery}`);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    if (userRole === 'owner') {
        return (
            <header className="flex items-center justify-center relative z-50 bg-[var(--amz-header-primary)] h-[60px] shadow-sm">
                <Link to="/" className="flex items-center px-2">
                    <span className="text-2xl font-bold tracking-tight text-black">craft<span className="text-[var(--amz-orange)]">island</span></span>
                    <span className="text-xs text-black self-start mt-1 ml-0.5">.in</span>
                </Link>
            </header>
        );
    }

    return (
        <header className="flex flex-col sticky top-0 z-50 shadow-sm backdrop-blur-md bg-[#F4EDEE]/90 border-b border-[#E3D2A3]">
            {/* Top Bar - Minimal: Menu + Search + Cart */}
            <div className="flex items-center justify-between gap-4 px-4 py-2 h-[60px] bg-transparent">

                {/* Menu and Logo Container */}
                <div className="flex items-center gap-0">
                    {/* Hamburger Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="text-black p-1 border border-transparent hover:border-white rounded-sm min-w-[40px]"
                    >
                        <Menu size={30} />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center -mt-1 px-2 border border-transparent hover:border-white rounded-sm">
                        <span className="text-2xl font-bold tracking-tight text-black">craft<span className="text-[var(--amz-orange)]">island</span></span>
                        <span className="text-xs text-black self-start mt-1 ml-0.5">.in</span>
                    </Link>
                </div>

                {/* Search Bar - Center */}
                <form onSubmit={handleSearch} className="flex-1 flex h-10 rounded-lg overflow-hidden focus-within:ring-3 focus-within:ring-[var(--amz-orange)] max-w-3xl">
                    <select className="bg-[#f3f3f3] text-black text-xs px-2 border-r border-[#ddd] outline-none cursor-pointer w-auto max-w-[50px] sm:max-w-fit rounded-l-lg hover:bg-[#e3e3e3]">
                        <option>All</option>
                        <option>Crafts</option>
                        <option>Tools</option>
                        <option>Materials</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search CraftIsland.in"
                        className="flex-1 px-3 text-black outline-none text-[15px] font-medium placeholder:text-gray-500 w-full bg-white border-l border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-[var(--amz-orange)] hover:bg-[var(--amz-orange-hover)] w-[45px] flex items-center justify-center rounded-r-lg transition-colors">
                        <Search className="text-white" size={22} />
                    </button>
                </form>

                {/* Cart Icon */}
                <Link to="/cart" className="flex items-center justify-center min-w-[40px] text-black relative">
                    <ShoppingCart size={30} />
                    <span className="absolute -top-1 -right-1 bg-[var(--amz-orange)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cart.reduce((a, c) => a + c.qty, 0)}
                    </span>
                </Link>
            </div>

            {/* Sidebar / Drawer */}
            {isMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-[90] transition-opacity"
                        onClick={toggleMenu}
                    ></div>

                    {/* Sidebar Content */}
                    <div className="fixed top-0 left-0 h-full min-h-screen w-[80%] max-w-[320px] bg-[#FFFFFF] z-[100] overflow-y-auto transform transition-transform shadow-2xl">
                        {/* Sidebar Header */}
                        <div className="bg-[var(--amz-header-primary)] p-4 flex items-center justify-between text-[var(--amz-text)]">
                            <Link
                                to={userProfile.name ? "/profile" : "/login"}
                                className="flex items-center gap-2 font-bold text-lg"
                                onClick={toggleMenu}
                            >
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-black">{userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User size={18} />}</span>
                                </div>
                                Hello, {userProfile.name || 'Sign in'}
                            </Link>
                            <button onClick={toggleMenu} className="text-black">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Sidebar Items */}
                        <div className="p-4 flex flex-col gap-6 text-black">

                            {/* Location */}
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-lg mb-1">Your Location</h3>
                                <div className="flex items-center gap-2 text-sm text-[#333]">
                                    <MapPin size={18} />
                                    <span>{userProfile.location || 'Update location'}</span>
                                    <span className="text-xs text-gray-500">(Delivering to {userProfile.name || 'User'})</span>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Account & Lists */}
                            <div className="flex flex-col gap-3">
                                <h3 className="font-bold text-lg">Your Account</h3>
                                <Link to="/profile" className="text-sm hover:text-[var(--amz-orange)] hover:underline" onClick={toggleMenu}>Your Profile</Link>
                                <Link to={userRole === 'owner' ? '/owner' : '/orders'} className="text-sm hover:text-[var(--amz-orange)] hover:underline" onClick={toggleMenu}>Your Orders</Link>
                                <Link to="/wishlist" className="text-sm hover:text-[var(--amz-orange)] hover:underline" onClick={toggleMenu}>Your Wish List</Link>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Cart */}
                            <div className="flex flex-col gap-3">
                                <h3 className="font-bold text-lg">Shopping</h3>
                                <Link to="/cart" className="flex items-center gap-3 text-sm hover:text-[var(--amz-orange)] hover:underline font-bold" onClick={toggleMenu}>
                                    <div className="relative">
                                        <ShoppingCart size={24} />
                                        <span className="absolute -top-1 -right-2 bg-[var(--amz-orange)] text-white text-xs rounded-full px-1.5 font-bold">
                                            {cart.reduce((a, c) => a + c.qty, 0)}
                                        </span>
                                    </div>
                                    Go to Cart
                                </Link>
                            </div>

                            <hr className="border-gray-200" />



                        </div>

                        {/* Sign Out Button */}
                        {userProfile.email && (
                            <div className="p-4 border-t border-gray-200 mt-auto">
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        toggleMenu();
                                        navigate('/');
                                    }}
                                    className="flex items-center gap-2 text-black font-medium w-full p-2 hover:bg-gray-100 rounded"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
