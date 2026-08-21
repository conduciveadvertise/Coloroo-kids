import http from 'http';
import { GoogleGenAI } from '@google/genai';

const PORT = Number(process.env.PORT || 3001);
const HOST = '0.0.0.0';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'capacitor://localhost',
  'https://localhost',
  'http://localhost'
];

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.up.railway.app') || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Health Check Endpoint
  if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'coloroo-kids-ai-buddy'
    }));
    return;
  }

  // 2. Ephemeral Token Generation Endpoint
  if (req.method === 'POST' && req.url === '/api/ai-buddy/token') {
    if (!GEMINI_API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'AI Buddy is not configured on the server.'
      }));
      return;
    }

    try {
      const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const now = Date.now();
      const expireTime = new Date(now + 30 * 60 * 1000).toISOString();
      const newSessionExpireTime = new Date(now + 1 * 60 * 1000).toISOString();

      const token = await client.authTokens.create({
        config: {
          uses: 1,
          expireTime: expireTime,
          newSessionExpireTime: newSessionExpireTime,
          httpOptions: { apiVersion: 'v1alpha' }
        }
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        token: token.name,
        model: 'gemini-3.1-flash-live-preview'
      }));
    } catch (err) {
      console.error('Ephemeral token creation error:', err?.message || err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Failed to mint ephemeral token. Please try again later.'
      }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`AI Buddy Backend running on http://${HOST}:${PORT}`);
});
