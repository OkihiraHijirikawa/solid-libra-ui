import fs from "fs/promises";
import path from "path";

// ユーザーのプロジェクトのルートパス
const projectRoot = process.cwd();

const targetCssPath = path.resolve(projectRoot, "src/app.css"); // ユーザーのCSSパス（仮）
const configPath = path.resolve(projectRoot, "libra.config.json");

// Libra UIがインストールされた場所にあるCSSファイルのパスを取得
const sourceCssPath = path.resolve(
  path.dirname(import.meta.url.replace("file://", "")),
  "../..", // これはあなたのプロジェクト構造に依存します
  "packages/ui/src/styles/Libra.css"
);

const defaultConfig = {
  style: "default",
  tailwind: {
    config: "tailwind.config.cjs",
    css: "src/app.css",
    baseColor: "slate",
  },
  aliases: {
    components: "~/components",
    utils: "~/lib/utils",
  },
  paths: {
    components: "src/components/ui",
  },
};

async function initializeStyles() {
  try {
    await fs.access(configPath);
    console.log("✅ Config file already exists. Skipping creation.");
  } catch {
    await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`✅ Created config file: ${configPath}`);
  }

  try {
    console.log("🎨 Initializing base styles...");

    // 1. Libra.css (色の変数定義) の内容を読み込む
    const libraCssContent = await fs.readFile(sourceCssPath, "utf-8");

    // 2. 既存の app.css の内容を読み込む
    const appCssContent = await fs.readFile(targetCssPath, "utf-8");

    // 3. Libra.css がまだインポートされていないか確認
    if (appCssContent.includes("/* Libra UI Base Styles */")) {
      console.log("✅ Base styles already exist. Skipping.");
      return;
    }

    // 4. Libra.cssの内容をapp.cssの先頭に追記する
    const combinedCss = `/* Libra UI Base Styles - Injected */\n\n${libraCssContent}\n\n/* --- Original app.css content below --- */\n\n${appCssContent}`;

    await fs.writeFile(targetCssPath, combinedCss);

    console.log("✅ Successfully added base styles to 'apps/docs/src/app.css'");
  } catch (error) {
    console.error("❌ Failed to initialize styles:", error);
    process.exit(1);
  }
}

initializeStyles();
