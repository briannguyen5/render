const fs = require('fs');
const path = require('path');

// Thay domain trang web của bạn vào đây
const DOMAIN = 'https://briannguyen.onrender.com/'; 

function getHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Bỏ qua thư mục node_modules hoặc .git nếu có
      if (file !== 'node_modules' && file !== '.git') {
        arrayOfFiles = getHtmlFiles(filePath, arrayOfFiles);
      }
    } else if (file.endsWith('.html')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function generateSitemap() {
  const htmlFiles = getHtmlFiles('./');
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  htmlFiles.forEach((file) => {
    // Chuẩn hóa đường dẫn URL
    let relativePath = file.replace(/\\/g, '/');
    if (relativePath.startsWith('./')) relativePath = relativePath.substring(2);
    
    // Bỏ index.html ở cuối URL để chuẩn SEO
    if (relativePath === 'index.html') {
      relativePath = '';
    }

    const url = `${DOMAIN}/${relativePath}`;
    
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <priority>${relativePath === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync('sitemap.xml', xml);
  console.log('Sitemap updated successfully!');
}

generateSitemap();
