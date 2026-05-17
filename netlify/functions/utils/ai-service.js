const { GoogleGenerativeAI } = require('@google/generative-ai');

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  // Add more languages as needed
];

/**
 * Centralized function to translate text using Gemini.
 * 
 * @param {string} text - The content or title text to translate.
 * @param {string} targetLang - The target language code (e.g. 'hi', 'es').
 * @param {boolean} isTitle - Whether the text being translated is a title (affects prompt).
 * @returns {Promise<string>} The translated text, or original if empty/fails.
 */
async function translateText(text, targetLang, isTitle = false) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('API key not configured on server');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;

  const prompt = isTitle
    ? `Translate the following story title accurately to ${targetLangName}. Output only the translated title:\n"${text}"`
    : `Translate the following story content accurately to ${targetLangName}. Output only the translated content:\n"${text}"`;

  const result = await model.generateContent(prompt);
  return result?.response?.text()?.trim() || text;
}

/**
 * Centralized function to enhance text grammar using Gemini.
 * 
 * @param {string} text - The input text to correct.
 * @returns {Promise<string>} The grammar-corrected text, or original if empty/fails.
 */
async function enhanceGrammar(text) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('API key not configured on server');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `Correct the grammar and spelling mistakes in the following text. Preserve the original meaning and tone. Only output the corrected text, without any introductory phrases like "Here is the corrected text:":\n\n"${text}"`;

  const result = await model.generateContent(prompt);
  return result?.response?.text()?.trim() || text;
}

module.exports = {
  translateText,
  enhanceGrammar,
};
