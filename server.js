const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({
    secure: true, // Verify SSL certificates
    changeOrigin: true, // Update host header to target
    ws: true // Enable WebSocket support
});

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;

const server = http.createServer(function(req, res) {
    // Health check for UptimeRobot
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        return;
    }

    // Add CORS headers to every response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-appwrite-project,x-appwrite-key,x-appwrite-locale,x-appwrite-mode,x-sdk-version,x-sdk-name,x-sdk-language,x-sdk-platform,x-sdk-graphql,x-appwrite-id,x-appwrite-timestamp,x-appwrite-response-format');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Proxy the request to Appwrite
    // Note: We are proxying everything to the Appwrite Cloud endpoint
    proxy.web(req, res, { target: 'https://fra.cloud.appwrite.io' }, function(e) {
        console.error("Proxy Error:", e);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy Error');
    });
});

// Listen for the 'upgrade' event for WebSocket connections
server.on('upgrade', function (req, socket, head) {
    console.log("Upgrading to WebSocket...");
    proxy.ws(req, socket, head, { 
        target: 'https://fra.cloud.appwrite.io'
    });
});

// Intercept WebSocket handshake to set proper headers
proxy.on('proxyReqWs', function(proxyReq, req, socket, options, head) {
    console.log("Proxying WebSocket Handshake...");
    // Set a standard local origin
    proxyReq.setHeader('Origin', 'http://localhost');
    // DO NOT remove cookies - the SDK needs them for session-based auth
});

// Global error handler
proxy.on('error', function (err, req, res) {
    console.error("Global Proxy Error:", err);
    if (res && res.writeHead) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy Error');
    }
});

server.listen(port, host, function() {
    console.log('Running HTTP/WS Proxy on ' + host + ':' + port);
});
