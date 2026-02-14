import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductCard from '../components/user/ProductCard';
import FilterSidebar from '../components/common/FilterSidebar';
import { useApp } from '../context/AppContext';

const UserHome = () => {
    const { products, setUserRole } = useApp();

    useEffect(() => {
        setUserRole('user');
    }, []);
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [filters, setFilters] = useState({
        category: 'All',
        maxPrice: 2000
    });

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // 1. Search Query
            if (initialSearch && !product.name.toLowerCase().includes(initialSearch.toLowerCase())) {
                return false;
            }

            // 2. Category
            if (filters.category !== 'All' && product.category !== filters.category) {
                return false;
            }

            // 3. Price
            if (product.price > filters.maxPrice) {
                return false;
            }

            return true;
        });
    }, [products, filters, initialSearch]);

    const categories = [...new Set(products.map(p => p.category))];

    return (
        <div className="min-h-screen bg-transparent pb-10">

            {/* Hero Section */}
            <div className="relative bg-[#5F4339] text-white overflow-hidden mx-auto w-[98%] max-w-[1700px] rounded-3xl mb-8 shadow-xl">
                <div className="max-w-[1500px] mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between relative z-10">

                    {/* Left Content */}
                    <div className="md:w-1/2 flex flex-col items-start gap-2 animate-fadeIn pl-4 md:pl-10">
                        {/* Brand Logo Area */}
                        <div className="flex flex-col mb-6">
                            <span className="text-3xl md:text-4xl text-pink-300" style={{ fontFamily: "'Dancing Script', cursive" }}>Craft Island</span>
                            <span className="text-[10px] tracking-[0.2em] text-gray-300 uppercase mt-1">HANDCRAFTED WITH LOVE & PASSION</span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-light tracking-wide text-gray-100 mb-2">Newly Launched</h2>

                        <div className="flex flex-col">
                            <h1 className="text-6xl md:text-8xl text-white leading-none mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
                                Scented Candles
                            </h1>
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-[1px] bg-gray-300 w-16 md:w-24"></div>
                                <span className="text-2xl md:text-4xl font-serif tracking-widest uppercase text-white">Collection</span>
                                <div className="h-[1px] bg-gray-300 w-16 md:w-24"></div>
                            </div>
                        </div>

                        <p className="mt-6 text-sm md:text-base tracking-[0.15em] uppercase text-gray-300">LIGHT UP YOUR WORLD!</p>

                        {/* Social Handle */}
                        <div className="mt-8 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-xl md:text-2xl font-medium tracking-wide">@craftisland</span>
                        </div>
                    </div>

                    {/* Right Content - Images/Banner */}
                    <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-end pr-4">
                        {/* Circle "Explore Now" Button */}
                        <div className="absolute top-1/2 -left-10 md:-left-16 z-20 transform -translate-y-1/2">
                            <button className="bg-white text-[#5F4339] w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center shadow-xl font-bold text-xs md:text-sm tracking-widest hover:scale-110 transition-transform duration-300 group ring-4 ring-white/20">
                                <span className="group-hover:-translate-y-1 transition-transform">EXPLORE</span>
                                <span className="group-hover:translate-y-1 transition-transform">NOW</span>
                            </button>
                        </div>

                        {/* Collage of images */}
                        <div className="grid grid-cols-2 gap-6 md:gap-8 transform rotate-6 hover:rotate-0 transition-transform duration-700 ease-out origin-center">
                            <img src="https://via.placeholder.com/220x300/e0f2f1/333?text=Candle+1" alt="Scented Candle 1" className="rounded-lg shadow-2xl transform translate-y-8" />
                            <img src="https://via.placeholder.com/220x300/ffebee/333?text=Candle+2" alt="Scented Candle 2" className="rounded-lg shadow-2xl transform -translate-y-8" />
                            <img src="https://via.placeholder.com/220x300/fff3e0/333?text=Candle+3" alt="Scented Candle 3" className="rounded-lg shadow-2xl transform translate-y-4" />
                            <img src="https://via.placeholder.com/220x300/f3e5f5/333?text=Candle+4" alt="Scented Candle 4" className="rounded-lg shadow-2xl transform -translate-y-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="products" className={`max-w-[1500px] mx-auto px-4 ${!initialSearch ? 'relative z-10 pt-6' : 'mt-8'} `}>

                {/* Main Content */}
                <div className="w-full">

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-md shadow-sm border border-[#D5D9D9]">
                            <h3 className="text-xl font-bold text-black mb-2">No matches found</h3>
                            <p className="text-[#565959]">Try adjusting your filters or search query.</p>
                            <button
                                onClick={() => setFilters({ category: 'All', maxPrice: 2000 })}
                                className="mt-4 text-[var(--amz-blue)] hover:text-[#C7511F] hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserHome;
