import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const regex1 = /<div class="img-w" style="position: relative;">[\s\S]*?<img src="https:\/\/cdn\.prod\.website-files\.com\/68b57ef5ef86011d9b251e8e\/68d9dfe10f1c8a1d719c1e63_917d8b944f7f57b7fbe3969bf2719a2e_img_hero-front\.webp" loading="eager" alt="exam window" class="img" \/>[\s\S]*?<\/div>\s*<\/div>/g;

const repl1 = '<div class="img-w"><img src="https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/68d9dfe10f1c8a1d719c1e63_917d8b944f7f57b7fbe3969bf2719a2e_img_hero-front.webp" loading="eager" alt="exam window" class="img" /></div>';

const regex2 = /<div class="img-w" style="position: relative;">[\s\S]*?<img src="https:\/\/cdn\.prod\.website-files\.com\/68b57ef5ef86011d9b251e8e\/68d9ddb4432de688d8f96eb1_img_hero-front-over\.webp" loading="eager" alt="" class="img" \/>[\s\S]*?<\/div>\s*<\/div>/g;

const repl2 = '<div class="img-w"><img src="https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/68d9ddb4432de688d8f96eb1_img_hero-front-over.webp" loading="eager" alt="" class="img" /></div>';

html = html.replace(regex1, repl1);
html = html.replace(regex2, repl2);

fs.writeFileSync('index.html', html);
console.log('Undone');
