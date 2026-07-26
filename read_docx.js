const fs = require('fs');
const xml = fs.readFileSync('./docx_temp/word/document.xml', 'utf8');
const text = xml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').trim();
console.log(text);
