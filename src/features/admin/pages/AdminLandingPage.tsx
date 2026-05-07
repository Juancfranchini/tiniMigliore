import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { catalogService } from '../../../services/api/catalog';
import type { ContactConfig } from '../../../core/types/catalog';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import type { CloudinaryImageDetails } from '../../../core/types/cloudinary';
import { Save, Image as ImageIcon, MessageSquare, Layout, Star, Truck, Target } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input } from '../../../components/ui/Input';
import { useSettingsStore } from '../store/settingsStore';
import type { AppSettings } from '../../../types/settings';

const DEFAULT_LANDING = {
  heroImageUrl: '/hero-torta.jpg',
  aboutImageUrl: '',
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
  const [contact, setContact] = useState<ContactConfig | null>(null);
  const [landing, setLanding] = useState(DEFAULT_LANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    catalogService.getContact()
      .then(setContact)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (settings?.landing) setLanding({ ...DEFAULT_LANDING, ...settings.landing });
  }, [settings]);

  const saveLanding = async (section?: string) => {
    const key = section || 'landing';
    setSaving(key);
    try {
      await updateSettings({ ...(settings as AppSettings), landing });
      toast.success('Guardado correctamente.');
    } catch {
      toast.error('Error al guardar.');
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
      toast.success('Imagen guardada correctamente.');
    } catch {
      toast.error('Error al guardar imagen.');
    } finally {
      setSaving(null);
    }
  };

  const SaveBtn = ({ id }: { id: string }) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
      <button
        type="submit"
        disabled={saving === id}
        className="button primary"
        onClick={() => saveLanding(id)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Save size={16} />
        {saving === id ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );

  if (loading) return <div style={{ padding: '2rem' }}>Cargando...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Página principal
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Editá el contenido visible en la landing pública.
        </p>
      </div>

      {/* ── HERO — IMAGEN DE FONDO ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} /> Hero — Imagen de fondo
          </CardTitle>
          <CardDescription>La foto que se ve detrás del título principal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ImageUploader
              currentImageUrl={landing.heroImageUrl}
              recommendedText="Relación 16:9, sugerido 1920×1080 px"
              onUploadSuccess={(details: CloudinaryImageDetails) =>
                setLanding({ ...landing, heroImageUrl: details.imageUrl })
              }
            />
            <SaveBtn id="hero-image" />
          </div>
        </CardContent>
      </Card>

      {/* ── HERO — TEXTO ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layout size={20} /> Hero — Texto
          </CardTitle>
          <CardDescription>Tagline y subtítulo que aparecen sobre la imagen.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Tagline" hint="Aparece como texto pequeño en la sección de contacto">
              <Input
                value={landing.heroTagline}
                onChange={e => setLanding({ ...landing, heroTagline: e.target.value })}
                placeholder="Pastelería artesanal con alma"
              />
            </Field>
            <SaveBtn id="hero-text" />
          </div>
        </CardContent>
      </Card>

      {/* ── SOBRE MÍ — IMAGEN ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} /> Sobre mí — Foto
          </CardTitle>
          <CardDescription>Foto que aparece en la sección "Sobre mí" (relación 3:4 recomendada).</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ImageUploader
              currentImageUrl={landing.aboutImageUrl || contact?.imageUrl}
              recommendedText="Relación 3:4, sugerido 900×1200 px"
              onUploadSuccess={(details: CloudinaryImageDetails) =>
                setLanding({ ...landing, aboutImageUrl: details.imageUrl })
              }
            />
            <SaveBtn id="about-image" />
          </div>
        </CardContent>
      </Card>

      {/* ── SOBRE MÍ — TEXTO ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> Sobre mí — Texto
          </CardTitle>
          <CardDescription>Tu historia y presentación personal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Título" hint="Usá \\n para salto de línea">
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
              />
            </Field>
            <Field label="Párrafo 2">
              <Textarea
                value={landing.aboutText2}
                onChange={v => setLanding({ ...landing, aboutText2: v })}
                rows={3}
              />
            </Field>
            <SaveBtn id="about-text" />
          </div>
        </CardContent>
      </Card>

      {/* ── ESPECIALIDADES ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} /> Especialidades
          </CardTitle>
          <CardDescription>Las 4 cards de la sección "Lo que hago".</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {([1, 2, 3, 4] as const).map(n => (
              <div key={n} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.6fr',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                alignItems: 'start',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-brand-acento)' }}>
                    Especialidad {n}
                  </span>
                  <Field label="Título">
                    <Input
                      value={(landing as any)[`specialty${n}Title`]}
                      onChange={e => setLanding({ ...landing, [`specialty${n}Title`]: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Descripción">
                  <Textarea
                    value={(landing as any)[`specialty${n}Desc`]}
                    onChange={v => setLanding({ ...landing, [`specialty${n}Desc`]: v })}
                    rows={2}
                  />
                </Field>
              </div>
            ))}
            <SaveBtn id="specialties" />
          </div>
        </CardContent>
      </Card>

      {/* ── ZONA DE ENTREGA ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={20} /> Zona de entrega
          </CardTitle>
          <CardDescription>Textos de la sección de logística.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Envío a domicilio">
              <Textarea value={landing.deliveryZone} onChange={v => setLanding({ ...landing, deliveryZone: v })} rows={2} />
            </Field>
            <Field label="Retiro en pastelería">
              <Textarea value={landing.pickupZone} onChange={v => setLanding({ ...landing, pickupZone: v })} rows={2} />
            </Field>
            <SaveBtn id="delivery" />
          </div>
        </CardContent>
      </Card>

      {/* ── CTA ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} /> Llamado a la acción (CTA)
          </CardTitle>
          <CardDescription>El bloque que lleva al catálogo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Título">
              <Input value={landing.ctaTitle} onChange={e => setLanding({ ...landing, ctaTitle: e.target.value })} placeholder="¿Te dio hambre?" />
            </Field>
            <Field label="Subtítulo">
              <Input value={landing.ctaSubtitle} onChange={e => setLanding({ ...landing, ctaSubtitle: e.target.value })} />
            </Field>
            <SaveBtn id="cta" />
          </div>
        </CardContent>
      </Card>

      {/* ── IMAGEN "SOBRE MÍ" LEGACY (contact endpoint) ── */}
      {contact && (
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={20} /> Foto de contacto (legado)
            </CardTitle>
            <CardDescription>Imagen almacenada en el endpoint de contacto.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ImageUploader
                currentImageUrl={contact.imageUrl}
                recommendedText="Relación 3:4, sugerido 900×1200 px"
                onUploadSuccess={(details: CloudinaryImageDetails) =>
                  setContact({ ...contact, imageUrl: details.imageUrl, imageDetails: details })
                }
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <button type="submit" disabled={saving === 'contact'} className="button primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} />
                  {saving === 'contact' ? 'Guardando...' : 'Guardar imagen'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
