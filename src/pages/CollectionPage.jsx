import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/user/ProductCard';
import { ChevronDown, Filter } from 'lucide-react';

const CollectionPage = () => {
    const { category } = useParams();
    const { products } = useApp();
    const [sortBy, setSortBy] = useState('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Placeholder for future filter mobile drawer

    // Decode category from URL (e.g., "Scented%20Candles" -> "Scented Candles")
    const decodedCategory = decodeURIComponent(category || '');

    // Filter Products
    const categoryProducts = useMemo(() => {
        return products.filter(p => p.category === decodedCategory);
    }, [products, decodedCategory]);

    // Sort Products
    const sortedProducts = useMemo(() => {
        let sorted = [...categoryProducts];
        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                break;
            case 'price-high':
                sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
                break;
            case 'newest':
            default:
                // Assuming newer products have higher IDs or were added later. 
                // If there's a createdAt field, use that. For now, reverse generic (assuming newest added last)
                sorted.reverse();
                break;
        }
        return sorted;
    }, [categoryProducts, sortBy]);

    // Scroll to top on category change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [category]);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* 1. Header/Toolbar */}
            <div className="bg-[#fcf8f8] py-8 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-serif text-black mb-2">{decodedCategory}</h1>
                    <div className="text-sm text-gray-500">
                        <Link to="/" className="hover:underline">Home</Link> / {decodedCategory}
                    </div>
                </div>
            </div>

            {/* 2. Controls & Layout */}
            <div className="container mx-auto px-4 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4">

                    {/* Left: Filter Trigger (Visual only for now matching screenshot style) */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black">
                            <span className="text-sm">Filter:</span>
                            <div className="flex items-center gap-1 font-medium">
                                Availability <ChevronDown size={14} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black">
                            <div className="flex items-center gap-1 font-medium">
                                More filters <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Sort & Count */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none outline-none font-medium cursor-pointer"
                            >
                                <option value="newest">Date, new to old</option>
                                <option value="price-low">Price, low to high</option>
                                <option value="price-high">Price, high to low</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-500">
                            {sortedProducts.length} products
                        </div>
                    </div>
                </div>

                {/* 3. Product Grid */}
                {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No products found in this category.</p>
                        <Link to="/" className="text-[var(--amz-orange)] underline mt-4 inline-block">Continue Shopping</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
