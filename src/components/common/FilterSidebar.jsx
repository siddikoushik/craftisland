import { Star } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, categories, maxPrice = 2000 }) => {
    return (
        <div className="w-full bg-[var(--amz-header-primary)] p-4 border-r border-[#E3D2A3] h-full">

            {/* Price (Amazon puts price early usually, but we keep structure) - actually Amazon is Category -> Price -> Reviews */}
            {/* Categories */}
            <div className="mb-4">
                <h3 className="font-bold text-black mb-2 text-sm">Category</h3>
                <ul className="space-y-1 text-[14px]">
                    <li
                        className={`cursor-pointer hover:text-[#C7511F] hover:underline ${filters.category === 'All' ? 'font-bold text-[#C7511F]' : 'text-black'}`}
                        onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))}
                    >
                        All Candles
                    </li>
                    {categories.map(cat => (
                        <li
                            key={cat}
                            className={`cursor-pointer hover:text-[#C7511F] hover:underline ${filters.category === cat ? 'font-bold text-[#C7511F]' : 'text-black'}`}
                            onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>



            {/* Price Range */}
            <div className="mb-4">
                <h3 className="font-bold text-black mb-2 text-sm">Price</h3>
                <input
                    type="range"
                    min="0"
                    max="2000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-[#D5D9D9] rounded-lg appearance-none cursor-pointer accent-[var(--amz-orange)]"
                />
                <div className="flex justify-between text-xs text-[#565959] mt-2">
                    <span>₹0</span>
                    <span>₹{filters.maxPrice}+</span>
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => setFilters({ category: 'All', maxPrice: 2000 })}
                className="text-xs text-[var(--amz-blue)] hover:text-[#C7511F] hover:underline"
            >
                Clear Filters
            </button>

        </div>
    );
};

export default FilterSidebar;
