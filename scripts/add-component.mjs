import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

const REGISTRY_PATH = path.resolve(
  process.cwd(),
  "packages/ui/src/registry.json"
);
const COMPONENTS_BASE_DIR = path.resolve(
  process.cwd(),
  "packages/ui/src/components"
); // ソースのベースパス
const TARGET_DIR_BASE = path.resolve(
  process.cwd(),
  "apps/docs/src/components/ui"
); // ターゲットのベースパス

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
  processed.add(componentName);

  const component = registry[componentName];
  if (!component)
    throw new Error(`Component '${componentName}' not found in registry.`);

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

  console.log(`📦 Adding '${componentName}'...`);
  // ★★★ 修正箇所 No.1 ★★★
  // copyComponentFiles に registry を渡すようにする
  await copyComponentFiles(componentName, registry);
  await installNpmDependencies(component.dependencies);
}

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
//
//           ここがバグを修正したヘルパー関数です
//
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
async function copyComponentFiles(componentName, registry) {
  const componentInfo = registry[componentName];
  if (!componentInfo)
    throw new Error(`Component info for '${componentName}' not found.`);

  // ★★★ 修正箇所 No.2 ★★★
  // registryの "path" プロパティを使って正しいソースとターゲットのパスを構築する
  const sourceDir = path.resolve(COMPONENTS_BASE_DIR, componentInfo.path);
  const targetDir = path.resolve(TARGET_DIR_BASE, componentInfo.path);

  try {
    await fs.access(targetDir);
    console.log(
      `  👍 Files for '${componentName}' already exist. Skipping copy.`
    );
    return;
  } catch {}

  // fs.cp は親ディレクトリも自動で作ってくれるので mkdir は不要
  await fs.cp(sourceDir, targetDir, { recursive: true });
  console.log(
    `  - Copied files for '${componentName}' from '${componentInfo.path}'`
  );
}

async function installNpmDependencies(dependencies) {
  if (!dependencies || dependencies.length === 0) return;

  const depsString = dependencies.join(" ");
  console.log(`  📥 Installing NPM deps: ${depsString}...`);

  const command = `pnpm add ${depsString}`;
  await execPromise(command, { cwd: path.resolve(process.cwd(), "apps/docs") });
}

main();
