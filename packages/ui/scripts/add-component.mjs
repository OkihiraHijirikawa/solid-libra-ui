import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ユーザーのプロジェクトのルート
const CWD = process.cwd();

// 公開されたパッケージ内のソースパス
const SOURCE_REGISTRY_PATH = path.resolve(__dirname, "../src/registry.json");
const SOURCE_COMPONENTS_BASE_DIR = path.resolve(__dirname, "../src/components");

async function main() {
  const configPath = path.resolve(CWD, "libra.config.json");
  let config;
  try {
    config = JSON.parse(await fs.readFile(configPath, "utf-8"));
  } catch (error) {
    console.error("❌ 'libra.config.json' not found.");
    console.log("👉 Please run 'npx solid-libra-ui init' first.");
    process.exit(1);
  }

  const TARGET_DIR_BASE = path.resolve(CWD, config.paths.components);
  const componentsToAdd = process.argv.slice(2);

  if (componentsToAdd.length === 0) {
    console.error("❌ Please specify at least one component to add.");
    process.exit(1);
  }

  try {
    const registry = JSON.parse(
      await fs.readFile(SOURCE_REGISTRY_PATH, "utf-8")
    );
    const processedComponents = new Set();
    const allNpmDeps = new Set();

    for (const componentName of componentsToAdd) {
      await addComponentRecursive(
        componentName,
        registry,
        processedComponents,
        TARGET_DIR_BASE
      );
    }

    processedComponents.forEach((compName) => {
      registry[compName]?.dependencies?.forEach((dep) => allNpmDeps.add(dep));
    });

    await installNpmDependencies(Array.from(allNpmDeps));

    console.log("\n✅ All components and dependencies added successfully!");
  } catch (error) {
    console.error(`\n❌ An error occurred: ${error.message}`);
    process.exit(1);
  }
}

async function addComponentRecursive(
  componentName,
  registry,
  processed,
  targetBaseDir
) {
  if (processed.has(componentName)) return;

  const component = registry[componentName];
  if (!component) {
    throw new Error(`Component '${componentName}' not found in registry.`);
  }

  processed.add(componentName);

  // 先に自身のファイルをコピー
  console.log(`📦 Adding '${componentName}'...`);
  await copyComponentFiles(component, targetBaseDir);

  // その後、依存関係を処理
  if (component.internalDependencies?.length > 0) {
    console.log(
      `  - '${componentName}' needs: [${component.internalDependencies.join(
        ", "
      )}]`
    );
    for (const dep of component.internalDependencies) {
      await addComponentRecursive(dep, registry, processed, targetBaseDir);
    }
  }
}

async function copyComponentFiles(componentInfo, targetBaseDir) {
  const sourceDir = path.resolve(
    SOURCE_COMPONENTS_BASE_DIR,
    componentInfo.path
  );
  const targetDir = path.resolve(targetBaseDir, componentInfo.path);

  try {
    await fs.access(targetDir);
    console.log(
      `  👍 Component '${path.basename(
        componentInfo.path
      )}' already exists. Skipping.`
    );
    return;
  } catch {}

  await fs.cp(sourceDir, targetDir, { recursive: true });
  console.log(
    `  - Copied to '${path.join(
      targetBaseDir.split(path.sep).slice(-2).join("/"),
      componentInfo.path
    )}'`
  );
}

async function installNpmDependencies(dependencies) {
  if (dependencies.length === 0) return;

  const depsString = dependencies.join(" ");
  console.log(`\n📥 Installing required NPM dependencies: ${depsString}...`);

  const command = `npm install ${depsString}`;
  try {
    await execPromise(command, { cwd: CWD });
    console.log("  - Dependencies installed successfully.");
  } catch (error) {
    console.error(`❌ Failed to install dependencies. Please run manually:`);
    console.error(`   ${command}`);
  }
}

main();
