import * as core from "@actions/core";
import { execSync } from "node:child_process";

try {
  const expected = core.getInput("required-version");
  const nodeV = execSync("node -v").toString().trim().replace(/^v/, "");
  core.info(`Node actual: ${nodeV} | requerido: ${expected}`);

  // soporta comodín menor: 20.x
  const pattern = new RegExp("^" + expected.replace(".x", "\\.[0-9]+") + "$");
  if (!pattern.test(nodeV)) {
    core.setFailed(`Node ${nodeV} no cumple ${expected}`);
  }
} catch (e) {
  core.setFailed(e.message || String(e));
}
