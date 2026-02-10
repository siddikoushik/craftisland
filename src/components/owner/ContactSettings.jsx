
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Instagram, Mail, MessageCircle } from 'lucide-react'; // Assuming MessageCircle for WhatsApp

const ContactSettings = () => {
    const { contactInfo, updateContactInfo } = useApp();
    const [instagram, setInstagram] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (contactInfo) {
            setInstagram(contactInfo.instagram || '');
            setWhatsapp(contactInfo.whatsapp || '');
            setEmail(contactInfo.email || '');
        }
    }, [contactInfo]);

    const handleSave = () => {
        updateContactInfo({ instagram, whatsapp, email });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                Contact Settings
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link/ID</label>
                    <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--amz-orange)]"
                            placeholder="@username or link"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--amz-orange)]"
                            placeholder="+91 9876543210"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--amz-orange)]"
                            placeholder="support@craftisland.in"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full bg-[var(--amz-orange)] text-white font-bold py-2 rounded-md hover:bg-[var(--amz-orange-hover)] transition-colors"
                >
                    Save Contact Info
                </button>
            </div>
        </div>
    );
};

export default ContactSettings;
