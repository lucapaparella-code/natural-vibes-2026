import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const rootDir = process.cwd();
const galleryDir = join(rootDir, "public", "images", "gallery");
const outputFile = join(rootDir, "src", "generated", "galleryManifest.ts");
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const files = readdirSync(galleryDir)
  .filter((file) => !file.startsWith("."))
  .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file))
  .sort((a, b) => collator.compare(a, b));

const content = `export const GALLERY_FILES = ${JSON.stringify(files, null, 2)} as const;\n`;

mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, content);
