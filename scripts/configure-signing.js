const fs = require('fs');
const path = require('path');

const gradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

if (!fs.existsSync(gradlePath)) {
  console.error(`Error: ${gradlePath} not found.`);
  process.exit(1);
}

let content = fs.readFileSync(gradlePath, 'utf8');

const releaseSigning = `
        release {
            storeFile file('keystores/release.keystore')
            storePassword 'focuspup12345'
            keyAlias 'focuspup-key'
            keyPassword 'focuspup12345'
        }
`;

// Inject release signing config
if (!content.includes("keystores/release.keystore")) {
  content = content.replace(/signingConfigs\s*\{/, 'signingConfigs {' + releaseSigning);
}

// Update release buildType to use release signingConfig
content = content.replace(
  /(release\s*\{[\s\S]*?signingConfig\s+)signingConfigs\.debug/,
  '$1signingConfigs.release'
);

fs.writeFileSync(gradlePath, content, 'utf8');
console.log('Successfully configured release signing in android/app/build.gradle');
