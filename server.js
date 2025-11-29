const cors_proxy = require('cors-anywhere');

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [], // Don't require any specific headers
    // removeHeaders: ['cookie', 'cookie2'], // Cookies are needed for Appwrite auth!
    handleInitialRequest: (req, res, location) => {
        // Simple health check endpoint for UptimeRobot
        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
            return true; // Handled
        }
        return false; // Not handled, continue to proxy
    }
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
