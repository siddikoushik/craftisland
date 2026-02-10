import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';

const EditProductModal = ({ product, onClose }) => {
    const { updateProduct } = useApp();
    const [formData, setFormData] = useState({
        ...product,
        discountPercent: product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : ''
    });

    const [availability, setAvailability] = useState(
        product.stock === 0 ? 'out_of_stock' : product.stock < 10 ? 'few_available' : 'available'
    );

    const [finalPrice, setFinalPrice] = useState(product.discountPrice);

    useEffect(() => {
        if (formData.price) {
            const price = parseFloat(formData.price);
            const discount = parseFloat(formData.discountPercent) || 0;
            const discounted = price - (price * (discount / 100));
            setFinalPrice(discount > 0 ? Math.round(discounted) : null);
        } else {
            setFinalPrice(null);
        }
    }, [formData.price, formData.discountPercent]);

    const handleImageUpload = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const promises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(promises).then(newImages => {
                // Ensure images is an array
                const currentImages = Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []);
                setFormData(prev => ({ ...prev, images: [...currentImages, ...newImages] }));
            });
        }
    };

    const removeImage = (index) => {
        const currentImages = Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []);
        const updatedImages = currentImages.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: updatedImages }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Determine stock based on availability selection
        let newStock = product.stock;
        if (availability === 'available') newStock = 100;
        if (availability === 'few_available') newStock = 5;
        if (availability === 'out_of_stock') newStock = 0;

        // Ensure images are set correctly
        const currentImages = Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []);
        // Fallback image if all removed
        const finalImages = currentImages.length > 0 ? currentImages : ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800'];

        const updatedProduct = {
            ...formData,
            price: parseFloat(formData.price),
            discountPrice: finalPrice,
            stock: newStock,
            images: finalImages,
            image: finalImages[0] // Backward compatibility
        };

        updateProduct(updatedProduct);
        onClose();
    };

    // Ensure we have an array for rendering previews
    const displayImages = Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []);

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-[var(--amz-orange)]">Edit Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Images Section */}
                    <div>
                        <label className="block font-bold mb-2">Product Images</label>
                        <div className="border border-[#888] rounded-md p-3 bg-white">
                            <div className="flex flex-wrap gap-3 mb-3">
                                {displayImages.map((img, index) => (
                                    <div key={index} className="relative w-24 h-24 border border-gray-200 rounded overflow-hidden group">
                                        <img src={img} alt="Preview" className="w-full h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-[var(--amz-orange)] hover:bg-orange-50 transition-colors">
                                    <ImageIcon className="text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">Add Image</span>
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price & Discount */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[var(--amz-orange)] focus:border-[var(--amz-orange)]"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[var(--amz-orange)] focus:border-[var(--amz-orange)]"
                                    value={formData.discountPercent}
                                    onChange={e => setFormData({ ...formData, discountPercent: e.target.value })}
                                />
                            </div>

                            {/* Final Price Preview */}
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                                <span className="text-sm font-medium">Final Price:</span>
                                <div>
                                    {finalPrice ? (
                                        <>
                                            <span className="text-xs line-through text-gray-500 mr-2">₹{formData.price}</span>
                                            <span className="text-lg font-bold text-[#B12704]">₹{finalPrice}</span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-[#B12704]">₹{formData.price}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[var(--amz-orange)] focus:border-[var(--amz-orange)]"
                                    value={availability}
                                    onChange={e => setAvailability(e.target.value)}
                                >
                                    <option value="available">Available</option>
                                    <option value="few_available">Few Available</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[var(--amz-orange)] hover:bg-[var(--amz-orange-hover)] text-white font-bold rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
