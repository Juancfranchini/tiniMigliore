import type { CloudinaryImageDetails } from '../core/types/cloudinary';

// En un entorno productivo, estas variables vendrían de import.meta.env
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
}

export const cloudinaryService = {
  uploadImage: async (file: File, config: CloudinaryConfig): Promise<CloudinaryImageDetails> => {
    if (!config.cloudName || !config.uploadPreset) {
      throw new Error('Falta configuración de Cloudinary (cloudName o uploadPreset).');
    }

    const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    if (config.folder) {
      formData.append('folder', config.folder);
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al subir la imagen a Cloudinary');
    }

    const data = await response.json();

    return {
      imageUrl: data.secure_url,
      width: data.width,
      height: data.height,
      fileName: data.original_filename,
      uploadedAt: data.created_at || new Date().toISOString(),
      alt: data.original_filename
    };
  }
};
