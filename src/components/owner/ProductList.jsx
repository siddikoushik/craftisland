import { useApp } from '../../context/AppContext';
import { Trash2, Tag, Pencil } from 'lucide-react';
import { useState } from 'react';
import EditProductModal from './EditProductModal';

const ProductList = ({ searchTerm = '' }) => {
    const { products, deleteProduct } = useApp();
    const [editingProduct, setEditingProduct] = useState(null);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">Your inventory is empty.</p>
                        <p className="text-sm text-gray-400">Add a new product above to get started.</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No products found matching "{searchTerm}"
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="bg-white border border-[#D5D9D9] rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative h-48 overflow-hidden bg-white p-2">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="bg-white border border-gray-300 text-blue-600 p-2 rounded-full hover:bg-gray-50 hover:shadow-lg transition-all"
                                        title="Edit Product"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="bg-white border border-gray-300 text-red-600 p-2 rounded-full hover:bg-gray-50 hover:shadow-lg transition-all"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                {product.discountPrice && (
                                    <div className="absolute top-2 right-2 bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded-[2px] flex items-center gap-1">
                                        <Tag size={12} />
                                        SALE
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-[#C7511F] line-clamp-1">{product.name}</h3>
                                        <span className="text-xs text-[#565959] uppercase tracking-wider">{product.category}</span>
                                    </div>
                                    <div className="text-right">
                                        {product.discountPrice ? (
                                            <>
                                                <div className="text-sm text-gray-500 line-through">₹{product.price}</div>
                                                <div className="text-lg font-bold text-black">₹{product.discountPrice}</div>
                                            </>
                                        ) : (
                                            <div className="text-lg font-bold text-black">₹{product.price}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </>
    );
};

export default ProductList;
