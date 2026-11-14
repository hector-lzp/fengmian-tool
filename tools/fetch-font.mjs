import fs from "fs";
import path from "path";
import https from "https";

const root = path.resolve(import.meta.dirname, "..");
const cssIn = path.join(process.env.TEMP || "/tmp", "noto-900.css");
const fontDir = path.join(root, "fonts");
const cssOut = path.join(root, "css", "cover-font.css");
const source = fs.readFileSync(cssIn, "utf8");
const names = [...new Set([...source.matchAll(/files\/(noto-sans-sc-[^)]+?\.woff2)/g)].map((m) => m[1]))];

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        get(res.headers.location).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`${res.statusCode} ${url}`));
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
  });
}

async function getRetry(url) {
  let last;
  for (let i = 0; i < 4; i += 1) {
    try {
      return await get(url);
    } catch (error) {
      last = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  throw last;
}

async function pool(items, size, worker) {
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: size }, run));
}

fs.mkdirSync(fontDir, { recursive: true });
let finished = 0;
await pool(names, 8, async (name) => {
  const dest = path.join(fontDir, name);
  if (!fs.existsSync(dest) || fs.statSync(dest).size < 400) {
    const buf = await getRetry(`https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.2.8/files/${name}`);
    fs.writeFileSync(dest, buf);
  }
  finished += 1;
  if (finished % 20 === 0 || finished === names.length) {
    console.log(`${finished}/${names.length}`);
  }
});

const rewritten = source
  .replaceAll("font-family: 'Noto Sans SC'", "font-family: CoverHei")
  .replaceAll("font-display: swap", "font-display: block")
  .replace(
    /url\(\.\/files\/(noto-sans-sc-[^)]+?\.woff2)\) format\('woff2'\), url\(\.\/files\/noto-sans-sc-[^)]+?\.woff\) format\('woff'\)/g,
    "url(../fonts/$1) format('woff2')",
  );

fs.mkdirSync(path.dirname(cssOut), { recursive: true });
fs.writeFileSync(cssOut, rewritten);
console.log(`wrote ${cssOut} (${rewritten.length} bytes, ${names.length} files)`);
