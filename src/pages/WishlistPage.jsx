import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/user/ProductCard';

const WishlistPage = () => {
    const { wishlist } = useApp();

    // Ensure wishlist is an array
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-black">Your Wish List</h1>
                    <span className="text-sm text-gray-500">{safeWishlist.length} Items</span>
                </div>

                {safeWishlist.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <h2 className="text-xl font-medium text-gray-800 mb-2">Your Wish List is empty</h2>
                        <p className="text-gray-500 mb-6">Explore more items and add them to your wishlist!</p>
                        <Link
                            to="/"
                            className="bg-[var(--amz-orange)] hover:bg-[var(--amz-orange-hover)] text-white font-bold py-2 px-6 rounded-md transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {safeWishlist.map((product) => (
                            <div key={product.id} className="h-full">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
