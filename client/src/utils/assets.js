/**
 * Utility to resolve asset URLs.
 * If VITE_IMAGEKIT_URL_ENDPOINT is defined, it retrieves the asset from ImageKit.
 * Otherwise, it falls back to the locally imported asset.
 */
export const getAssetUrl = (filename, localFallback) => {
  const imageKitEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
  if (imageKitEndpoint) {
    const cleanEndpoint = imageKitEndpoint.replace(/\/$/, '');
    return `${cleanEndpoint}/${filename}`;
  }
  return localFallback;
};
