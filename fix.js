const fs = require('fs');
const files = [
  'frontend/src/app/goals/page.tsx',
  'frontend/src/app/insights/page.tsx',
  'frontend/src/app/log/page.tsx',
  'frontend/src/app/page.tsx',
  'frontend/src/app/profile/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace('const API_URL = process.env.NEXT_PUBLIC_API_URL || `${API_URL}`;', 'const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";');
  fs.writeFileSync(f, content);
});
console.log("Fixed files");
