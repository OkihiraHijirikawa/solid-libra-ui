import fs from "fs/promises";
import path from "path";

const COMPONENTS_BASE_DIR = path.resolve(
  process.cwd(),
  "packages/ui/src/components"
);

async function analyzeDependencies() {
  console.log("🔍 Analyzing all nested component dependencies...");
  const registry = {};

  // 全てのコンポーネントのパスを検索する
  const componentPaths = await findComponentDirsRecursively(
    COMPONENTS_BASE_DIR
  );

  for (const componentPath of componentPaths) {
    const componentName = path
      .relative(COMPONENTS_BASE_DIR, componentPath)
      .split(path.sep)
      .join("-");

    const npmDependencies = new Set();
    const internalDependencies = new Set();

    const files = await getFilesRecursively(componentPath);
    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;

      const content = await fs.readFile(file, "utf-8");
      const importMatches = content.matchAll(/from ["'](.*?)["']/g);

      for (const match of importMatches) {
        const source = match[1];
        if (source.startsWith(".")) {
          // ローカルの相対パスインポートを解析して内部依存を特定
          const resolvedPath = path.resolve(path.dirname(file), source);
          if (resolvedPath.startsWith(COMPONENTS_BASE_DIR)) {
            const potentialDepPath = path.dirname(resolvedPath);
            if (
              componentPaths.includes(potentialDepPath) &&
              potentialDepPath !== componentPath
            ) {
              const internalDepName = path
                .relative(COMPONENTS_BASE_DIR, potentialDepPath)
                .split(path.sep)
                .join("-");
              internalDependencies.add(internalDepName);
            }
          }
        } else if (source.startsWith("solid-js")) {
          // solid-js は除外
        } else {
          // 外部NPMパッケージ
          let packageName = source;
          // スコープ付きパッケージでない(@で始まらない)かつ、
          // パス区切り(/)を含む場合 (例: "solid-icons/fi")
          if (!packageName.startsWith("@") && packageName.includes("/")) {
            // 最初の "/" までの部分をパッケージ名として抽出する
            packageName = packageName.split("/")[0];
          }
          npmDependencies.add(packageName);
          // // 外部NPMパッケージ
          // npmDependencies.add(source);
        }
      }
    }

    registry[componentName] = {
      path: path.relative(COMPONENTS_BASE_DIR, componentPath),
      dependencies: Array.from(npmDependencies),
      internalDependencies: Array.from(internalDependencies),
    };
  }

  console.log("\n✅ Analysis complete! Here is the generated registry data:\n");
  console.log(JSON.stringify(registry, null, 2));
}

async function findComponentDirsRecursively(startDir) {
  let componentPaths = [];
  const items = await fs.readdir(startDir, { withFileTypes: true });

  const hasIndexFile = items.some(
    (item) => item.name === "index.tsx" && !item.isDirectory()
  );

  // この階層に index.tsx があれば、コンポーネントとしてリストに追加
  if (hasIndexFile) {
    componentPaths.push(startDir);
  }

  // サブディレクトリもチェック
  for (const item of items) {
    if (item.isDirectory()) {
      const nestedPaths = await findComponentDirsRecursively(
        path.join(startDir, item.name)
      );
      componentPaths.push(...nestedPaths);
    }
  }

  return componentPaths;
}

// 指定ディレクトリ以下の全ファイルパスを再帰的に取得
async function getFilesRecursively(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFilesRecursively(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

analyzeDependencies();
