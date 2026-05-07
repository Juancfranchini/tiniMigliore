import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import logoheader from '../../assets/logoheader.png';
import styles from './LandingLayout.module.css';

export default function LandingLayout() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerInner}>
          <Link to="/">
            <img src={logoheader} alt="Tini Migliore" className={styles.logo} />
          </Link>
          <nav className={styles.nav}>
            <a href="#sobre-tini" className={styles.navLink}>Nosotros</a>
            <a href="#contacto" className={styles.navLink}>Contacto</a>
            <Link to="/catalogo" className={styles.navCta}>Ver Catálogo</Link>
          </nav>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
