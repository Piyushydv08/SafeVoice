const { GoogleGenerativeAI } = require('@google/generative-ai');

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://safevoiceforwomen.netlify.app',
];

exports.handler = async function (event, context) {
    const origin = event.headers.origin;
    const corsHeaders = {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (ALLOWED_ORIGINS.includes(origin)) {
        corsHeaders['Access-Control-Allow-Origin'] = origin;
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json', Allow: 'POST, OPTIONS' },
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
        const { content, title } = JSON.parse(event.body);

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return {
                statusCode: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing or invalid content' }),
            };
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const textToAnalyze = title
            ? `Title: ${title}\n\nContent: ${content}`
            : content;

        const prompt = `You are a crisis detection system for a women's safety support platform. \
Analyze the following anonymous post and classify it into exactly one risk level.
 
Risk level definitions:
- LOW: Normal sharing, general experiences, positive stories, reflective accounts with no distress signals
- MEDIUM: Emotional distress, sadness, anxiety, difficult past experiences described in a reflective or healing context, seeking general peer support
- HIGH: Urgent crisis indicators — active danger, ongoing abuse, immediate threats, suicidal ideation, \
expressions of hopelessness combined with urgency, or explicit requests for immediate help
 
Post to analyze:
"""
${textToAnalyze}
"""
 
Respond ONLY with a raw JSON object formatted exactly like this, with no markdown formatting or code blocks:
{
  "riskLevel": "HIGH",
  "reason": "Brief explanation of why this risk level was chosen"
}`;

        const result = await model.generateContent(prompt);
        let rawText = result?.response?.text()?.trim() || '';

        // Safely strip potential markdown code blocks
        if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
        }

        let parsedResult = { riskLevel: 'LOW', reason: '' };
        try {
            parsedResult = JSON.parse(rawText);
        } catch (parseError) {
            console.error('Failed to parse JSON from AI:', rawText);
        }

        const VALID_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];
        const riskLevel = VALID_LEVELS.includes(parsedResult.riskLevel?.toUpperCase()) ? parsedResult.riskLevel.toUpperCase() : 'LOW';
        const reason = parsedResult.reason || '';

        return {
            statusCode: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ riskLevel, reason }),
        };
    } catch (error) {
        console.error('Crisis classification error:', error);
        return {
            statusCode: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Classification failed', riskLevel: 'LOW', reason: '' }),
        };
    }
};