import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../admin/store/settingsStore';

import contactoImg from '../../../assets/contacto.png';
import styles from './LandingPage.module.css';
import { Instagram, Smartphone, PlaySquare, ChevronDown, Moon, Sun } from 'lucide-react';

const DEFAULT = {
  heroTagline: 'Pastelería artesanal con alma',
  heroSubtitle: 'Creamos dulces momentos con ingredientes reales y mucho amor.',
  aboutTitle: 'Hecha con amor,\npensada en vos',
  aboutText1: 'Soy Tini, chef pastelera profesional. Cada torta, cada caja, cada detalle que sale de mi cocina lleva tiempo, técnica y mucho cariño. No hago pastelería en serie — hago piezas únicas para momentos únicos.',
  aboutText2: 'Trabajo con ingredientes de primera calidad y elaboración artesanal. Desde una merienda especial hasta el postre de tu evento más importante, me encargo de que cada bocado sea una experiencia.',
  deliveryZone: 'CABA y GBA. Coordinamos día y horario por WhatsApp.',
  pickupZone: 'Sin costo adicional. Zona Palermo / Villa del Parque.',
  ctaTitle: '¿Te dio hambre?',
  ctaSubtitle: 'Explorá el catálogo completo y armá tu pedido.',
  specialty1Title: 'Tortas de diseño',
  specialty1Desc: 'Para cumpleaños, casamientos y celebraciones. Personalizadas a tu gusto.',
  specialty2Title: 'Bombones & tabletas',
  specialty2Desc: 'Chocolate de primera selección, rellenos artesanales únicos.',
  specialty3Title: 'Cajas de degustación',
  specialty3Desc: 'Alfajores, cookies y más fours. Perfectas para regalar o compartir.',
  specialty4Title: 'Tartas & tarteletas',
  specialty4Desc: 'Masa casera, rellenos de temporada, lemon curd, frangipane, dulce de leche.',
};

const ICONS = [
  // Cake icon SVG
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 28h24v6H8z"/><path d="M6 22h28v6H6z"/><path d="M10 22v-4a4 4 0 014-4h12a4 4 0 014 4v4"/><path d="M20 14V8"/><circle cx="20" cy="6" r="2"/></svg>,
  // Box/chocolates
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="14" width="28" height="20" rx="2"/><path d="M6 20h28"/><path d="M20 14V8"/><path d="M14 8h12l2 6H12z"/></svg>,
  // Cookie/box
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="10" width="28" height="20" rx="3"/><path d="M6 18h28"/><circle cx="14" cy="24" r="2"/><circle cx="20" cy="14" r="1.5"/><circle cx="26" cy="24" r="2"/></svg>,
  // Tart/pie slice
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10 L34 30 H6 Z"/><path d="M6 30h28"/><path d="M13 22 Q20 16 27 22"/></svg>,
];

