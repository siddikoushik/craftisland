import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Lock, ShieldCheck, ChevronRight } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, addToCart } = useApp();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const found = products.find(p => p.id === parseInt(id));
        if (found) {
            setProduct(found);
            // Default to first image in array if available, else single image
            const initialImage = (found.images && found.images.length > 0) ? found.images[0] : found.image;
            setActiveImage(initialImage);
        }
    }, [id, products]);

    if (!product) return <div className="p-10">Loading...</div>;

    const discountPercentage = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    // Stock Logic
    const stock = product.stock || 0;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= 10;

    return (
        <div className="min-h-screen bg-white pb-10">
            {/* Back Button */}
            <div className="max-w-[1500px] mx-auto p-4">
                <Link to="/" className="text-[14px] text-[#565959] hover:underline hover:text-[var(--amz-orange)] flex items-center gap-1">
                    <ChevronRight size={14} className="rotate-180" /> Back to results
                </Link>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-[var(--amz-header-secondary)] py-1 px-4 text-[12px] text-[#565959] border-b border-[#ddd]">
                <Link to="/" className="hover:underline">Home</Link>
                <span className="mx-1">›</span>
                <span className="hover:underline cursor-pointer">{product.category}</span>
                <span className="mx-1">›</span>
                <span className="text-[#C7511F] font-bold">{product.name}</span>
            </div>

            <div className="max-w-[1500px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Images (4 cols) */}
                <div className="lg:col-span-4 flex gap-4 lg:sticky lg:top-4 h-fit relative">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3 w-[50px]">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setActiveImage(img)}
                                    className={`w-[45px] h-[45px] border rounded-sm overflow-hidden cursor-pointer ${activeImage === img ? 'border-[#e77600] ring-1 ring-[#e77600] shadow-sm' : 'border-[#a2a6ac] hover:border-[#111]'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-contain" />
                                </div>
                            ))
                        ) : (
                            <div
                                onMouseEnter={() => setActiveImage(product.image)}
                                className={`w-[45px] h-[45px] border rounded-sm overflow-hidden cursor-pointer ${activeImage === product.image ? 'border-[#e77600] ring-1 ring-[#e77600] shadow-sm' : 'border-[#a2a6ac] hover:border-[#111]'}`}
                            >
                                <img src={product.image} alt="" className="w-full h-full object-contain" />
                            </div>
                        )}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 text-center bg-white p-4 rounded-sm">
                        <img src={activeImage || product.image} alt={product.name} className="max-h-[500px] max-w-full object-contain mx-auto" />
                    </div>
                </div>

                {/* Center Column: details (5 cols) */}
                <div className="lg:col-span-5">
                    <h1 className="text-[24px] font-medium text-black leading-tight mb-1">
                        {product.name}
                    </h1>
                    <Link to="/" className="text-[14px] text-[var(--amz-blue)] hover:text-[#C7511F] hover:underline mb-2 block">
                        Visit the CraftIsland Store
                    </Link>

                    <div className="border-t border-b border-[#ddd] py-4 space-y-4">

                        {/* Price Block */}
                        <div>
                            {product.discountPrice ? (
                                <div className="flex items-start gap-2">
                                    <span className="text-[24px] text-[#CC0C39] font-light">-{discountPercentage}%</span>
                                    <div className="flex items-baseline">
                                        <span className="text-xs relative top-[-6px]">₹</span>
                                        <span className="text-[28px] font-medium text-black leading-none">{product.discountPrice}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-baseline">
                                    <span className="text-xs relative top-[-6px]">₹</span>
                                    <span className="text-[28px] font-medium text-black leading-none">{product.price}</span>
                                </div>
                            )}
                            {product.discountPrice && (
                                <div className="text-[12px] text-[#565959] mt-1">
                                    M.R.P.: <span className="line-through">₹{product.price}</span>
                                </div>
                            )}
                            <div className="text-[14px] text-black mt-1">
                                Inclusive of all taxes
                            </div>
                        </div>

                        {/* Icons */}
                        <div className="grid grid-cols-4 gap-2 py-2">
                            <div className="flex flex-col items-center justify-start text-center gap-1">
                                <div className="w-[35px] h-[35px] rounded-full bg-[#F0F2F2] flex items-center justify-center">
                                    <span className="text-[var(--amz-blue)] font-bold text-xs">Pay</span>
                                </div>
                                <span className="text-[12px] text-[var(--amz-blue)] leading-tight">Pay on Delivery</span>
                            </div>

                            <div className="flex flex-col items-center justify-start text-center gap-1">
                                <div className="w-[35px] h-[35px] rounded-full bg-[#F0F2F2] flex items-center justify-center">
                                    <ShieldCheck size={18} className="text-[var(--amz-blue)]" />
                                </div>
                                <span className="text-[12px] text-[var(--amz-blue)] leading-tight">Warranty Policy</span>
                            </div>
                        </div>
                    </div>

                    <div className="py-4 space-y-4">
                        <h3 className="font-bold text-black">About this item</h3>
                        <ul className="list-disc pl-5 space-y-2 text-[14px] text-[#333]">
                            {product.description ? (
                                <>
                                    <li>{product.description}</li>
                                    <li>High quality wax tailored for long-lasting burn time.</li>
                                    <li>Perfect for home decor, gifting, or aromatherapy.</li>
                                </>
                            ) : (
                                <li>Premium quality handwritten product description.</li>
                            )}
                        </ul>
                    </div>
                </div >

                {/* Right Column: Buy Box (3 cols) */}
                < div className="lg:col-span-3" >
                    <div className="border border-[#D5D9D9] rounded-lg p-4 bg-white shadow-sm">
                        <div className="text-xl font-bold text-[#B12704] mb-2">
                            ₹{product?.discountPrice || product?.price}
                        </div>

                        {/* Stock Status */}
                        {isOutOfStock ? (
                            <div className="text-[18px] text-[#B12704] font-medium mb-4">
                                Currently unavailable.
                            </div>
                        ) : isLowStock ? (
                            <div className="text-[18px] text-[#B12704] font-medium mb-4">
                                Only {stock} left in stock.
                            </div>
                        ) : (
                            <div className="text-[18px] text-[#007600] font-medium mb-4">
                                In stock
                            </div>
                        )}

                        <div className="space-y-3 mb-4">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={isOutOfStock}
                                className={`w-full btn-primary rounded-full py-2 shadow-sm font-bold ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-300 border-gray-400' : ''}`}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    addToCart(product);
                                    navigate('/checkout');
                                }}
                                disabled={isOutOfStock}
                                className={`w-full bg-transparent hover:bg-[#FAF2DF] border border-[#C9A24D] text-[#5A3E2B] rounded-full py-2 shadow-sm font-bold ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="table text-[12px] w-full text-[#565959] mb-4">
                            <div className="table-row">
                                <div className="table-cell py-1 w-24">Ships from</div>
                                <div className="table-cell font-medium text-black">CraftIsland</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell py-1">Sold by</div>
                                <div className="table-cell font-medium text-[var(--amz-blue)]">CraftIsland Retail</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[var(--amz-blue)] text-[13px] mb-4">
                            <Lock size={12} className="text-[#999]" />
                            <span>Secure transaction</span>
                        </div>
                    </div>
                </div >

            </div >
        </div >
    );
};

export default ProductDetails;
