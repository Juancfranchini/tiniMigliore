import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { orderService } from '../../../services/api/order';
import type { Order, OrderStatus } from '../../../core/types/order';
import { toast } from '../../../utils/toast';
import { useSettingsStore } from '../store/settingsStore';
import { MapPin } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { settings, loadSettings } = useSettingsStore();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    loadSettings();
  }, [loadSettings]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdating(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      // Actualizamos solo esa orden en el estado local para fluidez
      const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      setOrders(updatedOrders);
      toast.success('Estado actualizado');
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("No se pudo actualizar el estado del pedido.");
    } finally {
      setUpdating(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const statusOptions: { value: OrderStatus, label: string }[] = [
    { value: 'PENDING_CONFIRMATION', label: 'A Confirmar' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'PREPARING', label: 'Preparando' },
    { value: 'SHIPPING', label: 'En Envío' },
    { value: 'DELIVERED', label: 'Entregado' },
    { value: 'CANCELLED', label: 'Cancelado' },
  ];

  const getStatusBadgeColor = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { bg: string, color: string }> = {
      'PENDING_CONFIRMATION': { bg: '#FFEDD5', color: '#9A3412' },
      'PENDING': { bg: '#FEF3C7', color: '#92400E' },
      'PREPARING': { bg: '#DBEAFE', color: '#1E40AF' },
      'SHIPPING': { bg: '#E0E7FF', color: '#3730A3' },
      'DELIVERED': { bg: '#D1FAE5', color: '#065F46' },
      'CANCELLED': { bg: '#FEE2E2', color: '#991B1B' }
    };
    return statusConfig[status] || statusConfig['PENDING'];
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Gestión de Pedidos
        </h2>
        <Button onClick={fetchOrders} variant="outline" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ minWidth: '900px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-brand-crema)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>ID Pedido</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Cliente</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Items (Cant.)</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Estado</th>
              <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {loading && orders.length === 0 ? (
               <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Cargando pedidos...</td></tr>
            ) : orders.length === 0 ? (
               <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Aún no hay pedidos realizados.</td></tr>
            ) : (
              orders.map((order) => {
                const badge = getStatusBadgeColor(order.status);
                
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: updating === order.id ? 'var(--color-background)' : 'transparent' }}>
                    
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-brand-morado)' }}>{order.id}</td>
                    
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{order.buyerInfo.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}><b>Tel:</b> {order.buyerInfo.phone}</div>
                      
                      <div style={{ marginTop: '0.5rem' }}>
                        {order.deliveryMethod === 'delivery' || order.buyerInfo.street ? (
                          <>
                            <div style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                              fontSize: '0.65rem', fontWeight: 600, backgroundColor: '#FEF08A', color: '#854D0E', 
                              padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem'
                            }}>
                              🚚 Envío a Domicilio
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                              {order.buyerInfo.street} {order.buyerInfo.number}, {order.buyerInfo.state}
                            </div>
                            
                            {/* Maps Logic */}
                            <div style={{ marginTop: '0.25rem' }}>
                              {!settings?.maps?.sellerAddress ? (
                                <span style={{ fontSize: '0.70rem', color: 'var(--color-error)' }}>
                                  ⚠️ Configurá la dirección del local en Ajustes para ver la ruta.
                                </span>
                              ) : (
                                (() => {
                                  const origin = encodeURIComponent(settings.maps.sellerAddress);
                                  const destination = encodeURIComponent(`${order.buyerInfo.street} ${order.buyerInfo.number}, ${order.buyerInfo.neighborhood ? order.buyerInfo.neighborhood + ', ' : ''}${order.buyerInfo.state || ''}`);
                                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
                                  
                                  return (
                                    <a 
                                      href={mapsUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{ 
                                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                        fontSize: '0.75rem', color: '#2563EB', textDecoration: 'none', fontWeight: 500 
                                      }}
                                    >
                                      <MapPin size={12} />
                                      Abrir ruta en Google Maps
                                    </a>
                                  );
                                })()
                              )}
                            </div>
                          </>
                        ) : (
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            fontSize: '0.65rem', fontWeight: 600, backgroundColor: '#E9D5FF', color: '#6B21A8', 
                            padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', marginTop: '0.25rem'
                          }}>
                            🏪 Retiro en Local
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td style={{ padding: '1rem', color: 'var(--color-text-primary)' }}>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.875rem' }}>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.quantity}x {item.productName}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-text-primary)' }}>
                      <div style={{ fontWeight: 600 }}>{formatPrice(order.total)}</div>
                      {(order.shippingFee || 0) > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                          (Envío: {formatPrice(order.shippingFee!)})
                        </div>
                      )}
                    </td>
                    
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={updating === order.id}
                        style={{
                           appearance: 'none',
                           backgroundColor: badge.bg,
                           color: badge.color,
                           border: `1px solid ${badge.color}33`,
                           padding: '0.35rem 1rem 0.35rem 0.5rem',
                           borderRadius: 'var(--radius-full)',
                           fontSize: '0.875rem',
                           fontWeight: 600,
                           cursor: 'pointer',
                           outline: 'none',
                           fontFamily: 'inherit'
                        }}
                      >
                         {statusOptions.map(opt => (
                           <option key={opt.value} value={opt.value}>{opt.label}</option>
                         ))}
                      </select>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{formatDate(order.createdAt)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
