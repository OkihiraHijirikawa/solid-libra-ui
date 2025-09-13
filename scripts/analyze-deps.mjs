import fs from "fs/promises";
import path from "path";

const COMPONENTS_BASE_DIR = path.resolve(
  process.cwd(),
  "packages/ui/src/components"
);

async function analyzeDependencies() {
  const registry = {};

  // 全てのコンポーネントのパスを探す
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
          const resolvedPath = path.resolve(path.dirname(file), source);

          // 解決されたパスが、他のどのコンポーネントディレクトリに属するかをチェック
          for (const depPath of componentPaths) {
            // 自分自身への参照は除外する
            if (depPath === componentPath) continue;

            // 解決されたパスが、他のコンポーネントのディレクトリパスそのものか、
            // またはそのディレクトリの内部を指しているかを判定
            // (例: "./button" のような拡張子なしインポートに対応)
            if (
              resolvedPath === depPath ||
              resolvedPath.startsWith(depPath + path.sep)
            ) {
              const internalDepName = path
                .relative(COMPONENTS_BASE_DIR, depPath)
                .split(path.sep)
                .join("-");
              internalDependencies.add(internalDepName);
              break; // 依存関係が特定できたらループを抜ける
            }
          }
        } else if (source.startsWith("solid-js")) {
          // solid-js は除外
        } else {
          // 外部NPMパッケージ
          let packageName = source;
          if (!packageName.startsWith("@") && packageName.includes("/")) {
            packageName = packageName.split("/")[0];
          }
          npmDependencies.add(packageName);
        }
      }
    }

    registry[componentName] = {
      path: path.relative(process.cwd(), componentPath), // ルートからの相対パスに変更
      dependencies: Array.from(npmDependencies),
      internalDependencies: Array.from(internalDependencies),
    };
  }

  console.log(JSON.stringify(registry, null, 2));
}

async function findComponentDirsRecursively(startDir) {
  let componentPaths = [];
  const items = await fs.readdir(startDir, { withFileTypes: true });

  const hasIndexFile = items.some(
    (item) => item.name === "index.tsx" && !item.isDirectory()
  );

  if (hasIndexFile) {
    componentPaths.push(startDir);
  }

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
