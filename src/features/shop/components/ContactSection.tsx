import { FiInstagram } from 'react-icons/fi';
import { FaWhatsapp, FaTiktok } from 'react-icons/fa';
import type { ContactConfig } from '../../../core/types/catalog';
import logocontacto from '../../../assets/contacto.png';
import styles from './ContactSection.module.css';
import { useSettingsStore } from '../../admin/store/settingsStore';

interface ContactSectionProps {
  contact: ContactConfig;
}

export function ContactSection({ contact }: ContactSectionProps) {
  const settings = useSettingsStore(state => state.settings);
  if (!contact.isActive) return null;

  const contactSettings = settings?.contact;

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
            {contactSettings?.instagramUrl && (
              <a
                href={contactSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialItem}
              >
                <FiInstagram size={24} />
              </a>
            )}
            {contactSettings?.whatsappUrl && (
              <a
                href={contactSettings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialItem}
              >
                <FaWhatsapp size={24} />
              </a>
            )}
            {contactSettings?.tiktokUrl && (
              <a
                href={contactSettings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialItem}
              >
                <FaTiktok size={24} />
              </a>
            )}
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
