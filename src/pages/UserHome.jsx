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

            <div id="products" className={`max-w-[1500px] mx-auto px-4 flex gap-6 ${!initialSearch ? 'relative z-10 pt-6' : 'mt-8'} `}>
                {/* Sidebar - Hidden on small screens */}
                <div className="hidden lg:block w-[220px] shrink-0">
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        categories={categories}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1">

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
