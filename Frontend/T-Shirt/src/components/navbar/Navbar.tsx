import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Home,
  Store,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { useScroll } from "../../hooks/useScroll";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useUIStore } from "../../store/uiStore";
import ThemeToggle from "../theme/ThemeToggle";
import UserMenu from "./UserMenu";
import NotificationDropdown from "./NotificationDropdown";
import SearchModal from "./SearchModal";

const navLinks = [
  { label: "Shop", href: "/shop", icon: <Store size={18} /> },
  { label: "Collections", href: "/shop?category=OVERSIZED", icon: <Layers size={18} /> },
  { label: "New Arrivals", href: "/shop?category=NEW+ARRIVALS", icon: <Sparkles size={18} /> },
  { label: "About", href: "/about", icon: <Info size={18} /> },
];

export default function Navbar() {
  const scrolled = useScroll(20);
  const openCart = useUIStore((state) => state.openCart);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 lg:px-12">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group relative flex items-center gap-2 text-xl font-black uppercase tracking-widest text-[var(--color-foreground)]"
          >
            <span className="bg-amber-500 text-black px-2 py-0.5 rounded-lg text-sm font-black transition-transform group-hover:scale-105">
              AG
            </span>
            <span className="transition-colors group-hover:text-amber-500">
              T-SHIRT
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="relative text-xs font-extrabold uppercase tracking-widest text-[var(--color-foreground)] opacity-80 hover:opacity-100 hover:text-amber-500 transition-all py-1"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Action Icons */}
          <div className="hidden items-center gap-5 md:flex">
            <ThemeToggle />
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="transition-transform duration-300 hover:scale-110 text-[var(--color-foreground)]"
            >
              <Search size={20} strokeWidth={1.7} />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative transition-transform duration-300 hover:scale-110 text-[var(--color-foreground)]"
            >
              <Heart size={20} strokeWidth={1.7} />
              {wishlistItemsCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative transition-transform duration-300 hover:scale-110 text-[var(--color-foreground)]"
            >
              <ShoppingBag size={20} strokeWidth={1.7} />
              {totalCartItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-foreground)] px-1 text-[9px] text-[var(--color-background)] font-bold">
                  {totalCartItems}
                </span>
              )}
            </button>
            <NotificationDropdown />
            <UserMenu />
          </div>

          {/* Mobile: Right-side icons + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="p-1.5 text-[var(--color-foreground)]"
            >
              <Search size={20} strokeWidth={1.7} />
            </button>

            <button
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative p-1.5 text-[var(--color-foreground)]"
            >
              <ShoppingBag size={20} strokeWidth={1.7} />
              {totalCartItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-foreground)] px-1 text-[9px] text-[var(--color-background)] font-bold">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-foreground)]/8"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={22} strokeWidth={2} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={22} strokeWidth={2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Search Modal */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              key="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 z-40 flex h-full w-72 flex-col bg-[var(--color-surface)] shadow-2xl md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)]/60 px-5 py-4">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-lg font-black uppercase tracking-widest text-[var(--color-foreground)]"
                >
                  <span className="bg-amber-500 text-black px-2 py-0.5 rounded-lg text-xs font-black">
                    AG
                  </span>
                  <span>T-SHIRT</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-foreground)]/8"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                  Navigation
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-amber-500/10 hover:text-amber-500"
                    >
                      <Home size={18} className="opacity-70" />
                      Home
                    </Link>
                  </li>
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * (i + 1), duration: 0.2 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-amber-500/10 hover:text-amber-500"
                      >
                        <span className="opacity-70">{link.icon}</span>
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-[var(--color-border)]/60 pt-4">
                  <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Quick Access
                  </p>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Heart size={18} className="opacity-70" />
                    Wishlist
                    {wishlistItemsCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {wishlistItemsCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>

              {/* Drawer Footer — UserMenu */}
              <div className="border-t border-[var(--color-border)]/60 p-4">
                <UserMenu />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}