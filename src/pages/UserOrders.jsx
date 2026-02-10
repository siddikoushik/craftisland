import { useApp } from '../context/AppContext';
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserOrders = () => {
    const { userProfile } = useApp();
    const orders = userProfile.orders || [];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-2xl font-normal text-black mb-6">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white border border-[#D5D9D9] rounded-lg p-10 text-center shadow-sm">
                    <Package size={48} className="mx-auto text-[#DDD] mb-4" />
                    <h2 className="text-xl text-black font-medium mb-2">No orders placed yet</h2>
                    <p className="text-[#565959] mb-6">Looks like you haven't bought anything from us yet.</p>
                    <Link to="/" className="btn-primary inline-block px-6 py-2 rounded-md font-medium text-black">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => {
                        const date = new Date(order.created_at || order.date);
                        const shipping = order.shipping_details || order.shippingDetails || {};

                        return (
                            <div key={order.id} className="bg-white border border-[#D5D9D9] rounded-lg overflow-hidden shadow-sm hover:border-[var(--amz-orange)] transition-colors">
                                {/* Order Header */}
                                <div className="bg-[#F0F2F2] p-4 text-[14px] text-[#565959] flex flex-col md:flex-row justify-between gap-4 border-b border-[#D5D9D9]">
                                    <div className="flex gap-8">
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-[#565959]">Order Placed</span>
                                            <span className="text-[#565959]">{!isNaN(date) ? date.toLocaleDateString() : 'Date unavailable'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-[#565959]">Total</span>
                                            <span className="text-[#565959]">₹{order.total}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-[#565959]">Ship To</span>
                                            <span className="text-[#007185] group-hover:underline cursor-pointer relative group">
                                                {shipping.name || 'User'}
                                                <div className="absolute hidden group-hover:block bg-white border border-[#D5D9D9] p-3 shadow-lg rounded top-full left-0 z-10 w-48 text-black text-xs">
                                                    <p className="font-bold mb-1">{shipping.name}</p>
                                                    <p>{shipping.homeAddress}</p>
                                                    <p>{shipping.location}</p>
                                                    <p>Phone: {shipping.phone}</p>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-[#565959] text-right">
                                        <div className="text-xs uppercase font-bold">Order # {order.id}</div>
                                        <div className="flex items-center gap-1 justify-end text-[#007185] hover:underline cursor-pointer text-sm">
                                            View invoice
                                        </div>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h3 className={`font-bold text-lg ${order.status === 'Delivered' ? 'text-green-700' : 'text-[#C7511F]'}`}>
                                            {order.status}
                                        </h3>
                                        {order.status !== 'Delivered' && (
                                            <p className="text-[#565959] text-sm">Arriving shortly</p>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        {order.items && order.items.map((item, idx) => {
                                            // Handle case where product might be null if deleted
                                            const product = item.product || {};
                                            const image = product.image || 'https://via.placeholder.com/100';
                                            const name = product.name || `Product #${item.product_id}`;

                                            return (
                                                <div key={idx} className="flex gap-6 items-start">
                                                    <div className="w-[90px] h-[90px] flex-shrink-0">
                                                        <img src={image} alt={name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Link to={`/product/${product.id}`} className="text-[#007185] font-medium hover:underline hover:text-[#C7511F] line-clamp-2 mb-1">
                                                            {name}
                                                        </Link>
                                                        <div className="text-xs text-[#565959] mb-1">Sold by: <span className="text-[#007185]">CraftIsland</span></div>
                                                        <div className="text-[13px] text-[#B12704] font-bold">₹{item.price_at_purchase}</div>
                                                        <div className="text-sm text-black mt-1">Qty: {item.qty}</div>

                                                        <div className="mt-2 flex gap-2">
                                                            <button className="btn-secondary py-1 px-3 text-xs rounded shadow-none bg-[#F0F2F2] border border-[#D5D9D9] hover:bg-[#E3E6E6]">Buy it again</button>
                                                            <Link to={`/product/${product.id}`} className="btn-secondary py-1 px-3 text-xs rounded shadow-none bg-[#F0F2F2] border border-[#D5D9D9] hover:bg-[#E3E6E6]">View your item</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserOrders;
