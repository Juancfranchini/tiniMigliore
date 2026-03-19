import { Instagram, Smartphone, PlaySquare } from 'lucide-react';
import type { ContactConfig } from '../../../core/types/catalog';
import logocontacto from '../../../assets/contacto.png';

interface ContactSectionProps {
  contact: ContactConfig;
}

export function ContactSection({ contact }: ContactSectionProps) {
  if (!contact.isActive) return null;

  return (
    <section
      id="contacto"
      style={{
        padding: '6rem 1rem',
        backgroundColor: 'var(--color-surface)'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}
      >
        {/* Contenido de Texto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--color-brand-morado)',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}
            >
              Contacto
            </h2>
            <div
              style={{
                width: '60px',
                height: '3px',
                backgroundColor: 'var(--color-brand-acento)',
                marginBottom: '2rem'
              }}
            />
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap'
              }}
            >
              {contact.text}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            <a
              href="https://www.instagram.com/tini.migliore/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-crema)',
                color: 'var(--color-brand-morado)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-morado)';
                e.currentTarget.style.color = 'var(--color-surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-crema)';
                e.currentTarget.style.color = 'var(--color-brand-morado)';
              }}
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://wa.me/c/5491127238219"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-crema)',
                color: 'var(--color-brand-morado)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-morado)';
                e.currentTarget.style.color = 'var(--color-surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-crema)';
                e.currentTarget.style.color = 'var(--color-brand-morado)';
              }}
            >
              <Smartphone size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@tini.migliore"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-crema)',
                color: 'var(--color-brand-morado)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-morado)';
                e.currentTarget.style.color = 'var(--color-surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-crema)';
                e.currentTarget.style.color = 'var(--color-brand-morado)';
              }}
            >
              <PlaySquare size={24} />
            </a>
          </div>
        </div>

        {/* Imagen */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <img
            src={logocontacto}
            alt="Contacto Tini Migliore"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </section>
  );
}
