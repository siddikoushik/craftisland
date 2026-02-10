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
        <div className="bg-[#fff6f6] border border-[#D5D9D9] rounded-lg overflow-hidden flex flex-col h-full hover:border-[var(--amz-orange)] hover:shadow-lg transition-all duration-200 p-4">
            {/* Image Container */}
            <div className="relative bg-[#fff6f6] flex items-center justify-center h-[260px] mb-2">
                <Link to={`/product/${product.id}`} className="block h-full w-full">
                    <img
                        src={product.images ? product.images[0] : product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                    />
                </Link>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                {/* Title & Wishlist */}
                <div className="flex justify-between items-start mb-1">
                    <Link to={`/product/${product.id}`} className="flex-1 pr-2">
                        <h3 className="text-[16px] font-medium text-black leading-snug line-clamp-3 hover:text-[var(--amz-orange)] hover:underline">
                            {product.name}
                        </h3>
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product);
                        }}
                        className="text-black hover:text-[var(--amz-orange)] transition-colors"
                    >
                        <Heart
                            size={24}
                            fill={Array.isArray(wishlist) && wishlist.some(item => String(item.id) === String(product.id)) ? "black" : "none"}
                            strokeWidth={2}
                        />
                    </button>
                </div>



                {/* Price */}
                <div className="mb-4">
                    <Link to={`/product/${product.id}`} className="flex items-baseline text-black">
                        <span className="text-xs align-top relative top-[2px] pr-[1px]">₹</span>
                        <span className="text-[21px] font-medium leading-none">{whole}</span>
                        <span className="text-[11px] align-top relative top-[2px]">{fraction}</span>
                    </Link>
                    {product.discountPrice && (
                        <div className="text-[12px] text-[#565959]">
                            M.R.P: <span className="line-through">₹{product.price}</span>
                        </div>
                    )}
                </div>



                {/* Button */}
                <div className="mt-auto pt-2">
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full btn-primary rounded-full py-1.5 text-[13px] font-medium text-black shadow-sm active:shadow-inner"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
