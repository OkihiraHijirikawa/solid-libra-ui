import fs from "fs/promises";
import path from "path";

const sourceCssPath = path.resolve(
  process.cwd(),
  "packages/ui/src/styles/Libra.css"
);
const targetCssPath = path.resolve(process.cwd(), "apps/docs/src/app.css");

async function initializeStyles() {
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
