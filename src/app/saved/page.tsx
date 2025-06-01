import { Card } from "@/components/ui/card";
import { Archive } from "lucide-react";

/**
 * サイドバーからプロンプトが選択されていない状態で表示される
 * プレースホルダーページです。
 */
export default function SavedPromptsIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Card className="p-8 sm:p-12 rounded-xl shadow-lg bg-white dark:bg-zinc-950">
        <Archive className="h-16 w-16 mx-auto text-violet-500 mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
          保存済みプロンプト
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
          左側のサイドバーから保存したプロンプトを選択して表示・編集してください。
        </p>
      </Card>
    </div>
  );
}
