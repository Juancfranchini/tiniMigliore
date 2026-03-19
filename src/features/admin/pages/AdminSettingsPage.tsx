import { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import type { AppSettings } from '../../../types/settings';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Save } from 'lucide-react';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import { toast } from '../../../utils/toast';

const SectionContainer = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div style={{ 
    backgroundColor: 'var(--color-surface)', 
    borderRadius: 'var(--radius-lg)', 
    boxShadow: 'var(--shadow-sm)', 
    padding: '2rem',
    marginBottom: '2rem'
  }}>
    <h3 style={{ 
      fontFamily: 'var(--font-serif)', 
      fontSize: '1.5rem', 
      color: 'var(--color-brand-morado)', 
      marginTop: 0,
      marginBottom: '1.5rem',
      borderBottom: '1px solid var(--color-border)',
      paddingBottom: '0.5rem'
    }}>
      {title}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {children}
    </div>
  </div>
);

export default function AdminSettingsPage() {
  const { settings, isLoading, isSaving, loadSettings, updateSettings } = useSettingsStore();

  const [formData, setFormData] = useState<AppSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (isLoading || !formData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Cargando configuraciones...
      </div>
    );
  }

  const handleInputChange = (section: keyof AppSettings, field: string, value: string | boolean | number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await updateSettings(formData);
      toast.success('Configuraciones guardadas exitosamente');
    } catch (error) {
      toast.error('Error al guardar configuraciones');
    }
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-brand-morado)', margin: 0 }}>
          Configuraciones del Sistema
        </h2>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save size={16} style={{ marginRight: '0.5rem' }} /> 
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Columna Izquierda */}
        <div>
          <SectionContainer title="Marca (Branding)">
            <Input 
              label="Nombre de la Empresa"
              value={formData.branding.businessName}
              onChange={(e) => handleInputChange('branding', 'businessName', e.target.value)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Logo (Opcional)
              </label>
              <ImageUploader 
                currentImageUrl={formData.branding.logoUrl || ''}
                recommendedText="Relación 1:1 o 3:1, PNG transparente sugerido"
                onUploadSuccess={(details) => handleInputChange('branding', 'logoUrl', details.imageUrl)}
              />
            </div>
          </SectionContainer>

          <SectionContainer title="Contacto y Redes">
            <Input 
              label="Instagram URL"
              value={formData.contact.instagramUrl}
              onChange={(e) => handleInputChange('contact', 'instagramUrl', e.target.value)}
            />
            <Input 
              label="TikTok URL"
              value={formData.contact.tiktokUrl}
              onChange={(e) => handleInputChange('contact', 'tiktokUrl', e.target.value)}
            />
            <Input 
              label="WhatsApp (Número con código PAIS)"
              placeholder="Ej: 5491100000000"
              value={formData.contact.whatsappUrl}
              onChange={(e) => handleInputChange('contact', 'whatsappUrl', e.target.value)}
            />
            <Input 
              label="Email de Contacto"
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
            />
          </SectionContainer>

          <SectionContainer title="Google Maps (Ubicación)">
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '-1rem', marginBottom: '1rem' }}>
              Mostrá un mapa interactivo para facilitar la ubicación de tu local o punto de retiro.
            </p>
            <Input 
              label="Google Maps API Key (Pública)"
              value={formData.maps.googleMapsApiKey}
              onChange={(e) => handleInputChange('maps', 'googleMapsApiKey', e.target.value)}
            />
            <Input 
              label="Dirección del Local"
              placeholder="Ej: Av. Corrientes 1234, CABA"
              value={formData.maps.sellerAddress}
              onChange={(e) => handleInputChange('maps', 'sellerAddress', e.target.value)}
            />
            <Input 
              label="Etiqueta del Mapa (Opcional)"
              placeholder="Ej: Tini Migliore - Retiros"
              value={formData.maps.sellerAddressLabel || ''}
              onChange={(e) => handleInputChange('maps', 'sellerAddressLabel', e.target.value)}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={formData.maps.mapsEnabled}
                onChange={(e) => handleInputChange('maps', 'mapsEnabled', e.target.checked)}
              />
              <span style={{ color: 'var(--color-text-primary)' }}>Habilitar Mapa en Contacto / Checkout</span>
            </label>
          </SectionContainer>
        </div>

        {/* Columna Derecha */}
        <div>
          <SectionContainer title="Pedidos (Checkout)">
            <Input 
              label="Costo de Envío por defecto (ARS)"
              type="number"
              min={0}
              value={formData.checkout.defaultShippingFee}
              onChange={(e) => handleInputChange('checkout', 'defaultShippingFee', Number(e.target.value))}
            />
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.checkout.pickupEnabled}
                onChange={(e) => handleInputChange('checkout', 'pickupEnabled', e.target.checked)}
              />
              <span style={{ color: 'var(--color-text-primary)' }}>Habilitar Retiro por Local</span>
            </label>

            {formData.checkout.pickupEnabled && (
              <Input 
                label="Etiqueta para Retiro"
                placeholder="Ej: Retiro por nuestro local"
                value={formData.checkout.storePickupLabel || ''}
                onChange={(e) => handleInputChange('checkout', 'storePickupLabel', e.target.value)}
              />
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.checkout.deliveryEnabled}
                onChange={(e) => handleInputChange('checkout', 'deliveryEnabled', e.target.checked)}
              />
              <span style={{ color: 'var(--color-text-primary)' }}>Habilitar Envío a Domicilio</span>
            </label>
          </SectionContainer>

          <SectionContainer title="Notificaciones (Email)">
            <Input 
              label="Nombre del Remitente"
              value={formData.notifications.senderName}
              onChange={(e) => handleInputChange('notifications', 'senderName', e.target.value)}
            />
            <Input 
              label="Email de Soporte"
              type="email"
              value={formData.notifications.supportEmail}
              onChange={(e) => handleInputChange('notifications', 'supportEmail', e.target.value)}
            />
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={formData.notifications.orderConfirmationEnabled}
                onChange={(e) => handleInputChange('notifications', 'orderConfirmationEnabled', e.target.checked)}
              />
              <span style={{ color: 'var(--color-text-primary)' }}>Activar emails de confirmación de pedido</span>
            </label>

            <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-brand-crema)', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem' }}>
               <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                 <strong>Aviso de Seguridad para Envíos de Email:</strong><br />
                 La integración real de emails transaccionales (Ej: <em>Brevo</em>) requiere proteger la <strong>API Key / API Secret</strong> en un servidor backend o función Serverless. Para mantener este frontend seguro, no ingreses credenciales privadas aquí. Dejá esos valores configurados desde el lado seguro del servidor cuando habilites este componente.
               </p>
            </div>
          </SectionContainer>

          <SectionContainer title="Media (Cloudinary)">
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '-1rem', marginBottom: '1rem' }}>
              Estos valores se usarán en el futuro para conectar la API real. No incluir Secretos (API_SECRET).
            </p>
            <Input 
              label="Cloud Name"
              value={formData.media.cloudinaryCloudName}
              onChange={(e) => handleInputChange('media', 'cloudinaryCloudName', e.target.value)}
            />
            <Input 
              label="Upload Preset (Unsigned)"
              value={formData.media.cloudinaryUploadPreset}
              onChange={(e) => handleInputChange('media', 'cloudinaryUploadPreset', e.target.value)}
            />
            <Input 
              label="Folder"
              value={formData.media.cloudinaryFolder}
              onChange={(e) => handleInputChange('media', 'cloudinaryFolder', e.target.value)}
            />
          </SectionContainer>
        </div>

      </div>

    </div>
  );
}
