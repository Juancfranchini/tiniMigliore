import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../admin/store/settingsStore';
import contactoImg from '../../../assets/contacto.png';
import styles from './LandingPage.module.css';
import { Instagram, Smartphone, PlaySquare, ChevronDown, Moon, Sun } from 'lucide-react';

/* ── Default texts ────────────────── */
const DEFAULT = {
  heroSubtitle: 'Creamos dulces momentos con ingredientes reales y mucho amor.',
  aboutTitle: 'Hecha con amor,\npensada en vos',
  aboutText1: 'Soy Tini, chef pastelera profesional. Cada torta, cada caja, cada alfajor que sale de mi cocina lleva tiempo, técnica y mucho cariño. No hago pastelería en serie — hago piezas únicas para momentos únicos.',
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
  specialty3Desc: 'Alfajores, sablés y petit fours. Perfectas para regalar o compartir.',
  specialty4Title: 'Tartas & tarteletas',
  specialty4Desc: 'Masa casera, rellenos de temporada. Lemon curd, frangipane, dulce de leche.',
};

/* ── Íconos SVG línea (exactos al mockup) ── */
const IconCake = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="18" width="28" height="14" rx="1.5"/>
    <rect x="9" y="12" width="20" height="6" rx="1"/>
    <line x1="14" y1="12" x2="14" y2="18"/>
    <line x1="24" y1="12" x2="24" y2="18"/>
    <line x1="19" y1="12" x2="19" y2="18"/>
    <path d="M19 8 Q21 5 19 4 Q17 5 19 8"/>
  </svg>
);

const IconChocolate = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="10" width="28" height="18" rx="2"/>
    <line x1="5" y1="17" x2="33" y2="17"/>
    <line x1="5" y1="24" x2="33" y2="24"/>
    <line x1="14" y1="10" x2="14" y2="28"/>
    <line x1="24" y1="10" x2="24" y2="28"/>
  </svg>
);

const IconBox = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="14" width="28" height="18" rx="1.5"/>
    <path d="M5 14 L19 8 L33 14"/>
    <line x1="19" y1="8" x2="19" y2="32"/>
    <line x1="5" y1="20" x2="33" y2="20"/>
  </svg>
);

const IconTart = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 30 L19 8 L32 30 Z"/>
    <line x1="6" y1="30" x2="32" y2="30"/>
    <path d="M13 22 Q19 17 25 22"/>
  </svg>
);

const IconMoto = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="27" r="5"/>
    <circle cx="29" cy="27" r="5"/>
    <path d="M14 27 H24"/>
    <path d="M17 14 L22 22 H10 L12 18 L17 14Z"/>
    <path d="M22 14 H28 L32 20"/>
    <path d="M24 20 H32"/>
  </svg>
);

const IconHouse = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 18 L19 8 L31 18"/>
    <path d="M11 18 V32 H27 V18"/>
    <rect x="15" y="24" width="8" height="8" rx="0.5"/>
  </svg>
);

/* ── Component ─────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((s) => s.settings);
  const contactSettings = settings?.contact;
  const L = { ...DEFAULT, ...(settings?.landing || {}) };

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
    { Icon: IconCake,      title: L.specialty1Title, desc: L.specialty1Desc },
    { Icon: IconChocolate, title: L.specialty2Title, desc: L.specialty2Desc },
    { Icon: IconBox,       title: L.specialty3Title, desc: L.specialty3Desc },
    { Icon: IconTart,      title: L.specialty4Title, desc: L.specialty4Desc },
  ];

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : ''}`}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        {/* Texto vertical */}
        <span className={styles.heroVerticalText}>Pastelería Artesanal</span>

        {/* Columna izquierda */}
        <div className={styles.heroLeft}>
          <p className={styles.heroEyebrow}>Hecho con amor</p>

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

        {/* Columna derecha — foto torta */}
        <div className={styles.heroRight}>
          <img
            src="/hero-torta.jpg"
            alt="Torta artesanal Tini Migliore"
            className={styles.heroImage}
            fetchPriority="high"
          />
        </div>

        {/* Chevron */}
        <button className={styles.scrollHint} onClick={scrollToAbout} aria-label="Bajar">
          <ChevronDown size={22} />
        </button>

        {/* Toggle tema */}
        <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Cambiar tema">
          {isDark ? <><Sun size={13} /> Claro</> : <><Moon size={13} /> Oscuro</>}
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
            <img src={contactoImg} alt="Tini Migliore en su pastelería" className={styles.aboutImage} loading="lazy" />
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
            {specialties.map(({ Icon, title, desc }, i) => (
              <div key={i} className={styles.specialtyCard}>
                <div className={styles.cardIconWrap}>
                  <Icon />
                </div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{desc}</p>
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
              <div className={styles.deliveryIconWrap}><IconMoto /></div>
              <h3>Envío a domicilio</h3>
              <p>{L.deliveryZone}</p>
            </div>
            <div className={styles.deliveryCard}>
              <div className={styles.deliveryIconWrap}><IconHouse /></div>
              <h3>Retiro en pastelería</h3>
              <p>{L.pickupZone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{L.ctaTitle}</h2>
          <p className={styles.ctaSubtitle}>{L.ctaSubtitle}</p>
          <button className={styles.ctaBig} onClick={() => navigate('/catalogo')}>
            Ver Catálogo Completo
          </button>
        </div>
        <div className={styles.ctaImageWrap}>
          <img src="/hero-tarta.jpg" alt="Tarta artesanal" className={styles.ctaBgImage} loading="lazy" />
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section className={styles.contact} id="contacto">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Encontrame en</h2>
          <div className={styles.socialRow}>
            <a href={contactSettings?.instagramUrl || 'https://www.instagram.com/tini.migliore/'} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
              <Instagram size={17} /><span>Instagram</span>
            </a>
            <a href={contactSettings?.whatsappUrl || 'https://wa.me/5491127238219'} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
              <Smartphone size={17} /><span>WhatsApp</span>
            </a>
            {contactSettings?.tiktokUrl && (
              <a href={contactSettings.tiktokUrl} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
                <PlaySquare size={17} /><span>TikTok</span>
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
