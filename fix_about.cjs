const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/>About</g, '>MCQ Checker<');

fs.writeFileSync('index.html', html);
console.log('Script done');
