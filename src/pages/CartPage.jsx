import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, updateCartQty, removeFromCart, userProfile } = useApp();
    const navigate = useNavigate();

    const totalAmount = cart.reduce((acc, item) => {
        const price = item.discountPrice || item.price;
        return acc + (price * item.qty);
    }, 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--amz-bg)] p-8">
                <div className="max-w-[1500px] mx-auto bg-[var(--amz-bg)] p-8">
                    <h1 className="text-3xl font-medium mb-4 text-black">Your CraftIsland Cart is empty.</h1>
                    <Link to="/" className="text-[var(--amz-blue)] hover:underline hover:text-[var(--amz-orange)]">
                        Shop today's deals
                    </Link>

                    {!userProfile.name && (
                        <div className="mt-4 flex gap-2">
                            <Link to="/" className="btn-primary rounded-md shadow-none text-black font-bold">Sign in to your account</Link>
                            <button className="btn-secondary bg-[var(--amz-light-dark)] text-black rounded-md shadow-none border border-[#444]">Sign up now</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--amz-bg)] pb-10">
            <div className="max-w-[1200px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="lg:col-span-9">
                    {/* Cart Items List */}
                    <div className="bg-white p-4 rounded border border-[#D5D9D9]">
                        <h2 className="text-2xl font-medium mb-1 border-b border-[#D5D9D9] pb-2">Shopping Cart</h2>
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4 mb-6 border-b border-[#D5D9D9] pb-4 last:border-0 last:pb-0">
                                <img
                                    src={item.images && item.images.length > 0 ? item.images[0] : item.image}
                                    alt={item.name}
                                    className="w-[100px] h-[100px] object-contain border border-[#D5D9D9] bg-white rounded-sm"
                                />
                                <div>
                                    <h4 className="font-bold text-black">{item.name}</h4>
                                    <p className="text-[#B12704] font-bold text-sm mb-1">₹{item.discountPrice || item.price}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <select
                                            value={item.qty}
                                            onChange={(e) => {
                                                const diff = parseInt(e.target.value) - item.qty;
                                                updateCartQty(item.id, diff);
                                            }}
                                            className="bg-[#F0F2F2] border border-[#D5D9D9] text-black rounded-[7px] text-sm p-1 shadow-sm focus:ring-[#e77600] focus:border-[#e77600]"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
                                            ))}
                                        </select>
                                        <div className="w-[1px] h-[12px] bg-[#D5D9D9]"></div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-[var(--amz-blue)] text-sm hover:underline">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subtotal Panel */}
                <div className="lg:col-span-3">
                    <div className="border border-[#D5D9D9] rounded-lg p-4 bg-white sticky top-4">
                        <div className="text-lg font-medium mb-4">
                            Subtotal ({cart.reduce((a, c) => a + c.qty, 0)} items): <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full btn-primary bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200] rounded-[8px] py-1.5 shadow-sm mb-4 text-sm text-black font-bold"
                        >
                            Proceed to Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
