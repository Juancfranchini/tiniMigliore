import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, LogOut, LayoutTemplate, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../features/admin/store/authStore';
import logo from '../../assets/logoheader.png';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { to: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Pedidos' },
    { to: '/admin/products', icon: <Package size={20} />, label: 'Productos' },
    { to: '/admin/sections', icon: <Tag size={20} />, label: 'Secciones' },
    { to: '/admin/landing', icon: <LayoutTemplate size={20} />, label: 'Landing' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Configuraciones' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
    <div
      style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--color-border)',
        textAlign: 'center'
      }}
    >
      <img
        src={logo}
        alt="Tini Migliore Panel"
        style={{
          width: '800px',
          height: 'auto',
          maxWidth: '100%',
          margin: '0 auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
        }}
      />
    </div>

        <nav style={{ flexGrow: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'button ghost',
                  isActive ? 'primary' : ''
                )
              }
              style={({ isActive }) => ({
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: isActive ? 'var(--color-brand-morado)' : 'transparent',
                color: isActive ? 'var(--color-surface)' : 'var(--color-text-primary)'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
           <button 
             onClick={() => {
               logout();
               navigate('/admin/login');
             }}
             className="button ghost" 
             style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', color: 'var(--color-error)' }}
           >
             <LogOut size={20} />
             Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
