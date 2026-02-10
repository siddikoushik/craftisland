import { useApp } from '../../context/AppContext';
import { Package, Truck, Check, Trash2 } from 'lucide-react';


const OwnerOrders = () => {
    const { ownerSettings, updateOrderStatus, deleteOrder } = useApp();

    // Filter out delivered orders so they don't clutter the dashboard
    const orders = (ownerSettings.orders || []).filter(order => order.status !== 'Delivered');

    const handleAccept = async (order) => {
        if (confirm(`Accept Order #${order.id}?`)) {
            const success = await updateOrderStatus(order.id, 'Accepted');
            if (success) {
                alert(`Email sent to user: Order #${order.id} has been Confirmed/Accepted.`);
            }
        }
    };

    const handleShip = async (order) => {
        if (confirm(`Mark Order #${order.id} as Delivered/Shipped?`)) {
            const success = await updateOrderStatus(order.id, 'Delivered');
            if (success) {
                alert(`Email sent to user: Item Started Delivery for Order #${order.id}.`);
            }
        }
    };

    const handleDelete = async (order) => {
        if (confirm(`Are you sure you want to DELETE Order #${order.id}? This cannot be undone.`)) {
            const success = await deleteOrder(order.id);
            if (success) {
                alert(`Order #${order.id} has been deleted.`);
            }
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg border border-[#D5D9D9] mb-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#C7511F]">
                <Package className="text-[#C7511F]" />
                Recent Orders
            </h2>

            {orders.length === 0 ? (
                <p className="text-[#565959] text-center py-8">No orders received yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        // Fallback for snake_case vs camelCase and handling JSONB fields
                        const shipping = order.shipping_details || order.shippingDetails || {};
                        const items = order.items || [];

                        return (
                            <div key={order.id} className="bg-white border border-[#D5D9D9] p-4 rounded-md flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-mono text-[#C7511F] font-bold text-lg">#{order.id}</span>
                                        <span className="text-xs text-[#565959]">{new Date(order.created_at || order.date).toLocaleString()}</span>
                                    </div>

                                    {/* User Details */}
                                    <div className="mb-3 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#f9f9f9] p-2 rounded">
                                        <div>
                                            <p className="font-bold text-black">{shipping.name || 'Unknown User'}</p>
                                            <p className="text-[#565959]">{shipping.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#565959] break-words">{shipping.location}</p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="bg-white p-2 border border-gray-100 rounded text-sm space-y-1">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between border-b last:border-0 border-dashed border-gray-200 py-1">
                                                <span><span className="font-bold text-black">{item.qty}x</span> {item.product?.name || `Product #${item.product_id}`}</span>
                                                <span className="font-bold">₹{item.price_at_purchase}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="font-bold text-right mt-2 text-[#B12704]">Total: ₹{order.total}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 min-w-[140px] w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-start">
                                    <div className={`px-3 py-1 rounded-full border border-[#D5D9D9] text-xs font-bold uppercase text-center w-fit ${order.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                                            'bg-[var(--amz-orange)] text-black'
                                        }`}>
                                        {order.status}
                                    </div>
                                    <div className="flex gap-2">
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(order)}
                                            className="p-2 border border-[#D5D9D9] bg-white rounded hover:bg-red-50 text-red-600 transition-colors shadow-sm"
                                            title="Delete Order"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                        {/* Van Button (Ship/Deliver) */}

                                        <button
                                            onClick={() => handleShip(order)}
                                            className="p-2 border border-[#D5D9D9] bg-white rounded hover:bg-[#F0F2F2] text-blue-600 transition-colors shadow-sm"
                                            title="Start Delivery"
                                        >
                                            <Truck size={20} />
                                        </button>

                                        {/* Tick Button (Accept) */}
                                        <button
                                            onClick={() => handleAccept(order)}
                                            className="p-2 border border-[#D5D9D9] bg-white rounded hover:bg-[#F0F2F2] text-green-600 transition-colors shadow-sm"
                                            title="Accept Order"
                                        >
                                            <Check size={20} />
                                        </button>
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

export default OwnerOrders;
