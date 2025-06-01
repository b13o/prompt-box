import { evaluate, type EvaluateResult } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import type { Frontmatter } from "@/lib/markdown/types";
import { getSavedPromptRawContent } from "./saved-prompts";
import { notFound } from "next/navigation";

/**
 * MDXコンテンツをコンパイルしてReactコンポーネントに変換
 *
 * MDX文字列とフロントマターを受け取り、next-mdx-remote-clientを使用して
 * 評価可能な形式に変換します。remarkプラグインによる拡張機能も適用されます。
 *
 * @param id プロンプトID
 * @returns コンパイル済みMDXの結果
 */
export async function compileMdx(
  id: string
): Promise<EvaluateResult<Frontmatter>> {
  // idに一致する、保存されたプロンプトデータを取得
  const sourceToCompile = await getSavedPromptRawContent(id);

  if (!sourceToCompile) {
    notFound();
  }

  try {
    // MDXソースを評価してReactコンポーネントに変換
    const result = await evaluate<Frontmatter>({
      source: sourceToCompile,
      options: {
        parseFrontmatter: true, // フロントマターの自動解析を有効化
        mdxOptions: {
          remarkPlugins: [remarkGfm], // GitHub Flavored Markdownサポート
        },
      },
    });

    // MDX評価は成功したが内部エラーが発生した場合の警告
    if (result.error) {
      console.warn("MDX evaluation resulted in an error:", result.error);
    }
    return result;
  } catch (error) {
    // 評価プロセス自体で発生した重大なエラーをハンドリング
    console.error("Critical error during MDX evaluation process:", error);
    const evalError =
      error instanceof Error
        ? error
        : new Error("An unknown error occurred during MDX evaluation.");

    throw evalError;
  }
}
