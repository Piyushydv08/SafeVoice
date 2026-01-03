// netlify/functions/correct-grammar.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Supported languages (for future use or extension)
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
    const { content } = JSON.parse(event.body);
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing or invalid content' }),
      };
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const prompt = `Correct the grammar and spelling mistakes in the following text. Preserve the original meaning and tone. Only output the corrected text, without any introductory phrases like "Here is the corrected text:":\n\n"${content}"`;

    const result = await model.generateContent(prompt);
    const response = result?.response;
    const correctedContent = response?.text()?.trim() || content;

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ correctedContent }),
    };
  } catch (error) {
    let errorMessage = 'Failed to correct grammar';
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
