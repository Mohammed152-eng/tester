const { execSync } = require('child_process');
const fs = require('fs');

try {
  // We can just download the repo as a zip using curl inside node!
  execSync('npx download-git-repo ZiedDev/mcq-mate latest_mcq_mate', { stdio: 'inherit' });
} catch (e) {
  console.log("download-git-repo failed, trying curl and unzip");
  try {
    execSync('curl -L -o repo.zip https://github.com/ZiedDev/mcq-mate/archive/refs/heads/master.zip');
    execSync('npx unzip-stream repo.zip');
  } catch (err) {
    console.error(err);
  }
}
