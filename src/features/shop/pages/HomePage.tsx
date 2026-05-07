import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ContactSection } from '../components/ContactSection';
import { CatalogSkeleton } from '../../../components/ui/SkeletonLoader';
import { catalogService } from '../../../services/api/catalog';
import type { Section, Product, ContactConfig } from '../../../core/types/catalog';
import { useCartStore } from '../../cart/store/cartStore';
import styles from './CatalogPage.module.css';

export default function HomePage() {
  const [contact, setContact] = useState<ContactConfig | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactData, sectionsData, productsData] = await Promise.all([
          catalogService.getContact(),
          catalogService.getSections(),
          catalogService.getProducts(),
        ]);
        setContact(contactData);
        setSections(Array.isArray(sectionsData) ? sectionsData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CatalogSkeleton count={6} />;

  const activeSections = sections.filter(s => s.isActive);

  return (
    <div className={styles.page}>

      {/* Encabezado del catálogo */}
      <div className={styles.catalogHeader}>
        <span className={styles.eyebrow}>Lo que preparamos</span>
        <h1 className={styles.catalogTitle}>Nuestro menú</h1>
        <div className={styles.divider}><div className={styles.dividerDot} /></div>
        <p className={styles.catalogSubtitle}>
          Elaborado con ingredientes de primera calidad y mucho amor.
        </p>
      </div>

      {/* Navegación por secciones */}
      {activeSections.length > 1 && (
        <nav className={styles.sectionNav}>
          {activeSections.map(s => (
            <a key={s.id} href={`#seccion-${s.slug}`} className={styles.sectionNavLink}>
              {s.name}
            </a>
          ))}
        </nav>
      )}

      {/* Productos por sección */}
      <div className={styles.catalogBody}>
        {activeSections.map(section => {
          const sectionProducts = products.filter(p => p.sectionId === section.id);
          if (sectionProducts.length === 0) return null;
          return (
            <section key={section.id} className={styles.sectionBlock} id={`seccion-${section.slug}`}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{section.name}</h2>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.productsGrid}>
                {sectionProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addItemToCart}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {contact && <ContactSection contact={contact} />}
    </div>
  );
}
