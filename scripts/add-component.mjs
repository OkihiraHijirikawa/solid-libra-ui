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
  let effectiveComponentName = componentName;
  let component = registry[effectiveComponentName];

  // もし指定された名前で見つからず、"button-button" のような
  // ネストされた名前が存在する場合は、そちらを優先的に採用する
  const nestedComponentName = `${componentName}-${componentName}`;
  if (!component && registry[nestedComponentName]) {
    console.log(
      `  ℹ️  Note: Resolving '${componentName}' as nested component '${nestedComponentName}'.`
    );
    effectiveComponentName = nestedComponentName;
    component = registry[effectiveComponentName];
  }

  if (processed.has(effectiveComponentName)) return;
  processed.add(effectiveComponentName);

  if (!component)
    throw new Error(`Component '${componentName}' not found in registry.`);

  // 以降の処理では、解決済みの名前(effectiveComponentName)を使う
  if (
    component.internalDependencies &&
    component.internalDependencies.length > 0
  ) {
    console.log(
      `  - Component '${effectiveComponentName}' depends on: [${component.internalDependencies.join(
        ", "
      )}]`
    );
    for (const dep of component.internalDependencies) {
      await addComponentRecursive(dep, registry, processed);
    }
  }

  console.log(`📦 Adding '${effectiveComponentName}'...`);
  await copyComponentFiles(effectiveComponentName, registry); // 解決済みの名前を渡す
  await installNpmDependencies(component.dependencies);
}

async function copyComponentFiles(componentName, registry) {
  const componentInfo = registry[componentName];
  if (!componentInfo)
    throw new Error(`Component info for '${componentName}' not found.`);

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

  const command = `pnpm add --filter docs ${depsString}`;

  try {
    // 実行ディレクトリ(cwd)は monorepoのルート(process.cwd())のままでOK
    await execPromise(command, { cwd: process.cwd() });
  } catch (error) {
    console.error(`❌ Failed to install NPM dependencies for 'docs'.`);
    console.error("Error:", error.stderr || error.message);
    // 失敗しても処理を続行したい場合は、以下の行をコメントアウトまたは削除
    process.exit(1);
  }
}

main();
