const http = require('http');

http.get('http://127.0.0.1:4040/api/requests/http/airt_3Fj4PMvHdDksalkEubhw16w8XgD', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.error('Failed to parse json:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching request details:', err.message);
});
