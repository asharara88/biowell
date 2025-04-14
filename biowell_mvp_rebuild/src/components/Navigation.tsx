import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ShoppingCart, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useAuthStore } from '../store/authStore';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '../hooks/useTranslation';
import { useSupplementStore } from '../store/supplementStore';
import { toast } from 'react-toastify';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { t } = useTranslation();
  const { cart } = useSupplementStore();
  const isLandingPage = location.pathname === '/';
  
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.info('You have been signed out');
    } catch (error) {
      console.error('Failed to sign out:', error);
      toast.error('Failed to sign out');
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Simplified menu items
  const menuItems = [
    { to: "/dashboard", label: t('navigation.dashboard'), authRequired: true },
    { to: "/coach", label: t('navigation.coach'), authRequired: true },
    { to: "/marketplace", label: "Shop", authRequired: false },
    { to: "/articles", label: "Articles", authRequired: false },
    { to: "/about", label: t('navigation.about'), authRequired: false }
  ];

  // Filter menu items based on authentication status
  const filteredMenuItems = menuItems.filter(item => 
    !item.authRequired || (item.authRequired && user)
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg shadow-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center tracking-[2px] ltr">
              <span className="text-lg font-bold text-white">BIOW</span>
              <div className="mx-0">
                <Logo />
              </div>
              <span className="text-lg font-bold text-white">LL</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredMenuItems.map(item => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-white hover:text-biowellGreen transition-colors duration-200 text-sm font-semibold ${
                  location.pathname === item.to ? 'text-biowellGreen' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              
              {user && (
                <>
                  <Link to="/journey" className="relative">
                    <Award className="w-5 h-5 text-white hover:text-biowellGreen transition-colors" />
                  </Link>
                  
                  <Link to="/marketplace" className="relative">
                    <ShoppingCart className="w-5 h-5 text-white hover:text-biowellGreen transition-colors" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-biowellGreen text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="text-white hover:text-biowellGreen transition-colors duration-200 text-sm font-semibold flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('navigation.signOut')}
                  </button>
                </>
              )}
              
              {!user && (
                <Link
                  to="/auth"
                  className="bg-biowellGreen text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <>
                <Link to="/journey" className="relative">
                  <Award className="w-5 h-5 text-white hover:text-biowellGreen transition-colors" />
                </Link>
                <Link to="/marketplace" className="relative">
                  <ShoppingCart className="w-5 h-5 text-white hover:text-biowellGreen transition-colors" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-biowellGreen text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-biowellGreen focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
              {filteredMenuItems.map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`block px-3 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors duration-200 text-sm font-semibold ${
                    location.pathname === item.to ? 'bg-gray-800 text-biowellGreen' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-2 mt-2 border-t border-gray-800">
                <LanguageToggle />
              </div>
              
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors duration-200 text-sm font-semibold"
                >
                  {t('navigation.signOut')}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="block px-3 py-2 mt-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors text-sm font-semibold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}