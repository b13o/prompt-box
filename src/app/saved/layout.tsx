import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllSavedPromptsMetadata } from "@/lib/markdown/saved-prompts";
import { cn } from "@/lib/utils";

/**
 * 保存済みプロンプトページのレイアウト
 *
 * サイドバーにプロンプト一覧を表示し、メインエリアに選択された
 * プロンプトの詳細を表示する2カラムレイアウトを提供します。
 */
export default async function SavedPromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prompts = await getAllSavedPromptsMetadata();

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* サイドバー: プロンプト一覧 */}
      <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
        <h2 className="text-lg font-semibold mb-4 px-2">保存済みプロンプト</h2>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <nav className="flex flex-col gap-1">
            {prompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/saved/${prompt.id}`}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <div className="font-medium truncate">{prompt.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
            {prompts.length === 0 && (
              <p className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                保存されたプロンプトはありません。
              </p>
            )}
          </nav>
        </ScrollArea>
      </aside>
      {/* メインコンテンツエリア */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
