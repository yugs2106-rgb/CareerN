const fs = require('fs');
const path = require('path');

const dir = 'src';

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A mapping of light mode classes to their dark mode counterparts
  const replacements = [
    { regex: /(?<!dark:)bg-white(?![\w-])/g, replace: 'bg-white dark:bg-slate-900' },
    { regex: /(?<!dark:)bg-slate-50(?![\w-])/g, replace: 'bg-slate-50 dark:bg-slate-800' },
    { regex: /(?<!dark:)bg-slate-100(?![\w-])/g, replace: 'bg-slate-100 dark:bg-slate-800' },
    { regex: /(?<!dark:)bg-slate-200(?![\w-])/g, replace: 'bg-slate-200 dark:bg-slate-700' },
    
    { regex: /(?<!dark:)text-slate-900(?![\w-])/g, replace: 'text-slate-900 dark:text-white' },
    { regex: /(?<!dark:)text-slate-800(?![\w-])/g, replace: 'text-slate-800 dark:text-slate-200' },
    { regex: /(?<!dark:)text-slate-700(?![\w-])/g, replace: 'text-slate-700 dark:text-slate-300' },
    { regex: /(?<!dark:)text-slate-600(?![\w-])/g, replace: 'text-slate-600 dark:text-slate-400' },
    { regex: /(?<!dark:)text-slate-500(?![\w-])/g, replace: 'text-slate-500 dark:text-slate-400' },
    
    { regex: /(?<!dark:)border-slate-200(?![\w-])/g, replace: 'border-slate-200 dark:border-slate-700' },
    { regex: /(?<!dark:)border-slate-100(?![\w-])/g, replace: 'border-slate-100 dark:border-slate-700' },
    { regex: /(?<!dark:)border-slate-300(?![\w-])/g, replace: 'border-slate-300 dark:border-slate-600' },

    { regex: /(?<!dark:)divide-slate-100(?![\w-])/g, replace: 'divide-slate-100 dark:divide-slate-800' },
  ];

  let original = content;
  for (const { regex, replace } of replacements) {
    content = content.replace(regex, replace);
  }

  // Handle specific cases
  content = content.replace(/bg-\[\#F1F5F9\]/g, 'bg-[#F1F5F9] dark:bg-slate-950');
  content = content.replace(/text-\[\#1E293B\]/g, 'text-[#1E293B] dark:text-slate-100');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function walkDir(currentPath) {
  const files = fs.readdirSync(currentPath);
  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

walkDir(dir);
console.log("Dark mode classes added!");
