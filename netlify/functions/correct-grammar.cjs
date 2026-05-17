// netlify/functions/correct-grammar.js
const { enhanceGrammar } = require('./utils/ai-service.js');

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

    const correctedContent = await enhanceGrammar(content);

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
