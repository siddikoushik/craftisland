import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Image as ImageIcon } from 'lucide-react';

const AddProductForm = () => {
    const { addProduct } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [],
        category: 'Crafts',
        price: '',
        discountPercent: ''
    });

    const [finalPrice, setFinalPrice] = useState(null);

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

            Promise.all(promises).then(images => {
                setFormData(prev => ({ ...prev, images: [...prev.images, ...images] }));
            });
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        const defaultImage = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800';
        const productImages = formData.images.length > 0 ? formData.images : [defaultImage];

        const newProduct = {
            name: formData.name,
            description: formData.description,
            images: productImages,
            image: productImages[0], // Fallback for components ensuring backward compatibility
            category: formData.category,
            price: parseFloat(formData.price),
            discountPrice: finalPrice,
        };

        addProduct(newProduct);

        // Reset form
        setFormData({
            name: '',
            description: '',
            images: [],
            category: 'Crafts',
            price: '',
            discountPercent: ''
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-[#D5D9D9] mb-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#C7511F]">
                <Plus className="text-[#C7511F]" />
                Add New Product
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="w-full bg-white border border-[#888] rounded-md p-3 text-black focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] transition-colors shadow-sm"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="Description"
                        rows="3"
                        className="w-full bg-white border border-[#888] rounded-md p-3 text-black focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] transition-colors shadow-sm"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />

                    {/* Image Upload Section */}
                    <div className="border border-[#888] rounded-md p-3 bg-white">
                        <div className="relative mb-2">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex items-center gap-2 text-gray-500 border border-dashed border-gray-400 rounded p-2 justify-center bg-gray-50">
                                <ImageIcon size={20} />
                                <span className="text-sm">Click to upload images</span>
                            </div>
                        </div>

                        {/* Image Previews */}
                        {formData.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden group">
                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <select
                        className="w-full bg-white border border-[#888] rounded-md p-3 text-black focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] transition-colors shadow-sm"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option>Crafts</option>
                        <option>Tools</option>
                        <option>Materials</option>
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-[#565959] ml-1">Original Price (₹)</label>
                            <input
                                type="number"
                                placeholder="1200"
                                className="w-full bg-white border border-[#888] rounded-md p-3 text-black focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] transition-colors shadow-sm"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[#565959] ml-1">Discount %</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full bg-white border border-[#888] rounded-md p-3 text-black focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] transition-colors shadow-sm"
                                value={formData.discountPercent}
                                onChange={e => setFormData({ ...formData, discountPercent: e.target.value })}
                            />
                        </div>
                    </div>

                    {formData.price && (
                        <div className="bg-[#F0F2F2] p-4 rounded-md flex items-center justify-between border border-[#D5D9D9]">
                            <span className="text-[#565959]">Final Price:</span>
                            <div className="text-right">
                                {finalPrice ? (
                                    <>
                                        <span className="text-sm line-through text-gray-500 mr-2">₹{formData.price}</span>
                                        <span className="text-xl font-bold text-[#B12704]">₹{finalPrice}</span>
                                    </>
                                ) : (
                                    <span className="text-xl font-bold text-[#B12704]">₹{formData.price || 0}</span>
                                )}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="w-full btn-primary mt-2 rounded-md bg-[var(--amz-orange)] text-black border-none font-bold hover:opacity-90">
                        Upload Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;
