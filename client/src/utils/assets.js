import defaultAvatar from '../assets/images/icons8-user-male-1001.png';

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

export { defaultAvatar };

/**
 * Resolves avatar image source cleanly.
 * Handles HTTP/HTTPS URLs, data URIs, raw SVG, and legacy base64 strings.
 */
export const getAvatarSrc = (avatarImage) => {
  if (
    !avatarImage ||
    avatarImage === 'undefined' ||
    avatarImage === 'null' ||
    avatarImage === '[object Object]'
  ) {
    return defaultAvatar;
  }

  if (typeof avatarImage !== 'string') {
    return defaultAvatar;
  }

  const trimmed = avatarImage.trim();

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('<') || trimmed.includes('xmlns=')) {
    let svg = trimmed;
    if (!svg.includes('xmlns=')) {
      svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  return `data:image/svg+xml;base64,${trimmed}`;
};

