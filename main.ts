import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const assetPath = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
const targetDirectory = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const targetPath = join(targetDirectory, 'entry.png');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let image: Buffer;
try {
  image = readFileSync(assetPath);
} catch (cause) {
  throw new Error(`Unable to read PNG asset at ${assetPath}`, { cause });
}

if (image.length < pngSignature.length || !image.subarray(0, pngSignature.length).equals(pngSignature)) {
  throw new Error(`Invalid PNG signature in ${assetPath}`);
}

try {
  mkdirSync(targetDirectory, { recursive: true });
  writeFileSync(targetPath, image);
  const writtenSize = statSync(targetPath).size;
  if (writtenSize !== image.length) {
    throw new Error(`Expected ${image.length} bytes but wrote ${writtenSize}`);
  }
} catch (cause) {
  throw new Error(`Unable to write verified image to ${targetPath}`, { cause });
}
