import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve, relative, extname } from 'node:path';

// Files and directories to exclude
const excludeList = [
  'node_modules',
  'dist',
  '.git',
  '.bolt',
  'scripts',
  'package-lock.json'
];

// Function to check if path should be excluded
function shouldExclude(pathName) {
  return excludeList.some(excluded => pathName.includes(excluded));
}

// Function to read directory recursively
function readDirRecursive(dir) {
  const files = [];
  
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    
    if (shouldExclude(fullPath)) continue;
    
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...readDirRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to format file content
function formatFileContent(filePath, content) {
  return `${filePath}:
\`\`\`${extname(filePath).slice(1)}
${content}
\`\`\`

`;
}

// Main export function
function exportCode() {
  const projectRoot = resolve(new URL('.', import.meta.url).pathname, '..');
  const files = readDirRecursive(projectRoot);
  
  let output = '# Project Files:\n\n';
  output += 'The following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\n';
  
  for (const file of files.sort()) {
    const relativePath = relative(projectRoot, file);
    const content = readFileSync(file, 'utf8');
    output += formatFileContent(relativePath, content);
  }
  
  // Write to output file
  const outputPath = join(projectRoot, 'project-code-export.md');
  writeFileSync(outputPath, output);
  
  console.log(`Code export complete! File saved to: ${outputPath}`);
}

exportCode();