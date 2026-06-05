import { supabase } from './supabase';

const WEDDING_PHOTOS_BUCKET = 'wedding-photos';
const OPTIMIZED_PREFIX = 'optimized/';

export interface StorageImageUrls {
  original: string;
  display: string;
  thumbnail: string;
}

export function getWeddingPhotoUrls(filePath?: string | null, fallbackUrl = ''): StorageImageUrls {
  if (!filePath) {
    return {
      original: fallbackUrl,
      display: fallbackUrl,
      thumbnail: fallbackUrl,
    };
  }

  const bucket = supabase.storage.from(WEDDING_PHOTOS_BUCKET);
  const original = bucket.getPublicUrl(filePath).data.publicUrl;
  const thumbnailPath = getThumbnailPath(filePath);

  return {
    original,
    display: original,
    thumbnail: thumbnailPath ? bucket.getPublicUrl(thumbnailPath).data.publicUrl : original,
  };
}

export function getOptimizedPhotoPaths(fileName: string) {
  return {
    displayPath: `${OPTIMIZED_PREFIX}${fileName}`,
    thumbnailPath: `${OPTIMIZED_PREFIX}thumbs/${fileName}`,
  };
}

function getThumbnailPath(filePath: string) {
  if (!filePath.startsWith(OPTIMIZED_PREFIX) || filePath.startsWith(`${OPTIMIZED_PREFIX}thumbs/`)) {
    return null;
  }

  return filePath.replace(OPTIMIZED_PREFIX, `${OPTIMIZED_PREFIX}thumbs/`);
}
