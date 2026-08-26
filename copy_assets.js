import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir, { recursive: true });
}

// Find the latest generated logo in src/assets/images/
const imagesDir = path.join(process.cwd(), 'src/assets/images');
let sourceFile = '';

if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    const logoFiles = files.filter(f => f.startsWith('app_logo') && (f.endsWith('.jpg') || f.endsWith('.png')));
    if (logoFiles.length > 0) {
        // Sort to get newest
        logoFiles.sort().reverse();
        sourceFile = path.join(imagesDir, logoFiles[0]);
    }
}

if (!sourceFile) {
    console.error("Could not find generated logo file.");
    process.exit(1);
}

// Copy to all icon and favicon targets in public
const targets = [
    'icon-512.jpg',
    'icon-192.jpg',
    'icon-512.png',
    'icon-192.png',
    'app_logo.png',
    'favicon.ico',
    'favicon.png',
    'apple-touch-icon.png'
];

targets.forEach(target => {
    fs.copyFileSync(sourceFile, path.join(publicDir, target));
});

console.log("Successfully copied PWA and favicon icons to public folder.");
