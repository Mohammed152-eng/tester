const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// remove the div with class "hero-w_bg_back"
html = html.replace(/<div class="hero-w_bg_back">[\s\S]*?<\/div>\s*<\/div>/g, '</div>');

fs.writeFileSync('index.html', html);
