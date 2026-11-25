import { access, copyFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const source = join(fileURLToPath(new URL('.', import.meta.url)), 'entry.png');
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const destination = join(outputDir, 'entry.png');
try {
  await access(source);
} catch (error) {
  throw new Error(`Cannot access source file ${source}: ${error instanceof Error ? error.message : String(error)}`);
}
try {
  await mkdir(outputDir, { recursive: true });
  await copyFile(source, destination);
} catch (error) {
  throw new Error(`Failed to copy ${source} to ${destination}: ${error instanceof Error ? error.message : String(error)}`);
}
const [original, copy] = await Promise.all([stat(source), stat(destination)]);
if (original.size !== copy.size) {
  throw new Error(`Copy size mismatch: ${original.size} bytes expected, ${copy.size} bytes copied`);
}
