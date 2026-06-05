const MAX_IMAGE_EDGE = 1600;
const MAX_THUMBNAIL_EDGE = 480;
const JPEG_QUALITY = 0.78;
const THUMBNAIL_QUALITY = 0.68;

export async function compressImageForUpload(file: File): Promise<File> {
  return resizeImage(file, MAX_IMAGE_EDGE, JPEG_QUALITY);
}

export async function createThumbnailForUpload(file: File): Promise<File> {
  return resizeImage(file, MAX_THUMBNAIL_EDGE, THUMBNAIL_QUALITY);
}

async function resizeImage(file: File, maxEdge: number, quality: number): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const compressedName = file.name.replace(/\.[^.]+$/, '') || 'photo';
    return new File([blob], `${compressedName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
