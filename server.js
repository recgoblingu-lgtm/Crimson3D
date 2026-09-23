import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.glb':'model/gltf-binary', '.json':'application/json; charset=utf-8' };

function send(res, status, body, type='application/json; charset=utf-8') { res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(type.startsWith('application/json') ? JSON.stringify(body) : body); }
async function readBody(req) { let body=''; for await (const chunk of req) body += chunk; if (body.length > 20000) throw new Error('Request is too large.'); return JSON.parse(body || '{}'); }
function clean(value, max=800) { return String(value || '').trim().slice(0, max); }

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'POST' && url.pathname === '/api/order') {
      const data = await readBody(req);
      const name = clean(data.name, 120), email = clean(data.email, 180), discord = clean(data.discord, 120), notes = clean(data.notes, 800);
      if (!name || !email || !data.agree || !/^\S+@\S+\.\S+$/.test(email)) return send(res, 400, { error: 'Please provide a name, a valid email, and consent to be contacted.' });
      if (!webhookUrl) return send(res, 503, { error: 'Purchase requests are not configured yet. Please contact the site owner.' });
      const content = ['**New Crimson3D purchase request**','',`**Model:** Crimson Blade`,`**Name:** ${name}`,`**Email:** ${email}`,`**Discord:** ${discord || 'Not provided'}`,`**Notes:** ${notes || 'None'}`].join('\n');
      const webhookResponse = await fetch(webhookUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ content, allowed_mentions:{ parse:[] } }) });
      if (!webhookResponse.ok) return send(res, 502, { error: 'Discord could not accept the request. Please try again later.' });
      return send(res, 200, { ok: true });
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
    let filePath = path.normalize(path.join(root, url.pathname === '/' ? 'index.html' : url.pathname));
    if (!filePath.startsWith(root)) return send(res, 403, { error: 'Forbidden.' });
    try { const stat = await fs.stat(filePath); if (stat.isDirectory()) filePath = path.join(filePath, 'index.html'); } catch { return send(res, 404, 'Not found', 'text/plain; charset=utf-8'); }
    const content = await fs.readFile(filePath); res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' }); if (req.method !== 'HEAD') res.end(content); else res.end();
  } catch (error) { console.error(error); send(res, 500, { error: 'Unexpected server error.' }); }
});
server.listen(port, '0.0.0.0', () => console.log(`Crimson3D running on http://localhost:${port}`));
