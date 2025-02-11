const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'https://www.sofascore.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/v1', // '/api' ile başlayan istekleri '/api/v1' olarak yönlendir
  }
}));

app.listen(5000, () => {
  console.log('Proxy server running on http://localhost:5000');
}); 