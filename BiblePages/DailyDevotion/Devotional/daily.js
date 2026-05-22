const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url'); // Required for Windows path conversion

(async () => {
  // Launch with 'new' headless mode for better performance
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const folderPath = 'D:/Bible/BiblePages/DailyDevotion/';
  const outputPath = path.join(folderPath, 'screenshots');

  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.html'));

  if (files.length === 0) {
    console.log("No HTML files found in the directory.");
    await browser.close();
    return;
  }

  let counter = 0;
  for (const file of files) {
    counter++;
    
    // Properly format the file URL for Windows
    const fileUrl = pathToFileURL(path.resolve(folderPath, file)).href;

    try {
      // Use domcontentloaded for local files to avoid network timeouts
      await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

      // Logic for shortName
      let shortName = file
        .replace('_devotion_by_spurgeon.html', '')
        .replace(/_/g, ' ')
        .toLowerCase();

      const match = shortName.match(/(\w+)\s+(\d+)\s+(morning|evening)/);
      if (match) {
        const [, month, day, time] = match;
        shortName = `${month}${day}${time[0]}`;
      } else {
        shortName = file.replace('.html', '');
      }

      const screenshotFile = path.join(outputPath, `${shortName}.png`);
      
      // Ensure the page is actually rendered (small delay if needed)
      await page.screenshot({ path: screenshotFile, fullPage: false });

      console.log(`(${counter}/${files.length}) ✅ Saved: ${shortName}.png`);
    } catch (err) {
      console.error(`(❌ Error processing ${file}: ${err.message}`);
    }
  }

  console.log('Done!');
  await browser.close();
})();