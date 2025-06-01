"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import type { Frontmatter, SavedPromptData } from "@/lib/markdown/types";
import { EvaluateResult } from "next-mdx-remote-client/rsc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SavedPromptClientProps {
  // コンパイル済みの表示用データ
  mdxResult: EvaluateResult<Frontmatter>;
  promptId: string;
  // コピー用のコンパイル前のデータ
  promptData: SavedPromptData;
}

/**
 * 保存済みプロンプトの詳細表示・操作コンポーネント
 *
 * MDXコンテンツの表示、評価の変更、コピー機能などを提供します。
 * クライアントサイドでの状態管理とAPI通信を担当します。
 */
export default function SavedPromptClient({
  mdxResult,
  promptId,
  promptData,
}: SavedPromptClientProps) {
  const { frontmatter: initialFrontmatter } = mdxResult;
  const [currentRating, setCurrentRating] = useState<number | null>(
    initialFrontmatter.rating
  );
  const [displayFrontmatter, setDisplayFrontmatter] =
    useState<Frontmatter>(initialFrontmatter);
  const [, startTransition] = useTransition();
  const router = useRouter();

  // プロパティが変更された際の状態同期
  useEffect(() => {
    setDisplayFrontmatter(initialFrontmatter);
    setCurrentRating(initialFrontmatter.rating);
  }, [initialFrontmatter]);

  /**
   * 評価の変更処理
   *
   * 楽観的更新を行い、API呼び出しが失敗した場合は元の状態に戻します。
   */
  const handleRatingChange = async (newRating: number) => {
    if (newRating === currentRating) return;
    const oldRating = currentRating;

    // 楽観的更新: UIを先に更新
    setCurrentRating(newRating);
    setDisplayFrontmatter((prev) => ({ ...prev, rating: newRating }));

    try {
      const response = await fetch("/api/update-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: promptId, rating: newRating }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "評価の更新に失敗しました。");
      }

      const result = await response.json();

      if (result.isPreview) {
        toast.success("プレビュー評価更新", {
          description:
            "このデモでは実際のファイル更新は行われません。ローカル環境では完全に動作します。",
        });
      } else {
        toast.success("評価を更新しました。");
      }

      // ページデータを再取得してサーバー状態と同期
      startTransition(() => {
        router.refresh();
      });
    } catch (error: unknown) {
      // エラー時は元の状態に戻す
      setCurrentRating(oldRating);
      setDisplayFrontmatter((prev) => ({ ...prev, rating: oldRating }));
      if (error instanceof Error) {
        toast.error("評価エラー", { description: error.message });
      } else {
        toast.error("評価エラー", {
          description: "不明なエラーが発生しました。",
        });
      }
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptData.content);
    toast.success("クリップボードにコピーしました");
  };

  // MDXレンダリング失敗時のフォールバックコンポーネント
  const FallbackComponent = () => (
    <div className="text-red-600">
      MDX Content rendering failed. Check console log in server component.
    </div>
  );

  const mdxError = mdxResult?.error;
  const mdxFrontmatter = mdxResult?.frontmatter;

  // MDXエラーがある場合はエラー表示
  if (mdxError) {
    return (
      <div className="text-red-500 p-4 border border-red-500 rounded-md">
        <h3>MDXコンテンツの表示エラー</h3>
        <p>{mdxError.message || "不明なエラー"}</p>
        <pre className="mt-2 text-xs whitespace-pre-wrap bg-red-50 p-2 rounded">
          {mdxError.stack}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー部分: タイトルと戻るリンク */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {displayFrontmatter.title ||
              (mdxFrontmatter?.title as string) ||
              "プロンプト"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            保存日:{" "}
            {new Date(
              (mdxFrontmatter?.createdAt as string) ||
                displayFrontmatter.createdAt
            ).toLocaleDateString()}{" "}
            | 元テンプレートID:{" "}
            {(mdxFrontmatter?.templateId as string) ||
              displayFrontmatter.templateId}
          </p>
        </div>
      </div>

      {/* メインコンテンツカード */}
      <Card className="rounded-xl border-0 shadow-sm overflow-hidden">
        <div className="bg-white dark:bg-zinc-950 p-6">
          {/* プロンプト内容ヘッダーと星評価 */}
          <div className="flex items-center justify-between mb-4">
            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="rounded-full"
              >
                <Clipboard className="h-4 w-4 mr-2" />
                コピー
              </Button>
            </div>
            {/* 星評価 */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Button
                  key={starValue}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRatingChange(starValue)}
                  className={cn(
                    "rounded-full h-7 w-7 p-0",
                    currentRating !== null && starValue <= currentRating
                      ? "text-amber-400 hover:text-amber-500"
                      : "text-zinc-300 hover:text-zinc-400 dark:text-zinc-600 dark:hover:text-zinc-500"
                  )}
                  aria-label={`Rate ${starValue} star${
                    starValue > 1 ? "s" : ""
                  }`}
                >
                  <Star
                    className={cn(
                      "h-5 w-5",
                      currentRating !== null &&
                        starValue <= currentRating &&
                        "fill-amber-400"
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* MDXコンテンツ表示エリア */}
          <div className="prose prose-zinc dark:prose-invert max-w-none bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 min-h-[200px]">
            <Suspense fallback={<FallbackComponent />}>
              {mdxResult.content}
            </Suspense>
          </div>
        </div>
      </Card>
    </div>
  );
}
