import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

const REGISTRY_PATH = path.resolve(
  process.cwd(),
  "packages/ui/src/registry.json"
);
const TARGET_DIR_BASE = path.resolve(
  process.cwd(),
  "apps/docs/src/components/ui"
);

async function main() {
  const initialComponent = process.argv[2];
  if (!initialComponent) {
    console.error("❌ Please specify a component name.");
    process.exit(1);
  }

  try {
    const registry = JSON.parse(await fs.readFile(REGISTRY_PATH, "utf-8"));
    const processedComponents = new Set();

    console.log(`🚀 Starting to add component: ${initialComponent}`);
    await addComponentRecursive(
      initialComponent,
      registry,
      processedComponents
    );
    console.log("\n✅ All components and dependencies added successfully!");
  } catch (error) {
    console.error(`\n❌ An error occurred: ${error.message}`);
    process.exit(1);
  }
}

async function addComponentRecursive(componentName, registry, processed) {
  if (processed.has(componentName)) return;

  const component = registry[componentName];

  if (!component)
    throw new Error(`Component '${componentName}' not found in registry.`);

  processed.add(componentName);

  // 先に自身のファイルコピーとnpmインストールを行う
  console.log(`📦 Adding '${componentName}'...`);
  await copyComponentFiles(componentName, component);
  await installNpmDependencies(component.dependencies);

  // その後、依存関係の解決を再帰的に行う
  if (
    component.internalDependencies &&
    component.internalDependencies.length > 0
  ) {
    console.log(
      `  - Component '${componentName}' depends on: [${component.internalDependencies.join(
        ", "
      )}]`
    );
    for (const dep of component.internalDependencies) {
      await addComponentRecursive(dep, registry, processed);
    }
  }
}

async function copyComponentFiles(componentName, componentInfo) {
  const sourceDir = path.resolve(process.cwd(), componentInfo.path);
  const targetSubPath = componentInfo.path.replace(
    "packages/ui/src/components/",
    ""
  );
  const targetDir = path.resolve(TARGET_DIR_BASE, targetSubPath);

  try {
    await fs.access(targetDir);
    console.log(
      `  👍 Files for '${componentName}' already exist. Skipping copy.`
    );
    return;
  } catch {}

  // fs.cp は親ディレクトリも自動で作ってくれる
  await fs.cp(sourceDir, targetDir, { recursive: true });
  console.log(
    `  - Copied all files for '${componentName}' to '${path.relative(
      process.cwd(),
      targetDir
    )}'`
  );
}

async function installNpmDependencies(dependencies) {
  if (!dependencies || dependencies.length === 0) return;

  const depsString = dependencies.join(" ");
  console.log(`  📥 Installing NPM deps for docs: ${depsString}...`);

  const command = `pnpm add --filter docs ${depsString}`;

  try {
    await execPromise(command, { cwd: process.cwd() });
  } catch (error) {
    console.error(`❌ Failed to install NPM dependencies for 'docs'.`);
    console.error("Error:", error.stderr || error.message);
    process.exit(1);
  }
}

main();
