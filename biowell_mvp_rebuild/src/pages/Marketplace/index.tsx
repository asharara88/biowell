import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, 
  Filter, 
  Search, 
  Thermometer,
  Smartphone,
  Waves,
  Droplets,
  Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SupplementCard from './SupplementCard';
import CartSidebar from './CartSidebar';
import RecommendedSupplements from './RecommendedSupplements';
import { useSupplementStore } from '../../store/supplementStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

export default function Marketplace() {
  const { user } = useAuthStore();
  const { supplements, addToCart, cart } = useSupplementStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products', icon: <Pill /> },
    { id: 'cognitive', name: 'Cognitive', icon: <Brain /> },
    { id: 'sleep', name: 'Sleep', icon: <Moon /> },
    { id: 'energy', name: 'Energy', icon: <Zap /> },
    { id: 'immunity', name: 'Immunity', icon: <Shield /> },
    { id: 'recovery', name: 'Recovery', icon: <Heart /> },
    { id: 'longevity', name: 'Longevity', icon: <Leaf /> },
    { id: 'devices', name: 'Wellness Devices', icon: <Smartphone /> }
  ];

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleAddToCart = (supplement: any) => {
    addToCart(supplement);
    toast.success(`${supplement.name} added to cart`);
  };

  const filteredSupplements = supplements
    .filter(supplement => 
      (activeCategory === 'all' || supplement.category === activeCategory) &&
      (searchQuery === '' || 
        supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplement.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'recommended':
        default:
          return b.recommended ? 1 : -1;
      }
    });

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black pt-16 pb-16">
      <Helmet>
        <title>Wellness Shop | BIOWELL</title>
        <meta name="description" content="Shop our curated selection of premium supplements, biohacking tools, and wellness devices personalized for your unique needs." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Wellness Shop</h1>
            <p className="text-gray-400">Personalized supplements and biohacking tools for your unique wellness journey</p>
          </div>
          <button 
            onClick={toggleCart}
            className="relative p-2 bg-biowellGreen rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-black" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Recommended Products Section */}
        <RecommendedSupplements onAddToCart={handleAddToCart} />

        {/* Search and Filter Bar */}
        <div className="bg-gray-900 rounded-xl p-4 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-biowellGreen focus:outline-none"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-gray-800 text-white px-4 py-2 pr-8 rounded-lg border border-gray-700 focus:border-biowellGreen focus:outline-none"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap mr-3 ${
                activeCategory === category.id
                  ? 'bg-biowellGreen text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700 transition-colors'
              }`}
            >
              {React.cloneElement(category.icon as React.ReactElement, {
                className: 'w-4 h-4'
              })}
              {category.name}
            </button>
          ))}
        </div>

        {/* Featured Biohacking Devices */}
        {activeCategory === 'all' || activeCategory === 'devices' ? (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Featured Biohacking & Wellness Devices</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Thermometer className="w-16 h-16 text-biowellGreen opacity-50" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-2">Smart Sleep Mattress Pad</h3>
                  <p className="text-gray-400 text-sm mb-3 flex-1">Temperature-controlled mattress pad for optimal sleep temperature regulation.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">$299.99</span>
                    <button 
                      onClick={() => {
                        handleAddToCart({
                          id: 'sleep-pad',
                          name: 'Smart Sleep Mattress Pad',
                          price: 299.99,
                          category: 'devices'
                        });
                      }}
                      className="p-2 rounded-lg bg-biowellGreen text-black hover:bg-opacity-90 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Waves className="w-16 h-16 text-biowellGreen opacity-50" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-2">Red Light Therapy Panel</h3>
                  <p className="text-gray-400 text-sm mb-3 flex-1">Professional-grade red light therapy for recovery, skin health, and cellular energy.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">$349.99</span>
                    <button 
                      onClick={() => {
                        handleAddToCart({
                          id: 'red-light',
                          name: 'Red Light Therapy Panel',
                          price: 349.99,
                          category: 'devices'
                        });
                      }}
                      className="p-2 rounded-lg bg-biowellGreen text-black hover:bg-opacity-90 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Droplets className="w-16 h-16 text-biowellGreen opacity-50" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-2">Portable Cold Plunge Tub</h3>
                  <p className="text-gray-400 text-sm mb-3 flex-1">Compact cold therapy solution for recovery, inflammation reduction, and mental resilience.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">$499.99</span>
                    <button 
                      onClick={() => {
                        handleAddToCart({
                          id: 'cold-plunge',
                          name: 'Portable Cold Plunge Tub',
                          price: 499.99,
                          category: 'devices'
                        });
                      }}
                      className="p-2 rounded-lg bg-biowellGreen text-black hover:bg-opacity-90 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Wind className="w-16 h-16 text-biowellGreen opacity-50" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-2">Advanced Air Purifier</h3>
                  <p className="text-gray-400 text-sm mb-3 flex-1">HEPA + molecular filtration with EMF protection for optimal indoor air quality.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">$249.99</span>
                    <button 
                      onClick={() => {
                        handleAddToCart({
                          id: 'air-purifier',
                          name: 'Advanced Air Purifier',
                          price: 249.99,
                          category: 'devices'
                        });
                      }}
                      className="p-2 rounded-lg bg-biowellGreen text-black hover:bg-opacity-90 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : null}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSupplements.map((supplement) => (
            <SupplementCard
              key={supplement.id}
              supplement={supplement}
              onAddToCart={() => handleAddToCart(supplement)}
            />
          ))}
        </div>

        {filteredSupplements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found matching your criteria.</p>
          </div>
        )}

        {/* Cart Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
      </div>
    </div>
  );
}

// Import these components at the top of the file
function Pill({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

function Brain({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function Moon({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function Zap({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function Shield({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function Heart({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function Leaf({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function ChevronDown({ className = "w-5 h-5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}