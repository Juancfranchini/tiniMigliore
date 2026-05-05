import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { catalogService } from '../../../services/api/catalog';
import type { BannerConfig, ContactConfig } from '../../../core/types/catalog';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import type { CloudinaryImageDetails } from '../../../core/types/cloudinary';
import { Save, Image as ImageIcon, MessageSquare, Palette, Layout, Star, Truck } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input } from '../../../components/ui/Input';
import { useSettingsStore } from '../store/settingsStore';
import type { AppSettings } from '../../../types/settings';

const DEFAULT_LANDING = {
  theme: 'dark' as 'dark' | 'light',
  heroTagline: 'Pastelería artesanal con alma',
  aboutTitle: 'Hecha con amor,\npensada en vos',
  aboutText1: 'Soy Tini, chef pastelera profesional. Cada torta, cada caja, cada alfajor que sale de mi cocina lleva tiempo, técnica y mucho cariño.',
  aboutText2: 'Trabajo con ingredientes de primera calidad y elaboración artesanal.',
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


function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</label>
      {hint && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{hint}</span>}
      {children}
    </div>
  );
}

function Textarea({ value, onChange, rows = 3, placeholder }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      style={{
        padding: '0.625rem 0.75rem',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        resize: 'vertical',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        lineHeight: 1.5,
      }}
    />
  );
}

