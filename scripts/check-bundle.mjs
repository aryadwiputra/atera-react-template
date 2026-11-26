import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const KIB = 1024;
// Measured initial payload is 225.8 KiB gzip (largest asset 132.0 KiB gzip).
// Budgets keep ~10% headroom, rounded up to the next KiB.
const MAX_INITIAL_GZIP = 249 * KIB;
const MAX_ASSET_GZIP = 146 * KIB;

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error(`[perf:budget] Missing build output: ${indexPath}. Run "bun run build" first.`);
    process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
const assets = new Map();

function registerAsset(ref) {
    const clean = ref.split(/[?#]/, 1)[0];
    const match = clean.match(/\/assets\/(.+)$/);
    if (!match) return;

    const relative = path.posix.join('assets', match[1]);
    if (assets.has(relative)) return;

    const extension = path.extname(relative).toLowerCase();
    const type = extension === '.css' ? 'css' : 'js';

    assets.set(relative, { relative, type });
}

for (const match of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
    const tag = match[0];

    if (match[1].toLowerCase() === 'script') {
        const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
        if (src) registerAsset(src);
        continue;
    }

    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (rel !== 'modulepreload' && rel !== 'stylesheet') continue;

    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (href) registerAsset(href);
}

if (assets.size === 0) {
    console.error(`[perf:budget] No local /assets/ references found in ${indexPath}.`);
    process.exit(1);
}

const rows = [];
let initialJsGzip = 0;
let initialCssGzip = 0;
let failed = false;

for (const asset of assets.values()) {
    const filePath = path.join(distDir, asset.relative);
    if (!fs.existsSync(filePath)) {
        console.error(`[perf:budget] Referenced asset is missing: ${filePath}`);
        process.exit(1);
    }

    const contents = fs.readFileSync(filePath);
    const rawBytes = contents.byteLength;
    const gzipBytes = gzipSync(contents).byteLength;

    if (asset.type === 'css') initialCssGzip += gzipBytes;
    else initialJsGzip += gzipBytes;

    if (gzipBytes > MAX_ASSET_GZIP) {
        failed = true;
        console.error(
            `[perf:budget] ${asset.relative} is ${(gzipBytes / KIB).toFixed(1)} KiB gzip, over the ${(MAX_ASSET_GZIP / KIB).toFixed(0)} KiB per-asset budget.`,
        );
    }

    rows.push({
        asset: asset.relative,
        type: asset.type,
        'raw (KiB)': (rawBytes / KIB).toFixed(1),
        'gzip (KiB)': (gzipBytes / KIB).toFixed(1),
    });
}

const initialGzip = initialJsGzip + initialCssGzip;

console.table(rows);
console.log(`Initial JS gzip:  ${(initialJsGzip / KIB).toFixed(1)} KiB`);
console.log(`Initial CSS gzip: ${(initialCssGzip / KIB).toFixed(1)} KiB`);
console.log(`Initial total:    ${(initialGzip / KIB).toFixed(1)} KiB`);

if (initialGzip > MAX_INITIAL_GZIP) {
    failed = true;
    console.error(
        `[perf:budget] Initial payload is ${(initialGzip / KIB).toFixed(1)} KiB gzip, over the ${(MAX_INITIAL_GZIP / KIB).toFixed(0)} KiB budget.`,
    );
}

if (failed) {
    process.exit(1);
}

console.log('[perf:budget] All bundle budgets passed.');
