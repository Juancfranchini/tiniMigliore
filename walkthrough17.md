# Walkthrough: Cloudinary Integration

## Overview
We integrated the existing [ImageUploader](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/components/ui/ImageUploader.tsx#17-231) component with Cloudinary's Unsigned Upload API over HTTP. The uploader now consumes its configuration dynamically from the global backoffice store (`settingsStore`), allowing the admin to easily configure Cloudinary credentials via the UI without exposing sensitive backend application secrets.

## Changes Made
### Cloudinary Service ([cloudinary.ts](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/services/cloudinary.ts))
- Implemented the actual HTTP POST request to `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`.
- Constructed a `FormData` payload combining the image `file`, `upload_preset`, and optionally the `folder` parameter.
- Mapped the final parsed JSON response (`secure_url`, `width`, `height`, `original_filename`, `created_at`) seamlessly into our `CloudinaryImageDetails` interface.

### UI Integration ([ImageUploader.tsx](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/components/ui/ImageUploader.tsx))
- Imported `useSettingsStore` to dynamically fetch `cloudinaryCloudName`, `cloudinaryUploadPreset`, and `cloudinaryFolder`.
- Implemented a configuration check before triggering an upload. If the Cloud Name or Upload Preset are missing, the uploader visually warns the user rather than failing silently.
- Passed these settings safely to the localized `cloudinaryService.uploadImage`.

## Impacts
This central modification impacts **all places where [ImageUploader](file:///c:/Users/Juan%20Cruz%20IT%20Oeste/OneDrive/Desktop/jc/react/tiniMigliore/src/components/ui/ImageUploader.tsx#17-231) is utilized**:
- Product Image Uploading
- Banner Image Uploading
- Contact Section Image Uploading

## Admin Configuration Steps Required
For this feature to definitively work, the administrator must go to the **Configuraciones** section and set:
1. **Cloud Name**: The distinct Cloudinary Cloud Name.
2. **Upload Preset**: An **Unsigned** Upload Preset configured exactly on Cloudinary's Dashboard settings (Settings > Upload > Upload Presets).

## Validation Results
- Verified that compiling the codebase (`npm run build`) succeeded without type errors or broken references.
- Verified error boundaries properly prevent requests and output messaging if settings are empty.
