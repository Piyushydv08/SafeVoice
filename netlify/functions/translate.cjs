// netlify/functions/translate.js
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

exports.handler = async function(event, context) {
  // Define allowed origins. For production, you should restrict this to your frontend's URL.
  const allowedOrigins = [
    'http://localhost:5173',
    'https://safevoiceforwomen.netlify.app'
  ];
  const origin = event.headers.origin;
  const corsHeaders = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content for preflight
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Allow': 'POST, OPTIONS' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'API key not configured on server' }),
    };
  }

  try {
    const { title, content, targetLang } = JSON.parse(event.body);
    if (!content || typeof content !== 'string' || !targetLang || typeof targetLang !== 'string') {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing or invalid content or targetLang' }),
      };
    }
    const effectiveTitle = title && typeof title === 'string' ? title : '';
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
    const contentPrompt = `Translate the following story content accurately to ${targetLangName}. Output only the translated content:\n"${content}"`;
    const titlePrompt = effectiveTitle ? `Translate the following story title accurately to ${targetLangName}. Output only the translated title:\n"${effectiveTitle}"` : null;
    const promises = [model.generateContent(contentPrompt)];
    if (titlePrompt) promises.unshift(model.generateContent(titlePrompt));
    const results = await Promise.all(promises);
    let translatedTitle = effectiveTitle;
    let translatedContent = content;
    let titleIndex = -1;
    let contentIndex = -1;
    if (titlePrompt) {
      titleIndex = 0;
      contentIndex = 1;
      translatedTitle = results[titleIndex]?.response?.text()?.trim() || effectiveTitle;
    } else {
      contentIndex = 0;
    }
    translatedContent = results[contentIndex]?.response?.text()?.trim() || content;
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ translatedTitle, translatedContent }),
    };
  } catch (error) {
    let errorMessage = 'Failed to translate content';
    if (error && error.message && typeof error.message === 'string' && error.message.includes('SAFETY')) {
      errorMessage = 'Content blocked due to safety settings.';
    }
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
