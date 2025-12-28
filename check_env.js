const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    console.log('.env.local exists.');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    console.log('Variables found:');
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const parts = trimmedLine.split('=');
            if (parts.length >= 1) {
                const key = parts[0].trim();
                console.log(`- ${key}`);
            }
        }
    });
} else {
    console.log('.env.local does not exist.');
}
