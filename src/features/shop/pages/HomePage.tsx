import { useState, useEffect } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import { ContactSection } from '../components/ContactSection';
import { catalogService } from '../../../services/api/catalog';
import type { Section, Product, BannerConfig, ContactConfig } from '../../../core/types/catalog';
import { useCartStore } from '../../cart/store/cartStore';

export default function HomePage() {
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [contact, setContact] = useState<ContactConfig | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, contactData, sectionsData, productsData] = await Promise.all([
          catalogService.getBanner(),
          catalogService.getContact(),
          catalogService.getSections(),
          catalogService.getProducts()
        ]);
        
        setBanner(bannerData);
        setContact(contactData);
        setSections(sectionsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItemToCart(product);
  };

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-brand-lila)', fontSize: '1.25rem' }}>
          Cargando delicias...
        </p>
      </div>
    );
  }

  return (
    <div>
      {banner && banner.isActive && (
        <HeroBanner
          title={banner.showTitle ? banner.title || '' : ''}
          subtitle={banner.showSubtitle ? banner.subtitle : undefined}
          imageUrl={banner.imageUrl}
          callToActionText={banner.showCta ? banner.callToActionText : undefined}
          onCallToAction={() => {
            if (banner.callToActionUrl && banner.callToActionUrl.startsWith('/#')) {
              const elementId = banner.callToActionUrl.split('#')[1];
              const el = document.getElementById(elementId);
              el?.scrollIntoView({ behavior: 'smooth' });
            } else if (banner.callToActionUrl) {
              window.location.href = banner.callToActionUrl;
            } else {
              const el = document.getElementById('catalogo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}

      <div id="catalogo" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>MENÚ!</h2>
           <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
             Descubrí nuestras opciones artesanales elaboradas con ingredientes de la más alta calidad.
           </p>
        </div>

        {sections.filter(s => s.isActive).map(section => {
          const sectionProducts = products.filter(p => p.sectionId === section.id);
          
          if (sectionProducts.length === 0) return null;

          return (
            <section key={section.id} style={{ marginBottom: '4rem' }}>
              <h3 
                id={`seccion-${section.slug}`}
                style={{ 
                  fontSize: '1.75rem', 
                  borderBottom: '2px solid var(--color-brand-crema)', 
                  paddingBottom: '0.5rem',
                  marginBottom: '2rem'
                }}
              >
                {section.name}
              </h3>
              
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '2rem' 
                }}
              >
                {sectionProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                    onClick={(p) => console.log("Ver detalle", p)}
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
