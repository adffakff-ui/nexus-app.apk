export const formatArabicDigits = (num: number | string) => {
  const n = typeof num === 'number' ? num : parseInt(num || '0');
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
};
