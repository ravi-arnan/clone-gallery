import fs from 'node:fs';

const code = fs.readFileSync('public/loader.76ceb4644b28bd9c30b5.js', 'utf-8');
const start = code.indexOf('}([') + 3; // inside [

let depth = 0;
let inString = false;
let strChar = '';
let escaped = false;
let moduleIndex = 0;
let currentModuleStart = start;

for (let i = start; i < code.length; i++) {
  const c = code[i];
  if (inString) {
    if (escaped) {
      escaped = false;
    } else if (c === '\\') {
      escaped = true;
    } else if (c === strChar) {
      inString = false;
    }
  } else {
    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      strChar = c;
    } else if (c === '{' || c === '(' || c === '[') {
      depth++;
    } else if (c === '}' || c === ')' || c === ']') {
      if (depth === 0 && c === ']') {
        console.log('End of array. Total modules:', moduleIndex + 1);
        break;
      }
      depth--;
    } else if (c === ',' && depth === 0) {
      const modSlice = code.substring(currentModuleStart, i);
      if (modSlice.includes('CDN:')) {
        console.log(`Module containing CDN: index = ${moduleIndex}`);
      }
      moduleIndex++;
      currentModuleStart = i + 1;
    }
  }
}
