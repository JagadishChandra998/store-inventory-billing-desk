import http from 'http';

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/health') return json(res, 200, { ok: true, service: 'api', stack: 'node' });
    if (req.url === '/api/version') return json(res, 200, { version: 'starter-v1', runtime: 'node', deploy_target: 'render' });
    if (req.url === '/api/ping') return json(res, 200, { ok: true, message: 'pong' });
    return json(res, 404, { ok: false, error: 'NOT_FOUND' });
  });
}

const modulePath = new URL(import.meta.url).pathname;
if (process.argv[1] === modulePath) {
  const port = process.env.PORT || 3001;
  const server = createServer();
  server.listen(port, () => {
    console.log(`Backend running on :${port}`);
  });
}