// Íconos de delivery
const IconMoto = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="28" r="5"/><circle cx="30" cy="28" r="5"/>
    <path d="M15 28h10M18 14l4 8H10l2-4 6-4z"/>
    <path d="M22 14h6l4 6"/>
  </svg>
);
const IconHouse = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 18l12-10 12 10"/>
    <path d="M12 18v14h16V18"/>
    <rect x="16" y="24" width="8" height="8" rx="1"/>
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((s) => s.settings);
  const contactSettings = settings?.contact;
  const L = { ...DEFAULT, ...(settings?.landing || {}) };

  // Dark mode controlado por el usuario (localStorage)
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('tini-theme') === 'dark'; } catch { return false; }
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try { localStorage.setItem('tini-theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  };

  const scrollToAbout = () => {
    document.getElementById('sobre-tini')?.scrollIntoView({ behavior: 'smooth' });
  };

  const specialties = [
    { title: L.specialty1Title, desc: L.specialty1Desc },
    { title: L.specialty2Title, desc: L.specialty2Desc },
    { title: L.specialty3Title, desc: L.specialty3Desc },
    { title: L.specialty4Title, desc: L.specialty4Desc },
  ];

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : ''}`}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />

        {/* Texto vertical lateral */}
        <span className={styles.heroVerticalText}>Pastelería Artesanal</span>

        <div className={styles.heroLeft}>
          <span className={styles.heroEyebrow}>Hecho con amor</span>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleRegular}>Pastelería artesanal</span>
            <span className={styles.heroTitleItalic}>con alma</span>
          </h1>

          <p className={styles.heroSubtitle}>{L.heroSubtitle}</p>

          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/catalogo')}>
              Ver Catálogo
            </button>
            <button className={styles.ctaSecondary} onClick={scrollToAbout}>
              Conocer más
            </button>
          </div>
        </div>

        {/* Imagen derecha */}
        <div className={styles.heroRight}>
          <div className={styles.heroImageWrap}>
            <img
              src="/hero-torta.jpg"
              alt="Torta Tini Migliore"
              className={styles.heroImage}
              fetchPriority="high"
            />
          </div>
          <div className={styles.heroDivider} />
        </div>

        <button className={styles.scrollHint} onClick={scrollToAbout} aria-label="Scroll">
          <ChevronDown size={24} />
        </button>

        {/* Toggle dark/light */}
        <button
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          style={{
            position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 20,
            background: 'rgba(111,91,114,0.15)', border: '1px solid rgba(111,91,114,0.2)',
            borderRadius: '999px', padding: '0.5rem 0.85rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            cursor: 'pointer', color: isDark ? 'rgba(240,232,240,0.7)' : 'var(--color-brand-morado)',
            fontSize: '0.75rem', fontFamily: 'Questrial, sans-serif',
            backdropFilter: 'blur(8px)', transition: 'all 0.2s',
          }}
        >
          {isDark ? <><Sun size={14} /> Claro</> : <><Moon size={14} /> Oscuro</>}
        </button>
      </section>

      {/* ── SOBRE MÍ ── */}
      <section id="sobre-tini" className={styles.about}>
        <div className={styles.aboutBgFloral} />
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <span className={styles.eyebrow}>Sobre mí</span>
            <h2 className={styles.aboutTitle}>
              {L.aboutTitle.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
            <div className={styles.divider} />
            <p className={styles.aboutParagraph}>{L.aboutText1}</p>
            <p className={styles.aboutParagraph}>{L.aboutText2}</p>
            <span className={styles.aboutSignature}>Tini ♡</span>
          </div>
          <div className={styles.aboutImageWrap}>
            <img src={contactoImg} alt="Tini en su pastelería" className={styles.aboutImage} loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── ESPECIALIDADES ── */}
      <section className={styles.specialties}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>Lo que hago</span>
          <h2 className={styles.sectionTitle}>Mis especialidades</h2>
          <div className={styles.sectionDivider}>
            <div className={styles.sectionDividerDot} />
          </div>
          <div className={styles.cardsGrid}>
            {specialties.map((item, i) => (
              <div key={i} className={styles.specialtyCard}>
                <div className={styles.cardIconWrap} style={{ color: 'var(--color-brand-morado)' }}>
                  {ICONS[i]}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY ── */}
      <section className={styles.delivery}>
        <div className={styles.deliveryInner}>
          <span className={styles.eyebrowLight}>Logística</span>
          <h2 className={styles.sectionTitleLight}>¿Llegamos a tu zona?</h2>
          <div className={styles.sectionDividerLight}>
            <div className={styles.sectionDividerLightDot} />
          </div>
          <div className={styles.deliveryCards}>
            <div className={styles.deliveryCard}>
              <div className={styles.deliveryIconWrap} style={{ color: 'rgba(255,255,255,0.85)' }}>
                <IconMoto />
              </div>
              <h3>Envío a domicilio</h3>
              <p>{L.deliveryZone}</p>
            </div>
            <div className={styles.deliveryCard}>
              <div className={styles.deliveryIconWrap} style={{ color: 'rgba(255,255,255,0.85)' }}>
                <IconHouse />
              </div>
              <h3>Retiro en pastelería</h3>
              <p>{L.pickupZone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <img src="/hero-tarta.jpg" alt="" className={styles.ctaBgImage} loading="lazy" />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{L.ctaTitle}</h2>
          <p className={styles.ctaSubtitle}>{L.ctaSubtitle}</p>
          <button className={styles.ctaBig} onClick={() => navigate('/catalogo')}>
            Ver Catálogo Completo
          </button>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section className={styles.contact} id="contacto">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Encontrame en</h2>
          <div className={styles.socialRow}>
            <a href={contactSettings?.instagramUrl || 'https://www.instagram.com/tini.migliore/'} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
              <Instagram size={18} /><span>Instagram</span>
            </a>
            <a href={contactSettings?.whatsappUrl || 'https://wa.me/5491127238219'} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
              <Smartphone size={18} /><span>WhatsApp</span>
            </a>
            {contactSettings?.tiktokUrl && (
              <a href={contactSettings.tiktokUrl} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
                <PlaySquare size={18} /><span>TikTok</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Tini Migliore · Pastelería artesanal</span>
        <span className={styles.footerSub}>Tu momento dulce merece una obra de arte.</span>
      </footer>
    </div>
  );
}
