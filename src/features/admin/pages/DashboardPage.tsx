import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { orderService } from '../../../services/mock/order';
import { catalogService } from '../../../services/api/catalog';
import type { Order, OrderStatus } from '../../../core/types/order';
import type { Product } from '../../../core/types/catalog';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          orderService.getOrders(),
          catalogService.getProducts()
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const getStatusBadgeColor = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { bg: string, color: string, label: string }> = {
      'PENDING_CONFIRMATION': { bg: '#FFEDD5', color: '#9A3412', label: 'A Confirmar' },
      'PENDING': { bg: '#FEF3C7', color: '#92400E', label: 'Pendiente' },
      'PREPARING': { bg: '#DBEAFE', color: '#1E40AF', label: 'Preparando' },
      'SHIPPING': { bg: '#E0E7FF', color: '#3730A3', label: 'En Envío' },
      'DELIVERED': { bg: '#D1FAE5', color: '#065F46', label: 'Entregado' },
      'CANCELLED': { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelado' }
    };
    return statusConfig[status] || statusConfig['PENDING'];
  };

  // --- Metrics Calculations ---
  
  // 1. Total Revenue metrics (Excluding CANCELLED)
  const validOrders = orders.filter(o => o.status !== 'CANCELLED');
  
  const totalNetRevenue = validOrders.reduce((sum, order) => sum + (order.netRevenueExcludingShipping || order.total), 0);
  const totalShippingCollected = validOrders.reduce((sum, order) => sum + (order.shippingFee || 0), 0);
  const totalShippingCost = validOrders.reduce((sum, order) => sum + (order.shippingCostToRemis || 0), 0);

  // 2. Orders Logic
  const totalOrders = orders.length;
  const pendingOrdersCount = orders.filter(
    o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  ).length;

  // 3. Unique Customers
  // Group by a normalized phone number (removing spaces and symbols just in case)
  const customerPhones = new Map<string, number>();
  orders.forEach(o => {
    const phone = o.buyerInfo.phone.replace(/\D/g, ''); // Extract only digits
    customerPhones.set(phone, (customerPhones.get(phone) || 0) + 1);
  });
  const uniqueCustomers = customerPhones.size;
  const recurringCustomers = Array.from(customerPhones.values()).filter(count => count > 1).length;
  const recurringPercentage = uniqueCustomers > 0 
    ? Math.round((recurringCustomers / uniqueCustomers) * 100) 
    : 0;

  // 4. Products
  const activeProductsCount = products.filter(p => p.isActive).length;

  // 5. Recent Orders
  const recentOrders = orders.slice(0, 5); // Assuming the service returns them sorted newest first

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando métricas...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Resumen de la tienda
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Métricas principales en tiempo real
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <CardHeader style={{ paddingBottom: '0.5rem' }}>
            <CardTitle style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Ingresos Totales
              <DollarSign size={16} color="var(--color-brand-morado)" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {formatPrice(totalNetRevenue)}
            </div>
            {totalOrders > 0 && (
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Envío Cobrado:</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{formatPrice(totalShippingCollected)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Costo al Remís:</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-error)' }}>-{formatPrice(totalShippingCost)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ paddingBottom: '0.5rem' }}>
            <CardTitle style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Pedidos Totales
              <ShoppingCart size={16} color="var(--color-brand-morado)" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {totalOrders}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-brand-morado)', marginTop: '0.25rem', fontWeight: 500 }}>
              {pendingOrdersCount} pendientes de entrega
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ paddingBottom: '0.5rem' }}>
            <CardTitle style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Clientes Únicos
              <Users size={16} color="var(--color-brand-morado)" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {uniqueCustomers}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {recurringPercentage}% compradores recurrentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader style={{ paddingBottom: '0.5rem' }}>
            <CardTitle style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Productos Activos
              <Package size={16} color="var(--color-brand-morado)" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {activeProductsCount}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
               En catálogo público
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabla Últimos Pedidos */}
      <Card>
         <CardHeader>
           <CardTitle>Últimos Pedidos</CardTitle>
         </CardHeader>
         <CardContent>
           {recentOrders.length === 0 ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                Aún no has recibido ningún pedido.
             </div>
           ) : (
             <div style={{ overflowX: 'auto' }}>
               <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                 <thead>
                   <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                     <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>ID</th>
                     <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Cliente</th>
                     <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Fecha</th>
                     <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Estado</th>
                     <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total</th>
                   </tr>
                 </thead>
                 <tbody>
                   {recentOrders.map(order => {
                     const badge = getStatusBadgeColor(order.status);
                     return (
                       <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                         <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: 'var(--color-brand-morado)' }}>{order.id}</td>
                         <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-primary)' }}>
                           <div style={{ fontWeight: 500 }}>{order.buyerInfo.name}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{order.buyerInfo.phone}</div>
                         </td>
                         <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text-secondary)' }}>{formatDate(order.createdAt)}</td>
                         <td style={{ padding: '1rem 0.5rem' }}>
                            <span style={{ 
                               backgroundColor: badge.bg, 
                               color: badge.color, 
                               padding: '0.25rem 0.5rem', 
                               borderRadius: 'var(--radius-full)', 
                               fontSize: '0.75rem', 
                               fontWeight: 600 
                            }}>
                               {badge.label}
                            </span>
                         </td>
                         <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{formatPrice(order.total)}</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
           )}
         </CardContent>
      </Card>
    </div>
  );
}
