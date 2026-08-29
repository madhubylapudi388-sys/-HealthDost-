/**
 * Utility to compress and resize images on client-side before sending to server/AI.
 * Avoids large payload HTTP 413 / HTML gateway errors on mobile devices.
 */
export async function compressImageToJpeg(
  source: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions preserving aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback to original if canvas fails
        if (typeof source === 'string') {
          resolve({ base64: source, mimeType: 'image/jpeg' });
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve({ base64: reader.result as string, mimeType: source.type || 'image/jpeg' });
          reader.onerror = reject;
          reader.readAsDataURL(source);
        }
        return;
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({ base64: compressedDataUrl, mimeType: 'image/jpeg' });
    };

    img.onerror = () => {
      // If image loading fails and source is string
      if (typeof source === 'string') {
        resolve({ base64: source, mimeType: 'image/jpeg' });
      } else {
        reject(new Error('Failed to load image for compression'));
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}
