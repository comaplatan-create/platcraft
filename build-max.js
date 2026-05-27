import fs from 'fs';
import JsObfuscator from 'javascript-obfuscator';

// Read clean HTML
let html = fs.readFileSync('./index-clean.html', 'utf8');

// Extract all scripts
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
const scripts = [];
let scriptMatch;
while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    scripts.push(scriptMatch[1]);
}

// Combine all JavaScript
const allJs = scripts.join('\n');

console.log('🔐 Starting maximum obfuscation...\n');

// Obfuscate all JavaScript with aggressive settings
console.log('1️⃣ Obfuscating all JavaScript with control flow flattening...');
const obfuscatedJs = JsObfuscator.obfuscate(allJs, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: true,
    rotateStringArray: true,
    selfDefending: false,
    stringArray: true,
    stringArrayThreshold: 1,
    unicodeEscapeSequence: true
}).getObfuscatedCode();

// Create minimalist HTML with inlined obfuscated script
console.log('2️⃣ Creating ultra-compact HTML...');

const minimalHtml = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Platon Studios</title><link rel="icon" href="favicon.svg" type="image/svg+xml"><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css"></head><body><script>${obfuscatedJs}</script></body></html>`;

// Write output
fs.writeFileSync('./index.html', minimalHtml);

console.log('✅ Maximum obfuscation complete!');
console.log(`📊 Original size: ${html.length} bytes`);
console.log(`📊 Obfuscated size: ${minimalHtml.length} bytes`);
console.log(`🔒 Code is now encrypted like YouTube!`);
