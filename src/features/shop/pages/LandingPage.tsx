import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../admin/store/settingsStore';
import logoheaderDark from '../../../assets/logoheader.png';
import logoheaderLight from '../../../assets/logoheader2.png';
import contactoImg from '../../../assets/contacto.png';
import styles from './LandingPage.module.css';
import { Instagram, Smartphone, PlaySquare, ChevronDown } from 'lucide-react';

const DEFAULT = {
  theme: 'dark' as 'dark' | 'light',
  heroTagline: 'Pastelería artesanal con alma',
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

const SPECIALTIES_EMOJIS = ['🎂', '🍫', '🥐', '🍰'];

export default function LandingPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const contactSettings = settings?.contact;
  const L = { ...DEFAULT, ...(settings?.landing || {}) };
  const isDark = L.theme === 'dark';

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
    <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <img
            src={isDark ? logoheaderDark : logoheaderLight}
            alt="Tini Migliore"
            className={styles.heroLogo}
            fetchPriority="high"
          />
          <p className={styles.heroTagline}>{L.heroTagline}</p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/catalogo')}>
              Ver Catálogo
            </button>
            <button className={styles.ctaSecondary} onClick={scrollToAbout}>
              Conocer más
            </button>
          </div>
        </div>
        <button className={styles.scrollHint} onClick={scrollToAbout} aria-label="Scroll">
          <ChevronDown size={28} />
        </button>
      </section>

      {/* ── SOBRE TINI ── */}
      <section id="sobre-tini" className={styles.about}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <span className={styles.eyebrow}>Sobre mí</span>
            <h2 className={styles.aboutTitle}>
              {L.aboutTitle.split('\n').map((line, i) => (
                <span key={i}>{line}{i < L.aboutTitle.split('\n').length - 1 && <br />}</span>
              ))}
            </h2>
            <div className={styles.divider} />
            <p className={styles.aboutParagraph}>{L.aboutText1}</p>
            <p className={styles.aboutParagraph}>{L.aboutText2}</p>
          </div>
          <div className={styles.aboutImageWrap}>
            <img src={contactoImg} alt="Tini Migliore en su pastelería" className={styles.aboutImage} loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── ESPECIALIDADES ── */}
      <section className={styles.specialties}>
        <div className={styles.sectionInner}>
          <span className={styles.eyebrow}>Lo que hago</span>
          <h2 className={styles.sectionTitle}>Mis especialidades</h2>
          <div className={styles.cardsGrid}>
            {specialties.map((item, i) => (
              <div key={i} className={styles.specialtyCard}>
                <span className={styles.cardEmoji}>{SPECIALTIES_EMOJIS[i]}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONA DE ENTREGA ── */}
      <section className={styles.delivery}>
        <div className={styles.sectionInner}>
          <span className={styles.eyebrowLight}>Logística</span>
          <h2 className={styles.sectionTitleLight}>¿Llegamos a tu zona?</h2>
          <div className={styles.deliveryCards}>
            <div className={styles.deliveryCard}>
              <span className={styles.deliveryIcon}>🛵</span>
              <h3>Envío a domicilio</h3>
              <p>{L.deliveryZone}</p>
            </div>
            <div className={styles.deliveryCard}>
              <span className={styles.deliveryIcon}>🏠</span>
              <h3>Retiro en pastelería</h3>
              <p>{L.pickupZone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.ctaTitle}>{L.ctaTitle}</h2>
          <p className={styles.ctaSubtitle}>{L.ctaSubtitle}</p>
          <button className={styles.ctaBig} onClick={() => navigate('/catalogo')}>
            Ver Catálogo Completo
          </button>
        </div>
      </section>

      {/* ── CONTACTO / REDES ── */}
      <section className={styles.contact} id="contacto">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Encontrame en</h2>
          <div className={styles.socialRow}>
            {(contactSettings?.instagramUrl || 'https://www.instagram.com/tini.migliore/') && (
              <a href={contactSettings?.instagramUrl || 'https://www.instagram.com/tini.migliore/'} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
                <Instagram size={22} /><span>Instagram</span>
              </a>
            )}
            {(contactSettings?.whatsappUrl || 'https://wa.me/5491127238219') && (
              <a href={contactSettings?.whatsappUrl || 'https://wa.me/5491127238219'} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
                <Smartphone size={22} /><span>WhatsApp</span>
              </a>
            )}
            {contactSettings?.tiktokUrl && (
              <a href={contactSettings.tiktokUrl} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
                <PlaySquare size={22} /><span>TikTok</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Tini Migliore · Pastelería artesanal</p>
        <p className={styles.footerSub}>Tu momento dulce merece una obra de arte.</p>
      </footer>
    </div>
  );
}
