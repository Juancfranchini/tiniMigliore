import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../features/cart/store/cartStore';
import { CartSidebar } from '../../features/cart/components/CartSidebar';
import logoheader from '../../assets/logoheader.png';
import styles from './ShopLayout.module.css';

export default function ShopLayout() {
  const { items, openCart } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }} onClick={closeMenu}>
            <img
              src={logoheader}
              alt="Tini Migliore Icon"
              className={styles.logoImage}
            />
          </Link>

          <nav className={styles.navSection}>
            <div className={styles.desktopLinks}>
              <Link to="/" className={styles.navLink}>Home</Link>
              <a href="/#catalogo" className={styles.navLink}>Menú</a>
              <a href="/#contacto" className={styles.navLink}>Contacto</a>
            </div>
            
            <button
              onClick={openCart}
              className={styles.cartButton}
              aria-label="Ver carrito"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>
                  {totalItems}
                </span>
              )}
            </button>

            <button 
              className={styles.menuToggleBtn} 
              onClick={toggleMenu}
              aria-label="Menú principal"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`${styles.mobileNavLayer} ${isMobileMenuOpen ? styles.open : ''}`}>
           <Link to="/" className={styles.navLink} onClick={closeMenu}>Home</Link>
           <a href="/#catalogo" className={styles.navLink} onClick={closeMenu}>Menú</a>
           <a href="/#contacto" className={styles.navLink} onClick={closeMenu}>Contacto</a>
        </div>
      </header>
      
      <main className={styles.mainContent}>
         <Outlet />
      </main>

      <footer className={styles.footerWrapper}>
        <p style={{ fontFamily: 'var(--font-serif)' }}>&copy; {new Date().getFullYear()} Tini Migliore. Todos los derechos reservados.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Tu momento dulce merece una obra de arte.</p>
      </footer>
      
      <CartSidebar />
    </div>
  );
}
