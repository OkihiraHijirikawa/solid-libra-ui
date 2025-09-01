import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

// --- 1. パスの設定 ---
// このスクリプトは、ユーザーのプロジェクトで実行されることを前提とします。

// ユーザーのプロジェクトのルートディレクトリ (例: /home/user/my-solid-app)
const CWD = process.cwd();

// このスクリプトファイル(__filename)自身の場所を取得
const __filename = fileURLToPath(import.meta.url);
// このスクリプトファイルがあるディレクトリ(__dirname)の場所を取得
const __dirname = path.dirname(__filename);

// ソースファイルの場所 (npm installされた後の、node_modules内のこのパッケージの場所)
// publishされるファイル構造を想定し、スクリプトからの相対パスで指定します。
const SOURCE_REGISTRY_PATH = path.resolve(__dirname, "../src/registry.json");
const SOURCE_COMPONENTS_BASE_DIR = path.resolve(__dirname, "../src/components");

async function main() {
  // --- 2. 設定ファイルの読み込み ---
  // ユーザーのプロジェクトにあるはずの libra.config.json を探します。
  const configPath = path.resolve(CWD, "libra.config.json");
  let config;
  try {
    const rawConfig = await fs.readFile(configPath, "utf-8");
    config = JSON.parse(rawConfig);
  } catch (error) {
    console.error("❌ Configuration file 'libra.config.json' not found.");
    console.log("👉 Please run 'npx solid-libra-ui init' to create one.");
    process.exit(1);
  }

  // 設定ファイルからコンポーネントのインストール先パスを取得します。
  if (!config.paths?.components) {
    console.error(
      "❌ The 'paths.components' property is missing in your 'libra.config.json'."
    );
    process.exit(1);
  }
  const TARGET_DIR_BASE = path.resolve(CWD, config.paths.components);

  // --- 3. コマンドライン引数の解析 ---
  // npx solid-libra-ui add [component1] [component2] ...
  const componentsToAdd = process.argv.slice(2);
  if (componentsToAdd.length === 0) {
    console.error("❌ Please specify at least one component to add.");
    console.log("👉 Example: npx solid-libra-ui add button card");
    process.exit(1);
  }

  // --- 4. メイン処理の実行 ---
  try {
    const registry = JSON.parse(
      await fs.readFile(SOURCE_REGISTRY_PATH, "utf-8")
    );
    const processedComponents = new Set();

    console.log(`🚀 Starting to add ${componentsToAdd.length} component(s)...`);
    for (const componentName of componentsToAdd) {
      await addComponentRecursive(
        componentName,
        registry,
        processedComponents,
        TARGET_DIR_BASE
      );
    }

    // 依存関係のあるNPMパッケージを最後にまとめてインストール
    const allNpmDeps = new Set();
    for (const compName of processedComponents) {
      registry[compName]?.dependencies?.forEach((dep) => allNpmDeps.add(dep));
    }
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
  if (processed.has(componentName)) {
    return; // すでに追加済みならスキップ
  }

  const component = registry[componentName];
  if (!component) {
    throw new Error(`Component '${componentName}' not found in registry.`);
  }

  // 内部依存関係を先に再帰的に処理
  if (
    component.internalDependencies &&
    component.internalDependencies.length > 0
  ) {
    console.log(
      `  - '${componentName}' needs: [${component.internalDependencies.join(
        ", "
      )}]`
    );
    for (const dep of component.internalDependencies) {
      await addComponentRecursive(dep, registry, processed, targetBaseDir);
    }
  }

  console.log(`📦 Adding '${componentName}'...`);
  await copyComponentFiles(componentName, registry, targetBaseDir);

  // このコンポーネントが処理済みであることを記録
  processed.add(componentName);
}

async function copyComponentFiles(componentName, registry, targetBaseDir) {
  const componentInfo = registry[componentName];
  if (!componentInfo) {
    throw new Error(`Component info for '${componentName}' not found.`);
  }

  // ソース(node_modules/solid-libra-ui/src/components/...)と
  // ターゲット(ユーザーのプロジェクト/src/components/ui/...)のパスを構築
  const sourceDir = path.resolve(
    SOURCE_COMPONENTS_BASE_DIR,
    componentInfo.path
  );
  const targetDir = path.resolve(targetBaseDir, componentInfo.path);

  try {
    // ターゲットディレクトリが既に存在するかチェック
    await fs.access(targetDir);
    console.log(
      `  👍 Files for '${componentName}' already exist. Skipping copy.`
    );
    return;
  } catch {
    // 存在しない場合のみコピーを実行
    await fs.cp(sourceDir, targetDir, { recursive: true });
    console.log(
      `  - Copied files for '${componentName}' to '${config.paths.components}/${componentInfo.path}'`
    );
  }
}

async function installNpmDependencies(dependencies) {
  if (!dependencies || dependencies.length === 0) {
    return;
  }

  const depsString = dependencies.join(" ");
  console.log(`\n📥 Installing required NPM dependencies: ${depsString}...`);

  // ユーザーのプロジェクトルートで 'npm install' を実行
  const command = `npm install ${depsString}`;
  try {
    await execPromise(command, { cwd: CWD });
    console.log("  - Dependencies installed successfully.");
  } catch (error) {
    console.error(
      `❌ Failed to install NPM dependencies. Please install them manually:`
    );
    console.error(`   ${command}`);
  }
}

// スクリプトを実行
main();
