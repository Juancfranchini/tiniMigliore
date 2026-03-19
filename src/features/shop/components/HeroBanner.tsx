import { cn } from '../../../utils/cn';
import styles from './HeroBanner.module.css';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  callToActionText?: string;
  onCallToAction?: () => void;
  className?: string;
}

export function HeroBanner({
  title,
  subtitle,
  imageUrl,
  callToActionText,
  onCallToAction,
  className
}: HeroBannerProps) {
  return (
    <section className={cn(styles.heroSection, className)}>
      {/* Imagen de fondo */}
      <img
        src={imageUrl}
        alt={title}
        className={styles.bgImage}
      />
      
      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Contenido */}
      <div className={styles.contentContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            {title && (
              <h1 className={styles.title}>
                {title}
              </h1>
            )}

            {subtitle && (
              <p className={styles.subtitle}>
                {subtitle}
              </p>
            )}

            {callToActionText && onCallToAction && (
              <div style={{ display: 'flex' }}>
                <button
                  onClick={onCallToAction}
                  type="button"
                  className={styles.ctaButton}
                >
                  {callToActionText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}