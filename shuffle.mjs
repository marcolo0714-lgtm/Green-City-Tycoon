import { readFileSync, writeFileSync } from 'fs';

// Read as text and use regex to find answer arrays and correctIndex
let src = readFileSync('src/data/questions.ts', 'utf-8');

// Find each question block: from line with "id:" to closing "},"
const idRegex = /id: '([^']+)'/g;
let idMatch;
const ids = [];
while ((idMatch = idRegex.exec(src)) !== null) {
  ids.push(idMatch[1]);
}

console.log('Found', ids.length, 'questions');

// For each id, find its answers array and correctIndex
for (let i = 0; i < ids.length; i++) {
  const id = ids[i];
  // Determine target index: spread evenly
  const targetCI = i % 4;
  
  // Find this question's block
  const idPos = src.indexOf(`id: '${id}'`);
  if (idPos === -1) continue;
  
  // Find answers: [...] in this block
  const blockStart = src.lastIndexOf('{', idPos);
  const blockEnd = src.indexOf('},', idPos) + 2;
  let block = src.slice(blockStart, blockEnd);
  
  // Extract answers
  const ansMatch = block.match(/answers: \[([\s\S]*?)\],/);
  if (!ansMatch) continue;
  
  const answers = [];
  const ansRe = /'([^']*)'/g;
  let am;
  while ((am = ansRe.exec(ansMatch[1])) !== null) {
    answers.push(am[1]);
  }
  if (answers.length !== 4) continue;
  
  // Extract correctIndex
  const ciMatch = block.match(/correctIndex: (\d)/);
  if (!ciMatch) continue;
  const oldCI = parseInt(ciMatch[1]);
  
  // If already at target, skip
  if (oldCI === targetCI) continue;
  
  // Swap answers: put correct answer at targetCI, old answer at oldCI
  const correctAnswer = answers[oldCI];
  const replacedAnswer = answers[targetCI];
  answers[targetCI] = correctAnswer;
  answers[oldCI] = replacedAnswer;
  
  // Rebuild the block
  const newAnsStr = answers.map(a => `      '${a}'`).join(',\n');
  const newBlock = block
    .replace(ansMatch[0], `answers: [\n${newAnsStr},\n    ],`)
    .replace(ciMatch[0], `correctIndex: ${targetCI},`);
  
  src = src.slice(0, blockStart) + newBlock + src.slice(blockEnd);
}

writeFileSync('src/data/questions.ts', src);
console.log('Done');
