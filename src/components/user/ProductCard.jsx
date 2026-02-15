import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ProductCard = ({ product }) => {
    const { addToCart, wishlist, toggleWishlist } = useApp();

    // formatting price to look like Amazon (e.g., 499 .00)
    const currentPrice = product.discountPrice || product.price;
    const priceString = currentPrice.toString();
    const [whole, fraction] = priceString.includes('.') ? priceString.split('.') : [priceString, '00'];

    return (
        <div className="bg-white group flex flex-col h-full p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl relative">
            {/* Image Container */}
            <div className="relative bg-white flex items-center justify-center w-full aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
                <Link to={`/product/${product.id}`} className="block h-full w-full">
                    <img
                        src={product.images ? product.images[0] : product.image}
                        alt={product.name}
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                {/* Wishlist Button - Absolute Top Right */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-100 text-black hover:text-pink-600 shadow-sm"
                >
                    <Heart
                        size={18}
                        fill={Array.isArray(wishlist) && wishlist.some(item => String(item.id) === String(product.id)) ? "currentColor" : "none"}
                        strokeWidth={2}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-2">
                {/* Title */}
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-[15px] font-medium text-gray-800 leading-snug line-clamp-2 hover:text-black transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mt-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-black">₹{currentPrice}</span>
                        {product.discountPrice && (
                            <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                        )}
                    </div>
                </div>

                {/* Button */}
                <div className="mt-auto pt-3">
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full border border-black/80 bg-transparent rounded-full py-2.5 text-[14px] font-medium text-black transition-all duration-300 hover:bg-black hover:text-white active:scale-95 uppercase tracking-wide"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
