import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, Menu, X, User, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/logo.png';

const Header = () => {
    const { cart, userRole, setUserRole, userProfile, updateUserProfile, handleSignOut, products } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 140);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter suggestions when query changes
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const matches = products.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5); // Limit to 5
            setSuggestions(matches);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, products]);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        setShowMobileSearch(false);
        navigate(`/?search=${searchQuery}`);
    };

    const handleSuggestionClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchQuery('');
        setShowSuggestions(false);
        setShowMobileSearch(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Helper for Suggestions List
    const SuggestionsList = ({ mobile }) => (
        <div className={`absolute top-full bg-white shadow-2xl rounded-sm border border-gray-100 overflow-hidden z-[60] mt-1 animate-fadeIn ${mobile ? 'left-0 w-full' : 'left-1/2 -translate-x-1/2 w-[350px] md:w-[450px]'}`}>
            <div className="px-5 py-3 text-[11px] font-bold text-gray-400 tracking-widest border-b border-gray-100 bg-gray-50/50">
                PRODUCTS
            </div>
            {suggestions.map(product => (
                <div
                    key={product.id}
                    onClick={() => handleSuggestionClick(product.id)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors group"
                >
                    <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-sm overflow-hidden flex-shrink-0">
                        <img
                            src={product.images ? product.images[0] : product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-medium text-gray-900 leading-snug">{product.name}</span>
                        <span className="text-[13px] text-gray-500">₹{product.discountPrice || product.price}</span>
                    </div>
                </div>
            ))}
            <div
                onClick={(e) => handleSearch(e)}
                className="p-3 text-center text-[12px] font-bold text-black border-t border-gray-100 uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-all"
            >
                View all {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length} results
            </div>
        </div>
    );

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
        <header className="flex flex-col bg-white font-sans relative">
            {/* Top Bar: Logo & Icons */}
            <div className="flex items-center justify-between px-6 py-4 bg-white relative z-50">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center">
                    <img src={logo} alt="Craft Island" className="h-[100px] w-auto object-contain" />
                </Link>

                {/* Right Icons */}
                <div className="flex items-center gap-6 text-gray-700">
                    {/* Mobile Icons */}
                    <div className="lg:hidden flex items-center gap-5 text-black">
                        <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
                            <Search size={24} />
                        </button>
                        <Link to="/cart" className="relative">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cart.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu size={28} />
                        </button>
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden lg:flex items-center gap-5">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-8 pr-2 py-1 text-sm border-b border-gray-300 focus:border-pink-500 outline-none w-40 focus:w-60 transition-all duration-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                            />
                            <Search size={20} className="absolute left-0 top-1.5 cursor-pointer hover:text-pink-500" onClick={handleSearch} />

                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && <SuggestionsList />}
                        </div>

                        <Link to={userProfile.name ? "/profile" : "/login"} title="Profile">
                            <User size={22} className="hover:text-pink-500 transition-colors" />
                        </Link>

                        <Link to="/wishlist" title="Wishlist">
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-pink-500 transition-colors"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </div>
                        </Link>

                        <Link to="/cart" title="Cart" className="relative hover:text-pink-500 transition-colors">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cart.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar Dropdown */}
            {showMobileSearch && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white px-6 py-4 border-t border-gray-100 z-40 shadow-xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:border-black outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            autoFocus
                        />
                        <Search size={18} className="absolute left-3.5 top-2.5 text-gray-400" />
                        {showSuggestions && suggestions.length > 0 && <SuggestionsList mobile={true} />}
                    </div>
                </div>
            )}

            {/* 1. Static Navigation Bar (Always displayed in flow) */}
            <div className={`hidden lg:flex items-center justify-center relative mx-auto w-[98%] max-w-[1700px] rounded-2xl bg-black py-4 shadow-lg mb-8 z-40 transition-all duration-300 ${isSticky ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                <nav className="flex items-center gap-8 text-sm font-bold tracking-wide uppercase">
                    <Link to="/" className="hover:text-pink-400 transition-colors text-white">HOME</Link>

                    <div className="group relative cursor-pointer">
                        <span className="flex items-center gap-1 hover:text-pink-400 transition-colors text-white">PRODUCTS <span className="text-[10px]">▼</span></span>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white text-black shadow-lg rounded-sm py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                            <Link to="/collections/Scented%20Candles" className="block px-4 py-2 hover:bg-gray-100 text-xs">SCENTED CANDLES</Link>
                            <Link to="/collections/Concrete%20Art%20Homedecor" className="block px-4 py-2 hover:bg-gray-100 text-xs">CONCRETE ART HOMEDECOR</Link>
                            <Link to="/collections/Resin%20Art" className="block px-4 py-2 hover:bg-gray-100 text-xs">RESIN ART</Link>
                            <Link to="/collections/Personalized%20Greeting%20Cards" className="block px-4 py-2 hover:bg-gray-100 text-xs">PERSONALIZED GREETING CARDS</Link>
                            <Link to="/collections/Personalized%20Albums" className="block px-4 py-2 hover:bg-gray-100 text-xs">PERSONALIZED ALBUMS</Link>
                        </div>
                    </div>

                    <Link to="/?sort=newest" className="hover:text-pink-400 transition-colors text-white">NEW ARRIVALS</Link>
                    <Link to="/about" className="hover:text-pink-400 transition-colors text-white">ABOUT US</Link>
                </nav>
            </div>

            {/* 2. Sticky Floating Header (Slides down when scrolled) */}
            <div className={`hidden lg:flex items-center fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[1400px] rounded-full bg-black/70 backdrop-blur-md py-3 shadow-2xl border border-white/10 z-50 transition-all duration-500 ease-in-out ${isSticky ? 'top-4 scale-100 opacity-100 visible' : 'top-4 scale-95 opacity-0 invisible'}`}>
                <div className="w-full px-8 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-serif font-bold text-white tracking-widest whitespace-nowrap hover:text-pink-200 transition-colors">
                        CRAFT ISLAND
                    </Link>

                    {/* Nav Links (Duplicate) */}
                    <nav className="flex items-center gap-8 text-sm font-bold tracking-wide uppercase mx-auto">
                        <Link to="/" className="hover:text-pink-400 transition-colors text-white">HOME</Link>

                        <div className="group relative cursor-pointer">
                            <span className="flex items-center gap-1 hover:text-pink-400 transition-colors text-white">PRODUCTS <span className="text-[10px]">▼</span></span>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white text-black shadow-lg rounded-sm py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                                <Link to="/collections/Scented%20Candles" className="block px-4 py-2 hover:bg-gray-100 text-xs">SCENTED CANDLES</Link>
                                <Link to="/collections/Concrete%20Art%20Homedecor" className="block px-4 py-2 hover:bg-gray-100 text-xs">CONCRETE ART HOMEDECOR</Link>
                                <Link to="/collections/Resin%20Art" className="block px-4 py-2 hover:bg-gray-100 text-xs">RESIN ART</Link>
                                <Link to="/collections/Personalized%20Greeting%20Cards" className="block px-4 py-2 hover:bg-gray-100 text-xs">PERSONALIZED GREETING CARDS</Link>
                                <Link to="/collections/Personalized%20Albums" className="block px-4 py-2 hover:bg-gray-100 text-xs">PERSONALIZED ALBUMS</Link>
                            </div>
                        </div>

                        <Link to="/?sort=newest" className="hover:text-pink-400 transition-colors text-white">NEW ARRIVALS</Link>
                        <Link to="/about" className="hover:text-pink-400 transition-colors text-white">ABOUT US</Link>
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-8 pr-2 py-1 text-sm bg-transparent border-b border-gray-500 text-white placeholder-gray-400 focus:border-white outline-none w-40 focus:w-60 transition-all duration-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                            />
                            <Search size={20} className="absolute left-0 top-1.5 cursor-pointer text-white hover:text-pink-400" onClick={handleSearch} />

                            {/* Suggestions Dropdown (Sticky) */}
                            {showSuggestions && suggestions.length > 0 && <SuggestionsList />}
                        </div>

                        <Link to={userProfile.name ? "/profile" : "/login"} title="Profile">
                            <User size={22} className="text-white hover:text-pink-400 transition-colors" />
                        </Link>

                        <Link to="/wishlist" title="Wishlist">
                            <div className="relative text-white hover:text-pink-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </div>
                        </Link>

                        <Link to="/cart" title="Cart" className="relative text-white hover:text-pink-400 transition-colors">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cart.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
                    <div className="relative w-[80%] max-w-[300px] bg-white h-full shadow-xl flex flex-col">
                        <div className="p-4 flex justify-between items-center border-b">
                            <span className="font-bold text-lg">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
                        </div>
                        <nav className="flex flex-col p-4 gap-4 text-sm font-semibold uppercase">
                            <Link to="/" onClick={() => setIsMenuOpen(false)}>HOME</Link>
                            <Link to="/products" onClick={() => setIsMenuOpen(false)}>PRODUCTS</Link>
                            <Link to="/?sort=newest" onClick={() => setIsMenuOpen(false)}>NEW ARRIVALS</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link>
                            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>CART ({cart.length})</Link>
                            {userProfile.name ? (
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-pink-600 normal-case">My Profile</Link>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-pink-600 normal-case">Login / Sign Up</Link>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};
export default Header;
