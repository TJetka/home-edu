import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

function hashDirectory(path) {
  const hash = createHash('sha256');
  for (const file of readdirSync(path).sort()) {
    hash.update(file).update(readFileSync(`${path}/${file}`));
  }
  return hash.digest('hex');
}

let gitSha = 'uncommitted';
try { gitSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* Fresh checkout. */ }
writeFileSync('dist/build-info.json', `${JSON.stringify({
  version: '0.1.0', gitSha, base: '/home-edu/', seed: null,
  contentSha256: hashDirectory('src/content'),
  lockSha256: createHash('sha256').update(readFileSync('package-lock.json')).digest('hex'),
}, null, 2)}\n`);
