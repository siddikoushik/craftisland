import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Helper hook for local storage persistence (Keeping for Cart/Wishlist only)
const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [serviceablePincodes, setServiceablePincodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // New state for critical auth paths


  // Keep Cart & Wishlist local for better UX (guest users)
  // Keep Cart & Wishlist local but ISOLATED by User
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [userRole, setUserRole] = useStickyState('user', 'craftisland_role');

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    location: '',
    homeAddress: '',
    phone: '',
    orders: []
  });

  // --- Persistence Logic with Isolation ---
  // 1. Load data when user changes
  useEffect(() => {
    const userId = userProfile.email || 'guest';
    const cartKey = `craftisland_cart_${userId}`;
    const wishlistKey = `craftisland_wishlist_${userId}`;

    console.log(`[Storage] Switching context to: ${userId}`);

    try {
      const savedCart = window.localStorage.getItem(cartKey);
      const savedWishlist = window.localStorage.getItem(wishlistKey);

      // Important: Only set if different to avoid infinite loops if we were deps relying
      // But here we just set once per user switch.
      setCart(savedCart ? JSON.parse(savedCart) : []);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    } catch (e) {
      console.error("Error loading isolated storage", e);
    }
  }, [userProfile.email]);

  // 2. Save data when cart/wishlist changes (Optimized)
  useEffect(() => {
    const userId = userProfile.email || 'guest';
    const key = `craftisland_cart_${userId}`;

    if (cart.length > 0 || userId !== 'guest') {
      try {
        // OPTIMIZATION: Don't store large base64 images in LocalStorage.
        // We only really need ID, Qty, Name, Price.
        const sanitizedCart = cart.map(item => {
          // If image is a huge data URL, don't save it to LS.
          // If it's a short http URL (Cloudinary/Supabase), it's fine.
          const isLargeImage = typeof item.image === 'string' && item.image.startsWith('data:image') && item.image.length > 1000;
          return {
            ...item,
            image: isLargeImage ? '' : item.image, // Clear huge images from LS persistence
            images: [] // Don't save array of images to LS either
          };
        });

        window.localStorage.setItem(key, JSON.stringify(sanitizedCart));
      } catch (e) {
        console.error("LocalStorage Save Error:", e);
      }
    } else if (cart.length === 0) {
      window.localStorage.removeItem(key);
    }
  }, [cart, userProfile.email]);

  useEffect(() => {
    const userId = userProfile.email || 'guest';
    if (wishlist.length > 0 || userId !== 'guest') {
      window.localStorage.setItem(`craftisland_wishlist_${userId}`, JSON.stringify(wishlist));
    }
  }, [wishlist, userProfile.email]);

  const [ownerSettings, setOwnerSettings] = useState({
    orders: []
  });

  // --- 1. Fetch Initial Data (Products, Pincodes) ---
  const fetchInitialData = async () => {
    try {
      console.log("Fetching initial data...");
      const { data: productsData, error: prodError } = await supabase.from('products').select('*').order('id');

      if (prodError) console.error("Error fetching products:", prodError);
      else console.log("Products fetched:", productsData);

      if (productsData) setProducts(productsData);

      const { data: pincodesData } = await supabase.from('pincodes').select('code');
      if (pincodesData) setServiceablePincodes(pincodesData.map(p => p.code));

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // Optional: Realtime subscription
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        console.log("Realtime update detected, refetching...");
        fetchInitialData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ... (keeping other code)

  // --- 2. Auth & User Profile Sync ---
  useEffect(() => {
    const syncUser = async (session) => {
      if (!session?.user) {
        setUserProfile({ name: '', email: '', location: '', homeAddress: '', phone: '', orders: [] });
        setAuthLoading(false); // Auth check done, no user
        return;
      }

      // 1. Get Profile from 'profiles' table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // 2. Get User's Orders
      const { data: userOrders } = await supabase
        .from('orders')
        .select(`*, items: order_items ( *, product: products(*) )`)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });


      setUserProfile({
        name: profile?.full_name || session.user.user_metadata.full_name || '',
        email: session.user.email,
        location: profile?.location || '',
        homeAddress: profile?.home_address || '', // Map from DB
        phone: profile?.phone || '',
        orders: userOrders || []
      });
      setAuthLoading(false); // Auth & Profile sync done

      // ... within syncUser effect ...
    };

    // Initial Sync
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) syncUser(session);
      else setAuthLoading(false); // No session found initially
    });

    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 3. Owner Data Fetching ---
  useEffect(() => {
    const fetchOwnerOrders = async () => {
      if (userRole !== 'owner') return;

      try {
        console.log("Fetching ALL orders for Owner...");
        const { data: allOrders, error } = await supabase
          .from('orders')
          .select(`*, items: order_items ( *, product: products(*) )`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching owner orders:", error);
        } else {
          console.log("Owner orders fetched:", allOrders?.length);
          setOwnerSettings(prev => ({ ...prev, orders: allOrders || [] }));
        }
      } catch (e) {
        console.error("Exception fetching owner orders:", e);
      }
    };

    fetchOwnerOrders();

    // Subscribe to new orders (Realtime)
    if (userRole === 'owner') {
      const channel = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
          fetchOwnerOrders();
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [userRole]);

  // --- Actions ---

  // Owner Actions
  const addProduct = async (product) => {
    try {
      console.log("Attempting to add product:", product);

      // Attempt 1: Try with multiple images
      let { data, error } = await supabase.from('products').insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        discount_price: product.discountPrice,
        image: product.image,
        images: product.images || [],
        category: product.category,
        stock: product.stock || 0
      }]).select();

      // Fallback: If 'images' column is missing in DB (PGRST204), retry without it
      if (error && (error.code === 'PGRST204' || error.message?.includes('images'))) {
        console.warn("Database schema missing 'images' column. Falling back to single image.");

        const retry = await supabase.from('products').insert([{
          name: product.name,
          description: product.description,
          price: product.price,
          discount_price: product.discountPrice,
          image: product.image,
          // images: OMITTED to fix error
          category: product.category,
          stock: product.stock || 0
        }]).select();

        data = retry.data;
        error = retry.error;

        if (!error) {
          alert("Product saved successfully! (Note: Only main image saved. Please run the SQL command to enable multiple images.)");
        }
      }

      if (error) {
        console.error("Supabase Error:", error);
        alert(`Error adding product: ${error.message} (${error.code})`);
        throw error;
      }

      if (data) {
        console.log("Product added successfully:", data);
        setProducts(prev => [...prev, ...data]);
        if (!product.fallbackUsed) alert("Product saved successfully!"); // Avoid double alert if fallback used
      }
    } catch (e) {
      console.error("Exception in addProduct:", e);
      if (!e.code) {
        alert("Unexpected error: " + e.message);
      }
    }
  };

  const deleteProduct = async (id) => {
    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const updateProductStock = async (id, newStock) => {
    try {
      await supabase.from('products').update({ stock: newStock }).eq('id', id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch (e) { console.error(e); }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const { error } = await supabase.from('products').update({
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        discount_price: updatedProduct.discountPrice,
        image: updatedProduct.image,
        category: updatedProduct.category,
        stock: updatedProduct.stock
      }).eq('id', updatedProduct.id);

      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (e) { console.error(e); }
  };

  // Delivery Range
  const addPincode = async (code) => {
    try {
      const { error } = await supabase.from('pincodes').insert([{ code }]);
      if (!error) setServiceablePincodes(prev => [...prev, code]);
    } catch (e) { console.error(e); }
  };

  const removePincode = async (code) => {
    try {
      await supabase.from('pincodes').delete().eq('code', code);
      setServiceablePincodes(prev => prev.filter(c => c !== code));
    } catch (e) { console.error(e); }
  };

  // User Actions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.find(item => String(item.id) === String(product.id));
      if (exists) return safePrev.filter(item => String(item.id) !== String(product.id));
      return [...safePrev, product];
    });
  };

  const updateUserProfile = async (data) => {
    // Optimistic update
    setUserProfile(prev => ({ ...prev, ...data }));

    // DB Update
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // upsert profile
      await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: data.name,
        location: data.location,
        home_address: data.homeAddress, // Map to DB
        phone: data.phone,
        email: session.user.email
      });
    }
  };

  const placeOrder = async (orderData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("Please login to place order");

      // 1. Create Order
      const { data: order, error: orderError } = await supabase.from('orders').insert([{
        user_id: session.user.id,
        total: orderData.total,
        status: 'Processing',
        shipping_details: orderData.shippingDetails,
        payment_method: orderData.paymentMethod
      }]).select().single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        qty: item.qty,
        price_at_purchase: item.discountPrice || item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Update Stock
      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const newStock = Math.max(0, product.stock - item.qty);
          await updateProductStock(product.id, newStock);
        }
      }

      // Success
      clearCart();

      // Refresh user orders
      const { data: userOrders } = await supabase
        .from('orders')
        .select(`*, items: order_items ( *, product: products(*) )`)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setUserProfile(prev => ({ ...prev, orders: userOrders || [] }));

      return true;

    } catch (e) {
      console.error("Order failed:", e);
      alert("Failed to place order. " + e.message);
      return false;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOwnerSettings(prev => ({
        ...prev,
        orders: prev.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      }));
      return true;
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Error updating status: " + e.message);
      return false;
    }
  };

  // --- Site Settings (Contact Info) ---
  const [contactInfo, setContactInfo] = useStickyState({
    instagram: '',
    whatsapp: '',
    email: ''
  }, 'craftisland_contact_info');

  const updateContactInfo = (newInfo) => {
    setContactInfo(prev => ({ ...prev, ...newInfo }));
  };

  const deleteOrder = async (orderId) => {
    try {
      // 1. Delete Order Items first (to strictly avoid FK issues if cascade isn't set)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) {
        console.error("Error deleting items:", itemsError);
        // throw itemsError; // Optionally throw, but usually if items fail, order delete will fail too, so we can try anyway or stop.
        // Let's stop to be safe.
        throw itemsError;
      }

      // 2. Delete the Order
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOwnerSettings(prev => ({
        ...prev,
        orders: prev.orders.filter(o => o.id !== orderId)
      }));
      return true;
    } catch (e) {
      console.error("Failed to delete order:", e);
      alert("Error deleting order: " + e.message);
      return false;
    }
  };

  // --- Owner Authentication & Admin ---
  const [ownerPassword, setOwnerPassword] = useStickyState('@craftisland', 'craftisland_owner_pass');

  const verifyOwnerPassword = (inputPassword) => {
    return inputPassword === ownerPassword;
  };

  const updateOwnerPassword = (newPassword) => {
    setOwnerPassword(newPassword);
    alert("Owner password updated successfully!");
  };

  const factoryReset = async () => {
    const confirmation = prompt("TYPE 'RESET' TO CONFIRM FACTORY RESET.\nThis will delete ALL orders, user profiles, and local data.\nTHIS CANNOT BE UNDONE.");

    if (confirmation !== 'RESET') {
      alert("Reset cancelled.");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting Factory Reset...");

      // 1. Delete all Order Items
      const { error: itemsError } = await supabase.from('order_items').delete().neq('id', 0); // Delete all
      if (itemsError) throw itemsError;

      // 2. Delete all Orders
      const { error: ordersError } = await supabase.from('orders').delete().neq('id', 0);
      if (ordersError) throw ordersError;

      // 3. Delete all Profiles (Users)
      const { error: profilesError } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all valid UUIDs
      if (profilesError) throw profilesError;

      console.log("Database cleared.");

      // 4. Clear Local Storage
      window.localStorage.clear();

      alert("Factory Reset Complete. The application will now reload.");
      window.location.reload();

    } catch (e) {
      console.error("Factory Reset Failed:", e);
      alert("Factory Reset Failed: " + e.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();

      // Reset local state
      setUserProfile({ name: '', email: '', location: '', homeAddress: '', phone: '', orders: [] });
      setCart([]);
      setWishlist([]);
      setUserRole('user');

      // window.location.hrefOrNavigate could be handled by component, but state reset is key here.
      // The auth listener in useEffect will also trigger syncUser(null), but explicit reset is safer for UX immediate feel.
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };



  const value = {
    userRole,
    setUserRole,
    products,
    loading,
    authLoading,
    addProduct,
    deleteProduct,
    updateProduct,
    updateProductStock,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    userProfile,
    updateUserProfile,
    ownerSettings,
    placeOrder,
    wishlist,
    toggleWishlist,
    serviceablePincodes,
    addPincode,
    removePincode,
    updateOrderStatus,
    contactInfo,
    updateContactInfo,
    deleteOrder,
    handleSignOut,
    verifyOwnerPassword, // New
    updateOwnerPassword, // New
    factoryReset // New
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
