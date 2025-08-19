export function getLowResCloudinaryUrl(originalUrl, width = 32, quality = 20) {
    if (!originalUrl) return "";
    return originalUrl.replace("/upload/", `/upload/w_${width},q_${quality}/`);
  }
  