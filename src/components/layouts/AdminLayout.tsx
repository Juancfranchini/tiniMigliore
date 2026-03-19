import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, LogOut, LayoutTemplate, Settings, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../features/admin/store/authStore';
import logo from '../../assets/logoheader.png';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { to: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Pedidos' },
    { to: '/admin/products', icon: <Package size={20} />, label: 'Productos' },
    { to: '/admin/sections', icon: <Tag size={20} />, label: 'Secciones' },
    { to: '/admin/landing', icon: <LayoutTemplate size={20} />, label: 'Landing' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Configuraciones' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.layoutWrapper}>
      
      {/* Mobile Topbar */}
      <div className={styles.mobileTopbar}>
        <img src={logo} alt="Tini Migliore Panel" className={styles.mobileLogo} />
        <button onClick={toggleSidebar} className={styles.menuButton}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.open : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <img
            src={logo}
            alt="Tini Migliore Panel"
            className={styles.sidebarLogo}
          />
          <button onClick={closeSidebar} className={styles.closeSidebarBtn}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.navSection}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) => cn(styles.navLink, isActive && styles.active)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.logoutSection}>
           <button 
             onClick={() => {
               logout();
               navigate('/admin/login');
             }}
             className={styles.logoutBtn} 
           >
             <LogOut size={20} />
             Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
