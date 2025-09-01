import { cva } from "class-variance-authority";

/** Card: ルート要素 */
export const cardVariants = cva(
  "rounded-sm bg-background text-foreground shadow-md"
);

/** CardHeader: ヘッダーセクション */
export const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-6");

/** CardTitle: タイトル (h3を想定) */
export const cardTitleVariants = cva(
  "text-lg font-semibold leading-none tracking-tight"
);

/** CardDescription: 説明文 (pを想定) */
export const cardDescriptionVariants = cva("text-sm text-gray-500");

/** CardContent: メインコンテンツエリア */
export const cardContentVariants = cva("p-6 pt-0");

/** CardFooter: フッターセクション */
export const cardFooterVariants = cva("flex items-center p-6 pt-0");
