/**
 * 验证并处理图片URL
 * @param {string} url - 原始图片URL
 * @returns {object} 包含处理后的URL和验证状态的对象
 */
export const validateImageUrl = (url) => {
  console.log('验证图片URL:', url);
  console.log('验证图片URL:', typeof url);
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      message: 'Invalid image URL: URL must be a string',
      finalUrl: 'https://via.placeholder.com/800x600' // 默认占位图
    };
  }

  // 统一转换为HTTPS
  let finalUrl = url.trim();
  if (finalUrl.startsWith('http://')) {
    finalUrl = finalUrl.replace('http://', 'https://');
  }

  if (!finalUrl.startsWith('https://')) {
    return {
      isValid: false,
      message: 'Invalid image URL: must start with https://',
      finalUrl: 'https://via.placeholder.com/800x600' // 默认占位图
    };
  }

  return {
    isValid: true,
    message: '',
    finalUrl
  };
};
