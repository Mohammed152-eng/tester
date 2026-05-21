const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/href="#about"/g, 'href="/app.html"');
html = html.replace(/>Scroll down</g, '>Start Now<');

fs.writeFileSync('index.html', html);
console.log('Script done');
