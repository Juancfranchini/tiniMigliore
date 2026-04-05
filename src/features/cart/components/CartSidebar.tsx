import { X, Trash2, Plus, Minus, Truck, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../../admin/store/settingsStore';
import { Button } from '../../../components/ui/Button';

export function CartSidebar() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getSubtotal, deliveryMethod, setDeliveryMethod } = useCartStore();
  const settings = useSettingsStore(state => state.settings);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeCart}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 50 }}
      />

      {/* Sidebar panel */}
      <div 
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-surface)',
          zIndex: 51,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-brand-morado)' }}>Tu Carrito</h2>
          <button onClick={closeCart} style={{ color: 'var(--color-text-secondary)', padding: '0.5rem' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '2rem' }}>
              <p>Tu carrito está vacío.</p>
              <Button onClick={closeCart} variant="outline" style={{ marginTop: '1rem' }}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {items.map((item) => (
                <li key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} style={{ display: 'flex', gap: '1rem' }}>
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.productName} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                    />
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>{item.productName}</h4>
                      <button 
                         onClick={() => removeItem(item.productId)}
                         style={{ color: 'var(--color-error)', padding: '0.25rem' }}
                         aria-label="Remove item"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formatPrice(item.unitPrice)}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-brand-crema)', borderRadius: 'var(--radius-full)', padding: '0.125rem' }}>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--color-surface)' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, minWidth: '1rem', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--color-surface)' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span style={{ fontWeight: 600 }}>{formatPrice(item.totalLinePrice)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-brand-crema)' }}>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {settings?.checkout?.deliveryEnabled !== false && (
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  style={{
                    flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    borderRadius: 'var(--radius-md)', fontWeight: 600, transition: 'all 0.2s',
                    backgroundColor: deliveryMethod === 'delivery' ? 'var(--color-brand-morado)' : 'var(--color-surface)',
                    color: deliveryMethod === 'delivery' ? 'white' : 'var(--color-text-secondary)',
                    border: `1px solid ${deliveryMethod === 'delivery' ? 'var(--color-brand-morado)' : 'var(--color-border)'}`
                  }}
                >
                  <Truck size={18} /> Envío
                </button>
              )}
              {settings?.checkout?.pickupEnabled !== false && (
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  style={{
                    flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    borderRadius: 'var(--radius-md)', fontWeight: 600, transition: 'all 0.2s',
                    backgroundColor: deliveryMethod === 'pickup' ? 'var(--color-brand-morado)' : 'var(--color-surface)',
                    color: deliveryMethod === 'pickup' ? 'white' : 'var(--color-text-secondary)',
                    border: `1px solid ${deliveryMethod === 'pickup' ? 'var(--color-brand-morado)' : 'var(--color-border)'}`
                  }}
                >
                  <Store size={18} /> Retiro
                </button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-brand-morado)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <Button 
               style={{ width: '100%' }} 
               size="lg"
               onClick={() => {
                 closeCart();
                 navigate('/checkout');
               }}
            >
              Terminar Pedido
            </Button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </>
  );
}
