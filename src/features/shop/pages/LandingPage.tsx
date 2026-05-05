import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../admin/store/settingsStore';
import logoheader from '../../../assets/logoheader.png';
import contactoImg from '../../../assets/contacto.png';
import styles from './LandingPage.module.css';
import { Instagram, Smartphone, PlaySquare, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const contactSettings = settings?.contact;

  const scrollToAbout = () => {
    document.getElementById('sobre-tini')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <img src={logoheader} alt="Tini Migliore" className={styles.heroLogo} />
          <p className={styles.heroTagline}>Pastelería artesanal con alma</p>
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
            <h2 className={styles.aboutTitle}>Hecha con amor,<br />pensada en vos</h2>
            <div className={styles.divider} />
            <p className={styles.aboutParagraph}>
              Soy Tini, chef pastelera profesional. Cada torta, cada caja, cada alfajor que sale de mi cocina lleva tiempo, técnica y mucho cariño. No hago pastelería en serie — hago piezas únicas para momentos únicos.
            </p>
            <p className={styles.aboutParagraph}>
              Trabajo con ingredientes de primera calidad y elaboración artesanal. Desde una merienda especial hasta el postre de tu evento más importante, me encargo de que cada bocado sea una experiencia.
            </p>
          </div>
          <div className={styles.aboutImageWrap}>
            <img src={contactoImg} alt="Tini Migliore en su pastelería" className={styles.aboutImage} />
          </div>
        </div>
      </section>

      {/* ── ESPECIALIDADES ── */}
      <section className={styles.specialties}>
        <div className={styles.sectionInner}>
          <span className={styles.eyebrow}>Lo que hago</span>
          <h2 className={styles.sectionTitle}>Mis especialidades</h2>
          <div className={styles.cardsGrid}>
            {[
              { emoji: '🎂', title: 'Tortas de diseño', desc: 'Para cumpleaños, casamientos y celebraciones. Personalizadas a tu gusto.' },
              { emoji: '🍫', title: 'Bombones & tabletas', desc: 'Chocolate de primera selección, rellenos artesanales únicos.' },
              { emoji: '🥐', title: 'Cajas de degustación', desc: 'Alfajores, sablés y petit fours. Perfectas para regalar o compartir.' },
              { emoji: '🍰', title: 'Tartas & tarteletas', desc: 'Masa casera, rellenos de temporada. Lemon curd, frangipane, dulce de leche.' },
            ].map((item) => (
              <div key={item.title} className={styles.specialtyCard}>
                <span className={styles.cardEmoji}>{item.emoji}</span>
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
              <p>CABA y GBA. Coordinamos día y horario por WhatsApp.</p>
            </div>
            <div className={styles.deliveryCard}>
              <span className={styles.deliveryIcon}>🏠</span>
              <h3>Retiro en pastelería</h3>
              <p>Sin costo adicional. Zona Palermo / Villa del Parque.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA CATÁLOGO ── */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.ctaTitle}>¿Te dio hambre?</h2>
          <p className={styles.ctaSubtitle}>Explorá el catálogo completo y armá tu pedido.</p>
          <button className={styles.ctaBig} onClick={() => navigate('/catalogo')}>
            Ver Catálogo Completo
          </button>
        </div>
      </section>

      {/* ── CONTACTO / REDES ── */}
      <section className={styles.contact}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Encontrame en</h2>
          <div className={styles.socialRow}>
            <a
              href={contactSettings?.instagramUrl || 'https://www.instagram.com/tini.migliore/'}
              target="_blank" rel="noopener noreferrer"
              className={styles.socialItem}
            >
              <Instagram size={22} />
              <span>Instagram</span>
            </a>
            <a
              href={contactSettings?.whatsappUrl || 'https://wa.me/5491127238219'}
              target="_blank" rel="noopener noreferrer"
              className={styles.socialItem}
            >
              <Smartphone size={22} />
              <span>WhatsApp</span>
            </a>
            {(contactSettings?.tiktokUrl) && (
              <a
                href={contactSettings.tiktokUrl}
                target="_blank" rel="noopener noreferrer"
                className={styles.socialItem}
              >
                <PlaySquare size={22} />
                <span>TikTok</span>
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
