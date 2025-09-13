import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ユーザーのプロジェクトのルートパス
const projectRoot = process.cwd();

const targetCssPath = path.resolve(projectRoot, "src/app.css");
const configPath = path.resolve(projectRoot, "libra.config.json");

// npm installされたパッケージ内のCSSファイルのパスを安全に取得
const sourceCssPath = path.resolve(__dirname, "../src/styles/Libra.css");

const defaultConfig = {
  style: "default",
  tailwind: {
    config: "tailwind.config.js", // .cjs, .tsなども考慮
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

async function initialize() {
  // 1. 設定ファイルの作成
  try {
    await fs.access(configPath);
    console.log("✅ Config file 'libra.config.json' already exists. Skipping.");
  } catch {
    await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log("✅ Created config file: libra.config.json");
  }

  // 2. スタイルの初期化
  try {
    console.log("🎨 Initializing base styles in 'src/app.css'...");
    const libraCssContent = await fs.readFile(sourceCssPath, "utf-8");

    let appCssContent = "";
    try {
      appCssContent = await fs.readFile(targetCssPath, "utf-8");
    } catch {
      console.log("  - 'src/app.css' not found. Creating a new one.");
    }

    if (appCssContent.includes("/* Libra UI Base Styles */")) {
      console.log("✅ Base styles already exist. Skipping.");
      return;
    }

    const combinedCss = `/* Libra UI Base Styles */\n${libraCssContent}\n\n${appCssContent}`;
    await fs.writeFile(targetCssPath, combinedCss);
    console.log("✅ Successfully added base styles.");
  } catch (error) {
    console.error("❌ Failed to initialize styles:", error);
    process.exit(1);
  }
}

initialize();
