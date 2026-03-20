import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { catalogService } from '../../../services/api/catalog';
import type { BannerConfig, ContactConfig } from '../../../core/types/catalog';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import type { CloudinaryImageDetails } from '../../../core/types/cloudinary';
import { Save, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input } from '../../../components/ui/Input';

export default function AdminLandingPage() {
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [contact, setContact] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, contactData] = await Promise.all([
          catalogService.getBanner(),
          catalogService.getContact()
        ]);
        setBanner(bannerData);
        setContact(contactData);
      } catch (error) {
        console.error("Error fetching landing config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;
    setSaving(true);
    try {
      await catalogService.updateBanner(banner);
      toast.success('Banner guardado correctamente.');
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el banner.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setSaving(true);
    try {
      await catalogService.updateContact(contact);
      toast.success('Contacto guardado correctamente.');
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar contacto.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando configuración...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Landing Page
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Administrá el contenido visible en la página principal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
        
        {/* Banner Hero */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={20} /> Banner Principal
            </CardTitle>
            <CardDescription>
              La imagen principal que se ve al entrar al sitio. Recomendamos usar fotos en alta resolución.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {banner && (
              <form onSubmit={handleSaveBanner} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Imagen del Banner</label>
                  <ImageUploader 
                    currentImageUrl={banner.imageUrl}
                    recommendedText="Relación 16:7, sugerido 1600x700 px"
                    onUploadSuccess={(details: CloudinaryImageDetails) => {
                      setBanner({ ...banner, imageUrl: details.imageUrl, imageDetails: details });
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Título Principal</label>
                      <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input type="checkbox" checked={banner.showTitle} onChange={(e) => setBanner({ ...banner, showTitle: e.target.checked })} /> Mostrar
                      </label>
                    </div>
                    <Input 
                      value={banner.title || ''} 
                      onChange={(e) => setBanner({ ...banner, title: e.target.value })} 
                      placeholder="Ej. Sabor con intención..." 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Subtítulo</label>
                      <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input type="checkbox" checked={banner.showSubtitle} onChange={(e) => setBanner({ ...banner, showSubtitle: e.target.checked })} /> Mostrar
                      </label>
                    </div>
                    <textarea 
                      value={banner.subtitle || ''} 
                      onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })} 
                      placeholder="Breve descripción..."
                      rows={2}
                      style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Texto del Botón (CTA)</label>
                      <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input type="checkbox" checked={banner.showCta} onChange={(e) => setBanner({ ...banner, showCta: e.target.checked })} /> Mostrar
                      </label>
                    </div>
                    <Input 
                      value={banner.callToActionText || ''} 
                      onChange={(e) => setBanner({ ...banner, callToActionText: e.target.value })} 
                      placeholder="Ej. Ver Colección" 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Enlace del Botón</label>
                    <Input 
                      value={banner.callToActionUrl || ''} 
                      onChange={(e) => setBanner({ ...banner, callToActionUrl: e.target.value })} 
                      placeholder="Ej. /#seccion-postres" 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <input
                    type="checkbox"
                    id="bannerActive"
                    checked={banner.isActive}
                    onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                  />
                  <label htmlFor="bannerActive" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Campaña Activa (Mostrar este banner en la tienda)</label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                   <button
                     type="submit"
                     disabled={saving}
                     className="button primary"
                     style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                   >
                     <Save size={18} />
                     {saving ? 'Guardando...' : 'Guardar Banner'}
                   </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Sección Contacto */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} /> Sección Contacto
            </CardTitle>
            <CardDescription>
              Configurá el texto que aparece en la sección de Contacto y su imagen adjunta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contact && (
              <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Texto de Contacto</label>
                  <textarea
                    value={contact.text}
                    onChange={(e) => setContact({ ...contact, text: e.target.value })}
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Imagen de Contacto</label>
                  <ImageUploader 
                    currentImageUrl={contact.imageUrl}
                    recommendedText="Relación 4:5, sugerido 1200x1500 px"
                    onUploadSuccess={(details: CloudinaryImageDetails) => {
                      setContact({ ...contact, imageUrl: details.imageUrl, imageDetails: details });
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="contactActive"
                    checked={contact.isActive}
                    onChange={(e) => setContact({ ...contact, isActive: e.target.checked })}
                  />
                  <label htmlFor="contactActive" style={{ fontSize: '0.875rem' }}>Sección Activa</label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                   <button
                     type="submit"
                     disabled={saving}
                     className="button primary"
                     style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                   >
                     <Save size={18} />
                     {saving ? 'Guardando...' : 'Guardar Contacto'}
                   </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
