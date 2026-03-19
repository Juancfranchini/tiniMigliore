import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../features/cart/store/cartStore';
import { CartSidebar } from '../../features/cart/components/CartSidebar';
import logoheader from '../../assets/logoheader.png';

export default function ShopLayout() {
  const { items, openCart } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logoheader}
                alt="Tini Migliore Icon"
                style={{
                  width: '270px',
                  height: 'auto',
                  maxWidth: '100%',
                  margin: '0 auto',
                  objectFit: 'contain'
                }}
              />
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontFamily: 'var(--font-sans)' }}>
              <Link 
                to="/" 
                style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brand-morado)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
              >
                Home
              </Link>
              <a 
                href="/#catalogo" 
                style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brand-morado)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
              >
                Menú
              </a>
              <a 
                href="/#contacto" 
                style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brand-morado)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
              >
                Contacto
              </a>
            </div>
            <button
              onClick={openCart}
              style={{
                position: 'relative',
                padding: '0.5rem',
                color: 'var(--color-text-primary)'
              }}
              aria-label="Ver carrito"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'var(--color-brand-morado)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
      
      <main style={{ flexGrow: 1, backgroundColor: 'var(--color-brand-crema)' }}>
         <Outlet />
      </main>

      <footer
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '2rem 1rem',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <p style={{ fontFamily: 'var(--font-serif)' }}>&copy; {new Date().getFullYear()} Tini Migliore. Todos los derechos reservados.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Tu momento dulce merece una obra de arte.</p>
      </footer>
      
      <CartSidebar />
    </div>
  );
}
