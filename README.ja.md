# Libra UI

**開発者体験(DX)とユーザー体験(UX)、その両方を最高に。**

SolidJS のための、美しく、アクセシブルで、カスタマイズ性の高い UI コンポーネント集。

[![NPM version](https://img.shields.io/npm/v/solid-libra-ui.svg)](https://www.npmjs.com/package/solid-libra-ui)
[![ライセンス](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/OkihiraHijirikawa/solid-libra-ui/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/OkihiraHijirikawa/solid-libra-ui?style=social)](https://github.com/OkihiraHijirikawa/solid-libra-ui/stargazers)

## 概要

**Libra UI** は、SolidJS のための UI コンポーネントライブラリです。

これはコンポーネントライブラリですが、npm パッケージとして`import`して使うものではありません。代わりに、CLI ツールを使って**あなたのソースコードに直接コンポーネントを追加**し、100%あなたの管理下に置くことができます。

### なぜこの方式なのか？

- **完全な所有権:** コンポーネントはあなたのコードベースの一部です。サードパーティの抽象化に悩まされることなく、自由にスタイルやロジックをカスタマイズできます。
- **学習の促進:** コンポーネントの内部実装がブラックボックス化されません。直接コードを見て学ぶことができます。
- **依存からの解放:** 巨大なライブラリ全体を`node_modules`に追加する必要はありません。必要なものだけを選んで使えます。

## インストールと使い方

Libra UI は CLI ツールを使って簡単にセットアップできます。

### 1. 初期化

まず、あなたの SolidJS プロジェクトで以下のコマンドを実行します。
これにより、設定ファイル(`libra.config.json`)が生成され、基本的な CSS 変数があなたのスタイルシートに注入されます。

```bash
npx solid-libra-ui@latest init
2. コンポーネントの追加
次に、addコマンドを使って、必要なコンポーネントをプロジェクトに追加します。依存関係のあるコンポーネントは自動的に追加されます。
code
Bash
npx solid-libra-ui@latest add [component-name]
例:
code
Bash
# button コンポーネントを1つだけ追加
npx solid-libra-ui@latest add button

# dialog と input コンポーネントを一度に追加
npx solid-libra-ui@latest add dialog input
3. コンポーネントの利用
コンポーネントを追加すると、libra.config.jsonで指定したディレクトリ（デフォルト: src/components/ui）にファイルが作成されます。あとは、通常のSolidJSコンポーネントとしてインポートして使用するだけです。
code
Tsx
import { Button } from "./components/ui/button";

const MyPage = () => {
  return (
    <div class="grid place-items-center h-screen">
      <Button onClick={() => alert("Hello Libra UI!")}>
        Click Me
      </Button>
    </div>
  );
};

export default MyPage;
利用可能なコンポーネント
コンポーネント	ステータス
Accordion	✅
Avatar	✅
Button	✅
Calendar	✅
Card	✅
Checkbox	✅
Combobox	✅
Date Picker	✅
Dialog	✅
Drawer	✅
Icon Button	✅
Input	✅
Number Input	✅
Popover	✅
Radio Group	✅
Selector	✅
Table	✅
Textarea	✅
今後のロードマップ
現在、以下のコンポーネントと機能の実装を計画しています。

Carousel

Pagination

Editable Table

Dark Mode のテーマ切り替え機能

Badge

Chart (グラフ機能)

...その他、コミュニティからの要望に応じて！
コントリビューション
バグ報告、機能提案、プルリクエストを心から歓迎します！ SolidJSのエコシステムを一緒に盛り上げていきましょう。
貢献したい方は、まずGitHub Issuesで議論を始めるか、既存のIssueに取り組んでください。
ライセンス
このプロジェクトは MITライセンス の下で公開されています。誰でも心置きなく、商用・非商用を問わず自由にご利用いただけます。
```
