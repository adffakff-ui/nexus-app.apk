const PROHIBITED_WORDS = [
  'شتم', 'سب', 'اهانة', 'كراهية', 'عنف', 
  'hate', 'spam', 'abuse', 'violence', 'badword'
];

export const moderateContent = (text: string): { moderatedText: string; isSafe: boolean } => {
  let isSafe = true;
  let moderatedText = text;

  PROHIBITED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(text)) {
      isSafe = false;
      moderatedText = moderatedText.replace(regex, '****');
    }
  });

  return { moderatedText, isSafe };
};
