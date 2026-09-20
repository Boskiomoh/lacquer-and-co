// Copies the deliberately broken legacy site into public/before so it is
// served byte-for-byte at /before. Runs before dev and build.
import { cpSync, rmSync } from "node:fs";

rmSync("public/before", { recursive: true, force: true });
cpSync("legacy", "public/before", { recursive: true });
console.log("legacy site copied to public/before");
