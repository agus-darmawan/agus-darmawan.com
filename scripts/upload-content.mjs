import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BUCKET = "agus-darmawan";
// Only binary assets live on R2 now. MDX (projects/blog) is read from the repo
// at build time by src/lib/content so it can be server-rendered for SEO.
const CONTENT_DIR = "./content/resume";

function getAllFiles(dir, base = "") {
	const entries = readdirSync(dir);
	const files = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry);
		const relativePath = base ? `${base}/${entry}` : entry;

		if (statSync(fullPath).isDirectory()) {
			files.push(...getAllFiles(fullPath, relativePath));
		} else {
			files.push({ fullPath, relativePath });
		}
	}

	return files;
}

const files = getAllFiles(CONTENT_DIR, "resume");
let success = 0;
let failed = 0;

for (const { fullPath, relativePath } of files) {
	try {
		console.log(`⬆️  Uploading: ${relativePath}`);
		execSync(
			// --remote flag: upload ke Cloudflare cloud, bukan local dev instance
			`wrangler r2 object put ${BUCKET}/${relativePath} --file="${fullPath}" --remote`,
			{ stdio: "inherit" },
		);
		success++;
	} catch (err) {
		console.error(`❌ Failed: ${relativePath}`, err.message);
		failed++;
	}
}

console.log(`\n✅ Done — ${success} uploaded, ${failed} failed`);