export default function AdminLandingPage() {
  const { settings, updateSettings } = useSettingsStore();
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [contact, setContact] = useState<ContactConfig | null>(null);
  const [landing, setLanding] = useState(DEFAULT_LANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, contactData] = await Promise.all([
          catalogService.getBanner(),
          catalogService.getContact(),
        ]);
        setBanner(bannerData);
        setContact(contactData);
      } catch (error) {
        console.error('Error fetching landing config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (settings?.landing) {
      setLanding({ ...DEFAULT_LANDING, ...settings.landing });
    }
  }, [settings]);

  const saveLanding = async () => {
    setSaving('landing');
    try {
      const updated: AppSettings = {
        ...(settings as AppSettings),
        landing,
      };
      await updateSettings(updated);
      toast.success('Landing guardada correctamente.');
    } catch {
      toast.error('Error al guardar la landing.');
    } finally {
      setSaving(null);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;
    setSaving('banner');
    try {
      await catalogService.updateBanner(banner);
      toast.success('Banner guardado correctamente.');
    } catch {
      toast.error('Error al guardar el banner.');
    } finally {
      setSaving(null);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setSaving('contact');
    try {
      await catalogService.updateContact(contact);
      toast.success('Contacto guardado correctamente.');
    } catch {
      toast.error('Error al guardar contacto.');
    } finally {
      setSaving(null);
    }
  };

  const SaveBtn = ({ id, label }: { id: string; label: string }) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
      <button
        type="submit"
        disabled={saving === id}
        className="button primary"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Save size={16} />
        {saving === id ? 'Guardando...' : label}
      </button>
    </div>
  );

  if (loading) return <div style={{ padding: '2rem' }}>Cargando configuración...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Landing Page
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Editá el contenido y el estilo de la página principal pública.
        </p>
      </div>

      {/* ── TEMA ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} /> Tema visual
          </CardTitle>
          <CardDescription>Elegí entre modo oscuro y modo claro para toda la landing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setLanding({ ...landing, theme: t })}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: landing.theme === t
                    ? '2px solid var(--color-brand-acento)'
                    : '2px solid var(--color-border)',
                  cursor: 'pointer',
                  background: t === 'dark' ? '#1e1028' : '#fdf8f5',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '60px',
                  borderRadius: '8px',
                  background: t === 'dark'
                    ? 'linear-gradient(135deg, #3a2040 0%, #1e1028 100%)'
                    : 'linear-gradient(135deg, #f8eeee 0%, #fdf8f5 100%)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{t === 'dark' ? '🌙' : '☀️'}</span>
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: t === 'dark' ? '#fff' : '#2d1b35',
                }}>
                  {t === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
                {landing.theme === t && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-acento)', fontWeight: 600 }}>
                    ✓ Activo
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
            <button
              onClick={saveLanding}
              disabled={saving === 'landing'}
              className="button primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={16} />
              {saving === 'landing' ? 'Guardando...' : 'Guardar tema'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── HERO ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layout size={20} /> Sección Hero
          </CardTitle>
          <CardDescription>El primer impacto visual. Tagline y botones de entrada.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Tagline del hero" hint="Aparece debajo del logo en la pantalla principal">
              <Input
                value={landing.heroTagline}
                onChange={e => setLanding({ ...landing, heroTagline: e.target.value })}
                placeholder="Pastelería artesanal con alma"
              />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={saveLanding} disabled={saving === 'landing'} className="button primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={16} /> {saving === 'landing' ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── SOBRE TINI ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> Sección "Sobre mí"
          </CardTitle>
          <CardDescription>Tu historia y presentación personal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Título" hint="Podés usar \\n para salto de línea">
              <Input
                value={landing.aboutTitle}
                onChange={e => setLanding({ ...landing, aboutTitle: e.target.value })}
                placeholder="Hecha con amor, pensada en vos"
              />
            </Field>
            <Field label="Párrafo 1">
              <Textarea
                value={landing.aboutText1}
                onChange={v => setLanding({ ...landing, aboutText1: v })}
                rows={4}
                placeholder="Tu historia..."
              />
            </Field>
            <Field label="Párrafo 2">
              <Textarea
                value={landing.aboutText2}
                onChange={v => setLanding({ ...landing, aboutText2: v })}
                rows={3}
                placeholder="Tu propuesta de valor..."
              />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={saveLanding} disabled={saving === 'landing'} className="button primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={16} /> {saving === 'landing' ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── ESPECIALIDADES ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} /> Especialidades (4 cards)
          </CardTitle>
          <CardDescription>Las 4 especialidades que se muestran en la sección "Lo que hago".</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {([1, 2, 3, 4] as const).map(n => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-acento)' }}>Card {n}</span>
                <Field label="Título">
                  <Input
                    value={(landing as any)[`specialty${n}Title`]}
                    onChange={e => setLanding({ ...landing, [`specialty${n}Title`]: e.target.value })}
                  />
                </Field>
                <Field label="Descripción">
                  <Textarea
                    value={(landing as any)[`specialty${n}Desc`]}
                    onChange={v => setLanding({ ...landing, [`specialty${n}Desc`]: v })}
                    rows={2}
                  />
                </Field>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
            <button onClick={saveLanding} disabled={saving === 'landing'} className="button primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> {saving === 'landing' ? 'Guardando...' : 'Guardar especialidades'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── ZONA ENTREGA ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={20} /> Zona de entrega
          </CardTitle>
          <CardDescription>Descripción de envío a domicilio y retiro en pastelería.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="🛵 Envío a domicilio">
              <Textarea value={landing.deliveryZone} onChange={v => setLanding({ ...landing, deliveryZone: v })} rows={2} />
            </Field>
            <Field label="🏠 Retiro en pastelería">
              <Textarea value={landing.pickupZone} onChange={v => setLanding({ ...landing, pickupZone: v })} rows={2} />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={saveLanding} disabled={saving === 'landing'} className="button primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={16} /> {saving === 'landing' ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── CTA ── */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Llamado a la acción (CTA)</CardTitle>
          <CardDescription>El bloque antes del footer que lleva al catálogo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Título del CTA">
              <Input value={landing.ctaTitle} onChange={e => setLanding({ ...landing, ctaTitle: e.target.value })} placeholder="¿Te dio hambre?" />
            </Field>
            <Field label="Subtítulo del CTA">
              <Input value={landing.ctaSubtitle} onChange={e => setLanding({ ...landing, ctaSubtitle: e.target.value })} placeholder="Explorá el catálogo..." />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={saveLanding} disabled={saving === 'landing'} className="button primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={16} /> {saving === 'landing' ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── BANNER HERO ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} /> Banner Principal (imagen de fondo)
          </CardTitle>
          <CardDescription>La imagen de fondo del hero. Alta resolución recomendada.</CardDescription>
        </CardHeader>
        <CardContent>
          {banner && (
            <form onSubmit={handleSaveBanner} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ImageUploader
                currentImageUrl={banner.imageUrl}
                recommendedText="Relación 16:9, sugerido 1600x900 px"
                onUploadSuccess={(details: CloudinaryImageDetails) => {
                  setBanner({ ...banner, imageUrl: details.imageUrl, imageDetails: details });
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Título del banner">
                  <Input value={banner.title || ''} onChange={e => setBanner({ ...banner, title: e.target.value })} placeholder="Ej. Sabor con intención..." />
                </Field>
                <Field label="Subtítulo">
                  <Input value={banner.subtitle || ''} onChange={e => setBanner({ ...banner, subtitle: e.target.value })} placeholder="Breve descripción..." />
                </Field>
              </div>
              <SaveBtn id="banner" label="Guardar Banner" />
            </form>
          )}
        </CardContent>
      </Card>

      {/* ── CONTACTO ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> Imagen de Contacto
          </CardTitle>
          <CardDescription>Foto que aparece en la sección "Sobre mí".</CardDescription>
        </CardHeader>
        <CardContent>
          {contact && (
            <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ImageUploader
                currentImageUrl={contact.imageUrl}
                recommendedText="Relación 3:4, sugerido 900x1200 px"
                onUploadSuccess={(details: CloudinaryImageDetails) => {
                  setContact({ ...contact, imageUrl: details.imageUrl, imageDetails: details });
                }}
              />
              <SaveBtn id="contact" label="Guardar imagen" />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
