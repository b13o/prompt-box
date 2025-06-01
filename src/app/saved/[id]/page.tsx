import { notFound } from "next/navigation";
import {
  getSavedPromptData,
  getSavedPromptIds,
} from "@/lib/markdown/saved-prompts";
import SavedPromptClient from "./_components/saved-prompt-client";
import { compileMdx } from "@/lib/markdown/mdx-utils";

/**
 * 個別の保存済みプロンプト表示ページ
 *
 * URLパラメータのIDに基づいてプロンプトデータを取得し、
 * MDXコンテンツをコンパイルしてクライアントコンポーネントに渡します。
 */
export default async function SavedPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: promptId } = await params;
  const promptData = await getSavedPromptData(promptId);

  // プロンプトが存在しない場合は404ページを表示
  if (!promptData) {
    notFound();
  }

  // MDXコンテンツのコンパイル
  const mdxResult = await compileMdx(promptId);

  // MDXエラーをログに記録（クライアント側で処理される）
  if (mdxResult.error) {
    console.error(
      "MDX Evaluation Error (will be handled by MDXClient):",
      promptId,
      mdxResult.error
    );
  }

  return (
    <SavedPromptClient
      mdxResult={mdxResult}
      promptId={promptId}
      promptData={promptData}
    />
  );
}

/**
 * 静的パラメータの生成
 *
 * ビルド時に全ての保存済みプロンプトIDを取得して、
 * 静的ページとして事前生成します。
 */
export async function generateStaticParams() {
  const ids = getSavedPromptIds();
  return ids.map((id) => ({ id }));
}

// 動的パラメータを許可（新しいプロンプトが追加された場合に対応）
export const dynamicParams = true;
