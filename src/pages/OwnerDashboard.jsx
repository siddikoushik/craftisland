import AddProductForm from '../components/owner/AddProductForm';
import ProductList from '../components/owner/ProductList';
import OwnerOrders from '../components/owner/OwnerOrders';
import DeliverySettings from '../components/owner/DeliverySettings';
import AnalyticsBlock from '../components/owner/AnalyticsBlock';
import ContactSettings from '../components/owner/ContactSettings';
import AdminSettings from '../components/owner/AdminSettings';

import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

const OwnerDashboard = () => {
    const { setUserRole } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setUserRole('owner');
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-[var(--amz-orange)]">Owner Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <AddProductForm />
                <AnalyticsBlock />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <DeliverySettings />
                <ContactSettings />
            </div>

            <div className="mb-12">
                <AdminSettings />
            </div>

            <div className="grid grid-cols-1 mb-12">
                <OwnerOrders />
            </div>

            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-[var(--amz-orange)]">Your Inventory</h2>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
                <ProductList searchTerm={searchTerm} />
            </div>
        </div>
    );
};

export default OwnerDashboard;
