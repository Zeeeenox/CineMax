import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Film, User, Ticket, Home, Search } from 'lucide-react';
import { Button } from '../ui';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Movies', path: '/movies', icon: Film },
    { label: 'My Bookings', path: '/bookings', icon: Ticket },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center"
              >
                <Film className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-gradient-gold">CineMax</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative group"
                  >
                    <span className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary-400'
                        : 'text-secondary-300 hover:text-secondary-100'
                    }`}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary-500/10 rounded-lg border border-primary-500/30"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search & Profile */}
            <div className="hidden md:flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-48 px-4 py-2 pl-10 bg-secondary-800/50 border border-secondary-700 rounded-lg text-sm text-secondary-100 placeholder-secondary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-500" />
              </form>

              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-secondary-800 hover:bg-secondary-700 transition-colors"
                >
                  <User className="w-5 h-5 text-secondary-300" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-secondary-800"
          >
            <div className="container-custom py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full px-4 py-3 pl-10 bg-secondary-800/50 border border-secondary-700 rounded-lg text-secondary-100 placeholder-secondary-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
              </form>

              <div className="space-y-1">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-secondary-300 hover:bg-secondary-800 hover:text-secondary-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full">
                  <User className="w-5 h-5" />
                  My Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="container-custom py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link to="/" className="text-secondary-400 hover:text-secondary-200 transition-colors">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center gap-2">
              <span className="text-secondary-600">/</span>
              {isLast ? (
                <span className="text-secondary-200 font-medium">{value}</span>
              ) : (
                <Link
                  to={to}
                  className="text-secondary-400 hover:text-secondary-200 transition-colors capitalize"
                >
                  {value}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-secondary-800 bg-cinema-darker">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-gold">CineMax</span>
            </Link>
            <p className="text-sm text-secondary-500">
              Your premium cinema experience. Watch the latest movies in ultimate comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-secondary-200 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Now Showing', 'Coming Soon', 'IMAX', 'Dolby Cinema'].map(item => (
                <li key={item}>
                  <Link to="/movies" className="text-sm text-secondary-400 hover:text-secondary-200 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-secondary-200 mb-4">Support</h4>
            <ul className="space-y-2">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-sm text-secondary-400 hover:text-secondary-200 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-secondary-200 mb-4">Newsletter</h4>
            <p className="text-sm text-secondary-500 mb-4">
              Get updates on new releases and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-secondary-800 border border-secondary-700 rounded-lg text-sm text-secondary-100 placeholder-secondary-500"
              />
              <Button variant="primary" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-800 text-center text-sm text-secondary-500">
          <p>&copy; {new Date().getFullYear()} CineMax. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
