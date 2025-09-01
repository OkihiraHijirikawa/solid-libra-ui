import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// このファイル自身の場所を基準に、他のスクリプトのパスを解決する
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  let scriptToRun;

  switch (command) {
    case "init":
      // init-ui.mjs を呼び出すように指定
      scriptToRun = path.resolve(__dirname, "init-ui.mjs");
      break;
    case "add":
      // add-component.mjs を呼び出すように指定
      scriptToRun = path.resolve(__dirname, "add-component.mjs");
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log("👉 Available commands: init, add");
      process.exit(1);
  }

  // 子プロセスとしてスクリプトを実行する
  // これにより、引数（例: "button"）もそのまま渡せる
  const child = spawn("node", [scriptToRun, ...args.slice(1)], {
    stdio: "inherit", // 親プロセスのコンソール出力を共有
  });

  child.on("error", (error) => {
    console.error(`Execution error: ${error}`);
  });
};

main();
