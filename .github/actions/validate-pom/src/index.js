import * as core from "@actions/core";
import { execSync } from "node:child_process";
import fs from "node:fs";

function readPomVersion(pomPath) {
  try {
    const out = execSync(
      `mvn -q -Dexpression=project.version -DforceStdout -f "${pomPath}" help:evaluate`,
      { stdio: ["ignore", "pipe", "pipe"] }
    ).toString().trim();
    if (out) return out;
  } catch {}
  const xml = fs.readFileSync(pomPath, "utf8");
  const m = xml.match(/<version>([^<]+)<\/version>/);
  return m ? m[1].trim() : null;
}

async function run() {
  try {
    const pomPath = core.getInput("pom-path");
    const version = readPomVersion(pomPath);
    if (!version) {
      core.setFailed(`No se pudo obtener la versión desde ${pomPath}`);
      return;
    }
    core.info(`POM version: ${version}`);
    if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) {
      core.setFailed(`'${version}' no cumple x.y.z`);
      return;
    }
    core.setOutput("version", version);
  } catch (e) {
    core.setFailed(e.message || String(e));
  }
}
run();
