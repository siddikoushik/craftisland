import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { cart, clearCart, userProfile, updateUserProfile, serviceablePincodes, placeOrder, contactInfo, authLoading } = useApp();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !userProfile.name) {
            navigate('/login');
        }
    }, [userProfile, authLoading, navigate]);

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center text-[var(--amz-orange)] font-bold">Loading...</div>;
    }

    const totalAmount = cart.reduce((acc, item) => {
        const price = item.discountPrice || item.price;
        return acc + (price * item.qty);
    }, 0);

    const handlePlaceOrder = async () => {
        // Validation
        if (!userProfile.name || !userProfile.phone || !userProfile.location || !userProfile.homeAddress) {
            setError('Please fill in all details.');
            return;
        }

        // Pincode Check
        if (serviceablePincodes && serviceablePincodes.length > 0) {
            const userPincode = userProfile.location.trim();
            if (!serviceablePincodes.includes(userPincode)) {
                setError(`Sorry, we currently do not deliver to Pincode: ${userPincode}. Allowed: ${serviceablePincodes.join(', ')}`);
                return;
            }
        }

        if (!paymentMethod) {
            setError('Please select a payment method.');
            return;
        }

        // Place Order
        const orderData = {
            total: totalAmount,
            shippingDetails: {
                name: userProfile.name,
                phone: userProfile.phone,
                location: userProfile.location
            },
            paymentMethod: paymentMethod
        };

        const success = await placeOrder(orderData);

        if (success) {
            setOrderSuccess(true);
            // clearCart() is handled inside placeOrder
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[var(--amz-bg)] flex flex-col items-center pt-10 px-4">
                <div className="w-full max-w-lg border border-green-600 rounded-lg p-6 bg-[var(--amz-light-dark)]">
                    <h1 className="text-2xl font-bold text-green-500 mb-2">Order Placed, Thanks!</h1>
                    <p className="text-black mb-4">Confirmation will be sent to your email.</p>
                    <Link to="/" onClick={() => setOrderSuccess(false)} className="text-[var(--amz-blue)] hover:underline hover:text-[var(--amz-orange)]">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--amz-bg)] p-8">
                <div className="max-w-[1500px] mx-auto bg-[var(--amz-bg)] p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4 text-black">Your Cart is Empty</h1>
                    <p className="mb-4">You need to add items to your cart before you can checkout.</p>
                    <Link to="/" className="btn-primary inline-block px-6 py-2 rounded-md text-black font-bold">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--amz-bg)] pb-10">
            <div className="max-w-[1200px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Forms */}
                <div className="lg:col-span-9">

                    {/* 1. Delivery Address */}
                    <div className="border border-[#D5D9D9] rounded-lg p-6 mb-4 bg-white">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold text-[#C7511F]">Delivery Address</h3>
                            <span className="text-[var(--amz-blue)] text-sm hover:underline cursor-pointer">Change</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-bold mb-1 text-black">Full Name</label>
                                <input
                                    type="text"
                                    value={userProfile.name}
                                    onChange={(e) => updateUserProfile({ name: e.target.value })}
                                    className="w-full max-w-sm border border-[#888] bg-white text-black rounded-[3px] p-1.5 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 text-black">Mobile number</label>
                                <input
                                    type="text"
                                    value={userProfile.phone}
                                    onChange={(e) => updateUserProfile({ phone: e.target.value })}
                                    className="w-full max-w-sm border border-[#888] bg-white text-black rounded-[3px] p-1.5 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 text-black">Delivery Pincode</label>
                                <input
                                    type="text"
                                    value={userProfile.location}
                                    onChange={(e) => updateUserProfile({ location: e.target.value })}
                                    maxLength={6}
                                    placeholder="Enter 6-digit Pincode"
                                    className="w-full max-w-sm border border-[#888] bg-white text-black rounded-[3px] p-1.5 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] shadow-[0_1px_2px_rgba(255,255,255,0.1)_inset] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Payment Method */}
                    <h2 className="text-[24px] font-medium text-[#C7511F] mb-4">Select a payment method</h2>

                    {/* Owner Contact Info for Orders */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h3 className="font-bold text-blue-800 mb-2">Want to order directly?</h3>
                        <p className="text-sm text-blue-700 mb-3">You can also contact the owner directly to place your order:</p>
                        <div className="flex flex-wrap gap-4">
                            {contactInfo?.instagram && (
                                <a href={contactInfo.instagram.startsWith('http') ? contactInfo.instagram : `https://instagram.com/${contactInfo.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-600 font-bold hover:underline">
                                    Instagram
                                </a>
                            )}
                            {contactInfo?.whatsapp && (
                                <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 font-bold hover:underline">
                                    WhatsApp
                                </a>
                            )}
                            {contactInfo?.email && (
                                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 text-gray-700 font-bold hover:underline">
                                    Email
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="border border-[#D5D9D9] rounded-lg p-6 mb-6 bg-white">
                        <h3 className="text-[18px] font-bold text-black mb-4 border-b border-[#D5D9D9] pb-2">Payment Options</h3>
                        <div className="space-y-4">
                            {/* Removed Credit/Debit and UPI as requested */}

                            <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
                                <input type="radio" name="payment" disabled className="accent-[var(--amz-orange)] w-4 h-4" />
                                <span className="font-bold text-black">Net Banking <span className="text-xs font-normal text-red-500">(Coming Soon)</span></span>
                            </label>

                            <label className="flex items-start gap-2 cursor-pointer">
                                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 accent-[var(--amz-orange)] w-4 h-4" />
                                <div><span className="font-bold text-black block">Cash on Delivery/Pay on Delivery</span><span className="text-sm text-[#565959]">Cash, UPI and Cards accepted.</span></div>
                            </label>
                        </div>
                    </div>

                    {/* 3. Review Items (Simplified) */}
                    <div className="bg-white p-4 rounded border border-[#D5D9D9]">
                        <h3 className="font-bold text-[#C7511F] mb-4">Review items and delivery</h3>
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4 mb-4">
                                <img
                                    src={item.images && item.images.length > 0 ? item.images[0] : item.image}
                                    alt={item.name}
                                    className="w-[60px] h-[60px] object-contain border border-[#D5D9D9] bg-white rounded-sm"
                                />
                                <div>
                                    <p className="font-bold text-sm text-black">{item.name}</p>
                                    <p className="text-xs text-[#565959]">Qty: {item.qty}</p>
                                    <p className="text-[#B12704] font-bold text-xs">₹{item.discountPrice || item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-3">
                    <div className="border border-[#D5D9D9] rounded-lg p-4 bg-white sticky top-4">
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full btn-primary bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200] rounded-[8px] py-1.5 shadow-sm mb-4 text-sm text-black font-bold"
                        >
                            Place your order
                        </button>
                        {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
                        <p className="text-xs text-[#565959] text-center mb-4 leading-tight">
                            By placing your order, you agree to CraftIsland's privacy notice and conditions of use.
                        </p>

                        <div className="border-t border-[#D5D9D9] py-4">
                            <h3 className="font-bold text-[18px] mb-2 text-black">Order Summary</h3>
                            <div className="flex justify-between text-sm mb-1 text-[#565959]">
                                <span>Items:</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1 text-[#565959]">
                                <span>Delivery:</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between text-[18px] font-bold text-[#B12704] border-t border-[#D5D9D9] pt-2 mt-2">
                                <span>Order Total:</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>

                        <div className="bg-[#F0F2F2] p-3 text-xs text-[#565959] rounded-b-lg border-t border-[#D5D9D9] -mx-4 -mb-4 mt-2">
                            <Link to="/" className="text-[var(--amz-blue)] hover:underline">How are shipping costs calculated?</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
