const https = require('https');

const url = 'https://hannainst.com/media/catalog/product/h/i/hi2020_1__1.jpg';

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(`Error: ${e.message}`);
});
