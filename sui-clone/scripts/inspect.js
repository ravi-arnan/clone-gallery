import fs from 'node:fs';

const html = fs.readFileSync('/home/ravi/Projects/sui-clone/original.html', 'utf8');

function getMatches(re) {
  const matches = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    matches.push(m[0]);
  }
  return Array.from(new Set(matches));
}

console.log('--- JSON matches (potential Lottie/Spline) ---');
console.log(getMatches(/https?:\/\/[^"'\s<>]+\.json/gi));

console.log('\n--- RIV matches ---');
console.log(getMatches(/https?:\/\/[^"'\s<>]+\.riv/gi));

console.log('\n--- Canvas tags ---');
console.log(getMatches(/<canvas\b[^>]*>/gi));

console.log('\n--- Sample rive matches ---');
let rMatches = [];
let rm;
const rReg = /.{0,40}rive.{0,40}/gi;
while ((rm = rReg.exec(html)) !== null && rMatches.length < 15) {
  rMatches.push(rm[0].trim().replace(/\s+/g, ' '));
}
console.log(rMatches);
