import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinary';
import type { CloudinaryImageDetails } from '../../core/types/cloudinary';
import { useSettingsStore } from '../../features/admin/store/settingsStore';

interface ImageUploaderProps {
  onUploadSuccess: (details: CloudinaryImageDetails) => void;
  onError?: (error: string) => void;
  recommendedText?: string;
  currentImageUrl?: string;
}

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUploadSuccess, 
  onError, 
  recommendedText,
  currentImageUrl 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { settings } = useSettingsStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setErrorMsg(null);
    if (!ALLOWED_FORMATS.includes(file.type)) {
      const msg = 'Formato no soportado. Usa JPG, PNG o WEBP.';
      setErrorMsg(msg);
      onError?.(msg);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      const msg = `El archivo supera los ${MAX_FILE_SIZE_MB}MB permitidos.`;
      setErrorMsg(msg);
      onError?.(msg);
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    const cloudName = settings?.media?.cloudinaryCloudName;
    const uploadPreset = settings?.media?.cloudinaryUploadPreset || 'tini_unsigned';
    const folder = settings?.media?.cloudinaryFolder;

    if (!cloudName) {
      const msg = 'Configuración incompleta: definí Cloud Name en Configuraciones.';
      setErrorMsg(msg);
      onError?.(msg);
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg(null);

      // Crear preview temporal
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);

      const details = await cloudinaryService.uploadImage(file, { cloudName, uploadPreset, folder });
      onUploadSuccess(details);
      
    } catch (error) {
       console.error(error);
       const msg = 'Ocurrió un error al subir la imagen.';
       setErrorMsg(msg);
       onError?.(msg);
    } finally {
       setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {recommendedText && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          {recommendedText}
        </p>
      )}

      {errorMsg && (
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', 
          backgroundColor: 'var(--color-error)', color: 'white', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' 
        }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {!previewUrl || errorMsg ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-brand-morado)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            backgroundColor: isDragging ? 'var(--color-brand-crema)' : 'var(--color-surface)',
            transition: 'all 0.2s',
            opacity: isUploading ? 0.7 : 1
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp"
            style={{ display: 'none' }}
            disabled={isUploading}
          />
          
          {isUploading ? (
            <>
              <Loader2 size={32} color="var(--color-brand-morado)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-text-primary)' }}>Subiendo imagen...</p>
            </>
          ) : (
             <>
               <UploadCloud size={32} color="var(--color-text-secondary)" />
               <div style={{ textAlign: 'center' }}>
                 <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-brand-morado)' }}>
                   Hacé clic para seleccionar
                 </p>
                 <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                   o arrastrá y soltá tu archivo aquí
                 </p>
               </div>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                 JPG, PNG, WEBP hasta {MAX_FILE_SIZE_MB}MB
               </p>
             </>
          )}
        </div>
      ) : (
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          borderRadius: 'var(--radius-md)', 
          overflow: 'hidden', 
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {isUploading && (
             <div style={{
               position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
               backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', 
               alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem'
             }}>
               <Loader2 size={32} color="var(--color-brand-morado)" style={{ animation: 'spin 1s linear infinite' }} />
               <p style={{ fontWeight: 500, margin: 0, color: 'var(--color-brand-morado)' }}>Subiendo...</p>
             </div>
          )}
          
          <div style={{ position: 'relative', height: '160px', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
            <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10B981', fontSize: '0.875rem' }}>
                <CheckCircle size={14} /> Listo
             </div>
             <button 
               type="button" 
               onClick={clearImage}
               style={{ 
                 background: 'none', border: 'none', color: 'var(--color-error)', 
                 fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' 
               }}
               disabled={isUploading}
             >
                <X size={14} /> Cambiar imagen
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
