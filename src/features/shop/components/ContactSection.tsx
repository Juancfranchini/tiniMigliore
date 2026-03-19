import { Instagram, Smartphone, PlaySquare } from 'lucide-react';
import type { ContactConfig } from '../../../core/types/catalog';
import logocontacto from '../../../assets/contacto.png';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  contact: ContactConfig;
}

export function ContactSection({ contact }: ContactSectionProps) {
  if (!contact.isActive) return null;

  return (
    <section id="contacto" className={styles.sectionWrapper}>
      <div className={styles.gridContainer}>
        {/* Contenido de Texto */}
        <div className={styles.textCol}>
          <div>
            <h2 className={styles.title}>Contacto</h2>
            <div className={styles.divider} />
            <p className={styles.paragraph}>{contact.text}</p>
          </div>

          <div className={styles.socialRow}>
            <a
              href="https://www.instagram.com/tini.migliore/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialItem}
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://wa.me/c/5491127238219"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialItem}
            >
              <Smartphone size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@tini.migliore"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialItem}
            >
              <PlaySquare size={24} />
            </a>
          </div>
        </div>

        {/* Imagen */}
        <div className={styles.imageWrapper}>
          <img
            src={logocontacto}
            alt="Contacto Tini Migliore"
            className={styles.imageBox}
          />
        </div>
      </div>
    </section>
  );
}
