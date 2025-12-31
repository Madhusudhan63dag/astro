// import React,{useState} from 'react';
// import { useTranslation } from 'react-i18next';

// // Import your cow shelter images
// import cowImage1 from '../assets/cow-shelter-1.jpg';

// const GoshalaCharitySection = () => {
//   const { t } = useTranslation();

//   return (
//     <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Compact Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border-2 border-orange-300 mb-3">
//             <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
//             </svg>
//             <span className="text-orange-700 font-semibold text-sm">Sacred Service (Goshala Seva)</span>
//           </div>
          
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
//             Your Purchase Supports Cow Welfare
//           </h2>
          
//           <p className="text-lg text-gray-700 max-w-2xl mx-auto">
//             Every Kundali report includes a contribution to our partner Goshalas—supporting cow care, spiritual activities, and sacred traditions.
//           </p>
//         </div>

//         {/* Single Row Layout */}
//         <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          
//           {/* Image - Single Photo */}
//           <div className="relative">
//             <div className="absolute -inset-2 bg-gradient-to-r from-orange-200/40 to-amber-200/40 rounded-2xl blur-xl"></div>
//             <div className="relative">
//               <img 
//                 src={cowImage1} 
//                 alt="Cow shelter with peaceful cows"
//                 className="w-full h-64 object-cover rounded-2xl shadow-xl border-4 border-white"
//               />
//               <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-orange-200">
//                 <div className="text-xs text-gray-600">Includes</div>
//                 <div className="text-sm font-bold text-orange-600">Goshala Seva Contribution</div>
//               </div>
//             </div>
//           </div>

//           {/* Condensed Benefits */}
//           <div className="space-y-4">
//             <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border border-orange-100">
//               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
//                 🐄
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 mb-1">Cow Shelter Support</h4>
//                 <p className="text-gray-600 text-sm">Feeds and cares for indigenous Gir cows</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border border-amber-100">
//               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
//                 🕉️
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 mb-1">Spiritual Merit (Punya)</h4>
//                 <p className="text-gray-600 text-sm">Gain blessings through sacred cow service</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border border-yellow-100">
//               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
//                 📖
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 mb-1">200+ Page Kundali Report</h4>
//                 <p className="text-gray-600 text-sm">Expert Vedic astrology analysis delivered in 24hrs</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Trust Badge - Inline */}
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 max-w-xl mx-auto text-center">
//           <div className="flex items-center justify-center gap-3">
//             <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <div className="text-left">
//               <div className="font-bold text-gray-900">100% Transparent</div>
//               <p className="text-gray-600 text-sm">Every contribution is accounted for and used ethically</p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };


// const CowProductsSection = () => {
//   const { t } = useTranslation();
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   const productCategories = [
//     { id: 'all', name: 'All Products', icon: '🌿' },
//     { id: 'dairy', name: 'Dairy Products', icon: '🥛' },
//     { id: 'ayurvedic', name: 'Ayurvedic', icon: '💊' },
//     { id: 'cosmetic', name: 'Body Care', icon: '🧴' },
//     { id: 'household', name: 'Household', icon: '🏠' },
//     { id: 'spiritual', name: 'Spiritual', icon: '🕉️' }
//   ];

//   const products = [
//     {
//       id: 1,
//       name: 'Pure A2 Desi Cow Ghee',
//       category: 'dairy',
//       description: 'Hand-churned bilona ghee from Gir cow milk. Rich in nutrients and Omega-3',
//       price: 1099,
//       originalPrice: 1250,
//       unit: '1 Litre',
//       image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc1c4?w=400&h=400&fit=crop',
//       benefits: ['Boosts immunity', 'Improves digestion', 'Enhances memory'],
//       bestseller: true
//     },
//     {
//       id: 2,
//       name: 'Panchagavya Ghee',
//       category: 'ayurvedic',
//       description: 'Sacred ghee made from 5 cow products. Used in Ayurvedic healing',
//       price: 899,
//       unit: '500 ML',
//       image: 'https://images.unsplash.com/photo-1628408135638-887a6a49e797?w=400&h=400&fit=crop',
//       benefits: ['Spiritual healing', 'Ayurvedic therapy', 'Homa rituals'],
//       featured: true
//     },
//     {
//       id: 3,
//       name: 'Gomutra Ark (Distilled Cow Urine)',
//       category: 'ayurvedic',
//       description: 'Purified and distilled. Natural detoxifier and immunity booster',
//       price: 180,
//       unit: '500 ML',
//       image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
//       benefits: ['Detoxification', 'Skin disorders', 'Digestive health']
//     },
//     {
//       id: 4,
//       name: 'Cow Dung Dhoop Sticks',
//       category: 'spiritual',
//       description: 'Natural incense sticks made from cow dung. Purifies environment',
//       price: 150,
//       unit: '50 Sticks',
//       image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=400&fit=crop',
//       benefits: ['Air purification', 'Mosquito repellent', 'Spiritual ambiance']
//     },
//     {
//       id: 5,
//       name: 'Turmeric Cow Dung Soap',
//       category: 'cosmetic',
//       description: 'Handmade soap with cow dung and turmeric. Natural antiseptic properties',
//       price: 50,
//       unit: '75 GM',
//       image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop',
//       benefits: ['Anti-bacterial', 'Glowing skin', 'Chemical-free']
//     },
//     {
//       id: 6,
//       name: 'Cow Dung Cakes (Uplas)',
//       category: 'spiritual',
//       description: 'Traditional dung cakes for havan and religious ceremonies',
//       price: 140,
//       unit: '1 KG',
//       image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop',
//       benefits: ['Havan rituals', 'Eco-friendly fuel', 'Sacred smoke']
//     },
//     {
//       id: 7,
//       name: 'Desi Cow Milk Powder',
//       category: 'dairy',
//       description: 'Pure A2 milk powder from indigenous Gir cows',
//       price: 110,
//       unit: '100 GM',
//       image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
//       benefits: ['Easy to digest', 'Rich in calcium', 'Long shelf life']
//     },
//     {
//       id: 8,
//       name: 'Cow Urine Floor Cleaner',
//       category: 'household',
//       description: 'Natural disinfectant floor cleaner. Chemical-free cleaning',
//       price: 90,
//       originalPrice: 300,
//       unit: '500 ML',
//       image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop',
//       benefits: ['Anti-bacterial', 'Eco-friendly', 'Safe for kids']
//     },
//     {
//       id: 9,
//       name: 'Angamardanam Pain Relief Oil',
//       category: 'ayurvedic',
//       description: 'Ayurvedic oil with cow ghee base. Effective for joint and muscle pain',
//       price: 250,
//       unit: '100 ML',
//       image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop&q=80',
//       benefits: ['Joint pain relief', 'Muscle relaxation', 'Natural healing']
//     },
//     {
//       id: 10,
//       name: 'Cow Dung Vermicompost',
//       category: 'household',
//       description: 'Organic fertilizer made from cow dung. Perfect for gardening',
//       price: 200,
//       unit: '5 KG',
//       image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=400&fit=crop',
//       benefits: ['Organic farming', 'Soil enrichment', 'Plant growth']
//     },
//     {
//       id: 11,
//       name: 'Gomay Eco-Friendly Diyas',
//       category: 'spiritual',
//       description: 'Handcrafted diyas made from cow dung. Eco-friendly and sacred',
//       price: 80,
//       unit: '10 Pieces',
//       image: 'https://images.unsplash.com/photo-1605461263358-37e1e2dfe109?w=400&h=400&fit=crop',
//       benefits: ['Smokeless burning', 'Biodegradable', 'Festival special']
//     },
//     {
//       id: 12,
//       name: 'Panchagavya Face Pack',
//       category: 'cosmetic',
//       description: 'Natural face pack with cow milk, dung, and urine extracts',
//       price: 120,
//       unit: '100 GM',
//       image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop',
//       benefits: ['Anti-aging', 'Skin brightening', 'Chemical-free']
//     }
//   ];


//   const filteredProducts = selectedCategory === 'all' 
//     ? products 
//     : products.filter(p => p.category === selectedCategory);

//   return (
//     <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4 sm:px-6 lg:px-8">
//       <GoshalaCharitySection />
//       <div className=""> 
//         {/* Section Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border-2 border-green-300 mb-4">
//             <span className="text-green-700 font-semibold text-sm">Made from Sacred Cow Products</span>
//           </div>
          
//           <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4">
//             Panchagavya Products Collection
//           </h2>
          
//           <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
//             Every purchase supports our Goshala and provides 100% authentic products derived from indigenous Gir cows
//           </p>
//         </div>

//         {/* Category Filter */}
//         <div className="flex flex-wrap justify-center gap-3 mb-12">
//           {productCategories.map((cat) => (
//             <button
//               key={cat.id}
//               onClick={() => setSelectedCategory(cat.id)}
//               className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
//                 selectedCategory === cat.id
//                   ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
//                   : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:shadow-md'
//               }`}
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
//           {filteredProducts.map((product) => (
//             <div 
//               key={product.id}
//               className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-300 group relative"
//             >
//               {/* Product Image */}
//               <div className="relative h-56 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
//                 <img 
//                   src={product.image} 
//                   alt={product.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-5">
//                 <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
//                   {product.name}
//                 </h3>
                
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
//                   {product.description}
//                 </p>

//                 {/* Benefits */}
//                 <div className="flex flex-wrap gap-1 mb-4">
//                   {product.benefits.slice(0, 2).map((benefit, idx) => (
//                     <span 
//                       key={idx}
//                       className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-200"
//                     >
//                       {benefit}
//                     </span>
//                   ))}
//                   {product.benefits.length > 2 && (
//                     <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
//                       +{product.benefits.length - 2}
//                     </span>
//                   )}
//                 </div>

//                 {/* Price and CTA */}
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <div>
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-2xl font-bold text-gray-900">
//                         ₹{product.price}
//                       </span>
//                       {product.originalPrice && (
//                         <span className="text-sm text-gray-500 line-through">
//                           ₹{product.originalPrice}
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-xs text-gray-500">{product.unit}</span>
//                   </div>
                  
//                   <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Benefits Banner */}
//         <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
//           <div className="grid md:grid-cols-4 gap-6 text-center">
//             <div>
//               <h4 className="font-bold mb-1">100% Authentic</h4>
//               <p className="text-sm text-green-100">Certified pure Gir cow products</p>
//             </div>
//             <div>
//               <h4 className="font-bold mb-1">Chemical-Free</h4>
//               <p className="text-sm text-green-100">Natural and organic processing</p>
//             </div>
//             <div>
//               <h4 className="font-bold mb-1">Supports Goshala</h4>
//               <p className="text-sm text-green-100">Every purchase helps cow welfare</p>
//             </div>
//             <div>
//               <h4 className="font-bold mb-1">Fast Delivery</h4>
//               <p className="text-sm text-green-100">Delivered fresh to your doorstep</p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default CowProductsSection;

// GoshalaShopPage.jsx - EVERYTHING IN ONE FILE
import React, { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Import your images
import cowImage1 from '../assets/cow-shelter-1.jpg';
import API_CONFIG from '../pages/api';
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../config/prices';

const API_URL = API_CONFIG.API_URL;

// ==================== CART CONTEXT ====================
const CartContext = createContext();

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cowProductsCart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cowProductsCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const deleteFromCart = (productId) => {
    setCartItems((prev) => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, deleteFromCart, clearCart,
      getCartTotal, getCartCount, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

// ==================== LOAD RAZORPAY ====================
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="razorpay"]')) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
}

// ==================== CHARITY SECTION ====================
const GoshalaCharitySection = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border-2 border-orange-300 mb-3">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span className="text-orange-700 font-semibold text-sm">Sacred Service (Goshala Seva)</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Your Purchase Supports Cow Welfare
          </h2>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Every Kundali report includes a contribution to our partner Goshalas—supporting cow care, spiritual activities, and sacred traditions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-200/40 to-amber-200/40 rounded-2xl blur-xl"></div>
            <div className="relative">
              <img 
                src={cowImage1} 
                alt="Cow shelter"
                className="w-full h-64 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-orange-200">
                <div className="text-xs text-gray-600">Includes</div>
                <div className="text-sm font-bold text-orange-600">Goshala Seva</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border border-orange-100">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Cow Shelter Support</h4>
                <p className="text-gray-600 text-sm">Feeds and cares for indigenous Gir cows</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border border-amber-100">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Spiritual Merit (Punya)</h4>
                <p className="text-gray-600 text-sm">Gain blessings through sacred cow service</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border border-yellow-100">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">200+ Page Kundali Report</h4>
                <p className="text-gray-600 text-sm">Expert analysis delivered in 24hrs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <div className="font-bold text-gray-900">100% Transparent</div>
              <p className="text-gray-600 text-sm">Every contribution is accounted for</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== PRODUCTS SECTION ====================
const CowProductsSection = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const productCategories = [
    { id: 'all', name: 'All Products', icon: '🌿' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'ayurvedic', name: 'Ayurvedic', icon: '💊' },
    { id: 'cosmetic', name: 'Body Care', icon: '🧴' },
    { id: 'household', name: 'Household', icon: '🏠' },
    { id: 'spiritual', name: 'Spiritual', icon: '🕉️' }
  ];

  const products = [
    {
      id: 1, name: 'Pure A2 Desi Cow Ghee', category: 'dairy',
      description: 'Hand-churned bilona ghee from Gir cow milk',
      price: 1099, originalPrice: 1250, unit: '1 Litre',
      image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc1c4?w=400&h=400&fit=crop',
      benefits: ['Boosts immunity', 'Improves digestion'], bestseller: true
    },
    {
      id: 2, name: 'Panchagavya Ghee', category: 'ayurvedic',
      description: 'Sacred ghee made from 5 cow products',
      price: 899, unit: '500 ML',
      image: 'https://images.unsplash.com/photo-1628408135638-887a6a49e797?w=400&h=400&fit=crop',
      benefits: ['Spiritual healing', 'Ayurvedic therapy'], featured: true
    },
    {
      id: 3, name: 'Gomutra Ark', category: 'ayurvedic',
      description: 'Distilled cow urine - Natural detoxifier',
      price: 180, unit: '500 ML',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
      benefits: ['Detoxification', 'Immunity boost']
    },
    {
      id: 4, name: 'Cow Dung Dhoop Sticks', category: 'spiritual',
      description: 'Natural incense sticks - Purifies environment',
      price: 150, unit: '50 Sticks',
      image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=400&fit=crop',
      benefits: ['Air purification', 'Mosquito repellent']
    },
    {
      id: 5, name: 'Turmeric Cow Dung Soap', category: 'cosmetic',
      description: 'Handmade with turmeric - Antiseptic properties',
      price: 50, unit: '75 GM',
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop',
      benefits: ['Anti-bacterial', 'Glowing skin']
    },
    {
      id: 6, name: 'Cow Dung Cakes (Uplas)', category: 'spiritual',
      description: 'Traditional dung cakes for havan',
      price: 140, unit: '1 KG',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop',
      benefits: ['Havan rituals', 'Eco-friendly fuel']
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border-2 border-green-300 mb-4">
            <span className="text-green-700 font-semibold text-sm">Sacred Cow Products</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4">
            Panchagavya Products Collection
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            100% authentic products from indigenous Gir cows
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-100 hover:border-green-300 group relative"
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.bestseller && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    Bestseller
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Image */}
              <div className="h-56 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.benefits.map((benefit, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-200">
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{product.unit}</span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Banner */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl mt-12">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <h4 className="font-bold mb-1">100% Authentic</h4>
              <p className="text-sm text-green-100">Certified pure products</p>
            </div>
            <div>
              <h4 className="font-bold mb-1">Chemical-Free</h4>
              <p className="text-sm text-green-100">Natural processing</p>
            </div>
            <div>
              <h4 className="font-bold mb-1">Supports Goshala</h4>
              <p className="text-sm text-green-100">Helps cow welfare</p>
            </div>
            <div>
              <h4 className="font-bold mb-1">Fast Delivery</h4>
              <p className="text-sm text-green-100">Fresh to your door</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== CART SIDEBAR ====================
const CartSidebar = () => {
  const { cartItems, removeFromCart, addToCart, deleteFromCart, clearCart, getCartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Cart ({cartItems.length})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-xl font-semibold text-gray-700 mb-2">Cart is empty</p>
              <button onClick={() => setIsCartOpen(false)} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.unit}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white border rounded-lg">
                        <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-gray-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="px-3 font-semibold">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:bg-gray-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                        <button onClick={() => deleteFromCart(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold text-gray-900">₹{getCartTotal()}</span>
            </div>
            
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <button onClick={clearCart} className="w-full py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg">
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
};

// ==================== FLOATING CART BUTTON ====================
const FloatingCartButton = () => {
  const { getCartCount, setIsCartOpen } = useCart();
  const count = getCartCount();

  if (count === 0) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};

// ==================== CHECKOUT MODAL ====================
const CheckoutModal = ({ onClose }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [error, setError] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill all required fields');
      return;
    }

    setIsPaying(true);

    try {
      const totalAmount = getCartTotal();
      
      const orderRes = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: `cow_products_${Date.now()}`,
          notes: { service: 'cow_products', customer_name: formData.name }
        })
      });

      if (!orderRes.ok) throw new Error('Failed to create order');
      const orderData = await orderRes.json();

      await loadRazorpayScript();

      const key = orderData?.key ?? orderData?.key_id;
      const order = orderData?.order ?? orderData;
      const orderId = order?.id ?? order?.order_id;

      const rzp = new window.Razorpay({
        key,
        order_id: orderId,
        amount: order?.amount,
        currency: 'INR',
        name: 'SriAstroVeda - Cow Products',
        description: 'Sacred Cow Products',
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: '#10b981' },
        handler: async (paymentData) => {
          try {
            const verifyRes = await fetch(`${API_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature
              })
            });

            const verify = await verifyRes.json();
            if (!verify?.success) throw new Error('Payment verification failed');

            clearCart();
            sessionStorage.setItem('orderSuccess', JSON.stringify({
              orderId: paymentData.razorpay_order_id,
              amount: totalAmount,
              items: cartItems.length
            }));
            navigate('/thank-you');
          } catch (err) {
            setError(err.message);
          } finally {
            setIsPaying(false);
          }
        },
        modal: { ondismiss: () => setIsPaying(false) }
      });

      rzp.open();
    } catch (err) {
      setIsPaying(false);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block font-medium mb-2">Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Address *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required rows={3}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-2">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block font-medium mb-2">State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block font-medium mb-2">Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border">
              <h3 className="font-bold mb-3">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t">
                <span>Total</span>
                <span>₹{getCartTotal()}</span>
              </div>
            </div>

            <button type="submit" disabled={isPaying}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 shadow-lg">
              {isPaying ? 'Processing...' : `Pay ₹${getCartTotal()}`}
            </button>
          </form>
        </div>
      </div>

      {isPaying && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin" />
            <p className="text-lg font-semibold">Processing Payment...</p>
          </div>
        </div>
      )}
    </>
  );
};

// ==================== MAIN COMPONENT ====================
const GoshalaShopPage = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <GoshalaCharitySection />
        <CowProductsSection />
        <CartSidebar />
        <FloatingCartButton />
      </div>
    </CartProvider>
  );
};

export default GoshalaShopPage;
