import { Card } from "@/components/ui/card";

interface PromptPreviewProps {
  content: string;
}

/**
 * プロンプトテンプレートのプレビュー表示コンポーネント
 *
 * テンプレート内の変数プレースホルダー（{変数名}）をハイライト表示し、
 * ユーザーがテンプレートの構造を視覚的に理解できるようにします。
 */
export default function PromptPreview({ content }: PromptPreviewProps) {
  // 変数プレースホルダー（{変数名}）を紫色でハイライト表示
  // 正規表現で{英数字とアンダースコア}の形式をマッチング
  const highlightedContent = content.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    '<span class="text-violet-500 dark:text-violet-400 font-semibold">{$1}</span>'
  );

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg border border-zinc-100 dark:border-zinc-800">
      <div
        className="whitespace-pre-wrap text-sm font-mono"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
    </Card>
  );
}
