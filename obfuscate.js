import fs from 'fs';
import JsObfuscator from 'javascript-obfuscator';

// Read index.html
let html = fs.readFileSync('./index.html', 'utf8');

// Extract all script content
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let scriptCount = 0;

html = html.replace(scriptRegex, (match, scriptContent) => {
    // Skip empty or very short scripts
    if (scriptContent.trim().length < 20) {
        return match;
    }

    console.log(`Obfuscating script ${++scriptCount}...`);
    
    try {
        const obfuscated = JsObfuscator.obfuscate(scriptContent, {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: false,
            stringArray: true,
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
        });
        
        return `<script>${obfuscated.getObfuscatedCode()}</script>`;
    } catch (err) {
        console.error(`Error obfuscating script ${scriptCount}:`, err.message);
        return match; // Return original if obfuscation fails
    }
});

// Write obfuscated HTML
fs.writeFileSync('./index.html', html);
console.log('✓ Obfuscation complete!');
