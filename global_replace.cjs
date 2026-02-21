const fs = require('fs');
const path = require('path');

const directoryToSearch = __dirname;
const ignoreDirs = ['node_modules', '.git', '.gemini', 'dist', 'build', 'package-lock.json'];

const replacements = [
    { search: /Counsellor/g, replace: 'Counsellor' },
    { search: /counsellor/g, replace: 'counsellor' },
    { search: /COUNSELLOR/g, replace: 'COUNSELLOR' },
    { search: /Counselling/g, replace: 'Counselling' },
    { search: /counselling/g, replace: 'counselling' },
    { search: /COUNSELLING/g, replace: 'COUNSELLING' },
    { search: /Counsellors/g, replace: 'Counsellors' },
    { search: /counsellors/g, replace: 'counsellors' },
    { search: /COUNSELLORS/g, replace: 'COUNSELLORS' }
];

let filesModifiedCount = 0;

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (ignoreDirs.includes(file)) continue;

        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile()) {
            if (!fullPath.match(/\.(ts|tsx|js|jsx|json|md|html|css|cjs)$/)) continue;

            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            for (const rule of replacements) {
                content = content.replace(rule.search, rule.replace);
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
                filesModifiedCount++;
            }
        }
    }
}

processDirectory(directoryToSearch);
console.log(`\nFinished! Modified ${filesModifiedCount} files.`);
