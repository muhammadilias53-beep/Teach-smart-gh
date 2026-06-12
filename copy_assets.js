import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir, { recursive: true });
}

// Find the generated image in src/assets/images/
const imagesDir = path.join(process.cwd(), 'src/assets/images');
let sourceFile = '';

if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    const logoFile = files.find(f => f.startsWith('app_logo_512') && f.endsWith('.jpg'));
    if (logoFile) {
        sourceFile = path.join(imagesDir, logoFile);
    }
}

if (!sourceFile) {
    console.error("Could not find generated logo file.");
    process.exit(1);
}

// Copy to icon-512.jpg and icon-192.jpg in public
fs.copyFileSync(sourceFile, path.join(publicDir, 'icon-512.jpg'));
fs.copyFileSync(sourceFile, path.join(publicDir, 'icon-192.jpg'));

// Check for and copy app_logo.png if possible
const artifactLogo = path.join(process.cwd(), 'artifact_backup', 'app_logo.png');
if (fs.existsSync(artifactLogo)) {
    fs.copyFileSync(artifactLogo, path.join(publicDir, 'app_logo.png'));
    console.log("Copied app_logo.png from artifact_backup");
}

console.log("Successfully copied PWA icons to public folder.");
