const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const bodyStart = html.indexOf('<body>') + 6;
const bodyEnd = html.indexOf('</body>');
const body = html.substring(bodyStart, bodyEnd);
fs.writeFileSync('body.html', body);

const newHtml = html.substring(0, bodyStart) + '\n  <div id="root"></div>\n  <script type="module" src="/src/main.jsx"></script>\n' + html.substring(bodyEnd);
fs.writeFileSync('index.html', newHtml);
