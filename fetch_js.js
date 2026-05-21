fetch('https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/css/jeskojets.webflow.shared.c930478cf.min.css')
  .then(res => res.text())
  .then(text => {
    console.log("length:", text.length);
    console.log("has Jesko:", text.toLowerCase().includes('jesko'));
    const contentMatches = text.match(/content:\s*["'][^"']*["']/g);
    console.log("content rules:", contentMatches);
  });
