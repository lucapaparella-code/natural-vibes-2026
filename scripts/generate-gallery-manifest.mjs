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

const gallery2024Dir = join(rootDir, "public", "foto 2024");
const gallery2024Output = join(rootDir, "src", "generated", "gallery2024Manifest.ts");
const covers2024 = ["_MG_8006.webp", "0H7A2321.webp", "_MG_8361.webp", "_MG_8285.webp"];
const files2024 = readdirSync(gallery2024Dir)
  .filter(file => !file.startsWith(".") && /\.webp$/i.test(file))
  .sort((a, b) => collator.compare(a, b));
const ordered2024 = [...covers2024.filter(file => files2024.includes(file)), ...files2024.filter(file => !covers2024.includes(file))];
writeFileSync(gallery2024Output, `export const GALLERY_2024_FILES = ${JSON.stringify(ordered2024, null, 2)} as const;\n`);
