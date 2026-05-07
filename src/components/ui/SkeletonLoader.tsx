import styles from './SkeletonLoader.module.css';

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.titleLine} />
        <div className={styles.descLine} />
        <div className={styles.descLineShort} />
      </div>
      <div className={styles.footer}>
        <div className={styles.priceLine} />
        <div className={styles.btnLine} />
      </div>
    </div>
  );
}

export function CatalogSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem' }}>
      {/* Título de sección simulado */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className={styles.skeleton} style={{ height: '36px', width: '180px', margin: '0 auto 1rem' }} />
        <div className={styles.skeleton} style={{ height: '16px', width: '340px', margin: '0 auto 0.5rem' }} />
        <div className={styles.skeleton} style={{ height: '16px', width: '260px', margin: '0 auto' }} />
      </div>

      {/* Una sección con su título */}
      <div className={styles.sectionTitle} />

      {/* Grid de cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '2rem',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className={styles.heroSkeleton}>
      <div className={styles.heroTitle} />
      <div className={styles.heroSubtitle} />
      <div className={styles.heroBtn} />
    </div>
  );
}
