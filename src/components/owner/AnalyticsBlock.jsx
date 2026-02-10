import { useApp } from '../../context/AppContext';
import { TrendingUp, Package, IndianRupee } from 'lucide-react';

const AnalyticsBlock = () => {
    const { ownerSettings } = useApp();
    const orders = ownerSettings.orders || [];

    // Calculate Metrics
    const itemsSold = orders.reduce((total, order) => {
        return total + order.items.reduce((sum, item) => sum + item.qty, 0);
    }, 0);

    const totalRevenue = orders.reduce((total, order) => {
        return total + (order.total || 0);
    }, 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--amz-border)] h-full">
            <h2 className="text-xl font-bold text-[var(--text-heading)] mb-6 flex items-center gap-2">
                <TrendingUp className="text-[var(--amz-orange)]" />
                Business Analytics
            </h2>

            <div className="grid grid-cols-2 gap-6">
                {/* Total Revenue */}
                <div className="bg-[var(--bg-section)] p-4 rounded-lg border border-[var(--amz-border)] flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-gold-soft)]/20 flex items-center justify-center mb-2">
                        <IndianRupee size={20} className="text-[var(--amz-orange)]" />
                    </div>
                    <span className="text-sm text-[var(--text-body)] font-medium uppercase tracking-wider">Total Revenue</span>
                    <span className="text-2xl font-bold text-[var(--text-heading)] mt-1">
                        ₹{totalRevenue.toLocaleString()}
                    </span>
                    <span className="text-xs text-green-600 mt-1 font-medium">+12% vs last month</span>
                </div>

                {/* Items Sold */}
                <div className="bg-[var(--bg-section)] p-4 rounded-lg border border-[var(--amz-border)] flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-sage)]/20 flex items-center justify-center mb-2">
                        <Package size={20} className="text-[var(--accent-olive)]" />
                    </div>
                    <span className="text-sm text-[var(--text-body)] font-medium uppercase tracking-wider">Items Sold</span>
                    <span className="text-2xl font-bold text-[var(--text-heading)] mt-1">
                        {itemsSold}
                    </span>
                    <span className="text-xs text-green-600 mt-1 font-medium">+5 new orders</span>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsBlock;
