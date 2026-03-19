import { cn } from '../../../utils/cn';

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
    <section
      className={cn(className)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: 'clamp(600px, 85vh, 900px)',
        backgroundColor: '#e9e2e6',
        zIndex: 0
      }}
    >

      {/* Imagen de fondo */}
      <img
        src={imageUrl}
        alt={title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          // CAMBIA ESTA LÍNEA DE VUELTA A 'cover'
          objectFit: 'cover',
          objectPosition: 'center 60%', // Puedes mantener o ajustar esta línea si es necesario
          zIndex: 0
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(30, 15, 40, 0.85) 0%, rgba(30, 15, 40, 0.50) 50%, rgba(30, 15, 40, 0.10) 100%)',
          zIndex: 1
        }}
      />

      {/* Contenido */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem',
          color: 'var(--color-surface)'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            {title && (
              <h1
                style={{
                  color: 'var(--color-surface)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
                  fontWeight: 400,
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  margin: 0,
                  marginBottom: '1rem',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em'
                }}
              >
                {title}
              </h1>
            )}

            {subtitle && (
              <p
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                  maxWidth: '540px',
                  fontFamily: 'var(--font-sans)',
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  margin: 0,
                  marginBottom: callToActionText ? '1.5rem' : 0,
                  lineHeight: 1.6,
                  opacity: 0.95,
                  fontWeight: 300
                }}
              >
                {subtitle}
              </p>
            )}

            {callToActionText && onCallToAction && (
              <div style={{ display: 'flex' }}>
                <button
                  onClick={onCallToAction}
                  type="button"
                  style={{
                    backgroundColor: 'var(--color-brand-acento)',
                    color: 'var(--color-surface)',
                    fontFamily: 'var(--font-sans)',
                    padding: '1rem 3rem',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    letterSpacing: '0.02em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand-acento)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.25)';
                  }}
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