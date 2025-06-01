/**
 * 保存されたプロンプトのファイルシステム（fs）操作モジュール
 *
 * ユーザーが保存したプロンプトの管理機能を提供します。
 * ファイルシステムを使用してMDX形式でプロンプトを永続化し、
 * 読み取り、更新、メタデータ取得などの操作を行います。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  SavedPromptFrontmatter,
  SavedPromptData,
} from "@/lib/markdown/types";

const savedDirectory = path.join(process.cwd(), "_data/saved");

// 開発環境で、保存ディレクトリが存在しない場合は自動作成
if (process.env.NODE_ENV === "development" && !fs.existsSync(savedDirectory)) {
  fs.mkdirSync(savedDirectory, { recursive: true });
}

/**
 * 保存されたプロンプトのIDリストを取得
 *
 * @returns プロンプトIDの配列（ファイル名から拡張子を除いたもの）
 */
export function getSavedPromptIds(): string[] {
  try {
    const filenames = fs.readdirSync(savedDirectory);
    return filenames
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => filename.replace(/\.md$/, ""));
  } catch (error) {
    console.error("Error reading saved prompt IDs:", error);
    return [];
  }
}

/**
 * 指定されたIDの保存プロンプトの生ファイル内容を取得
 */
export async function getSavedPromptRawContent(
  id: string
): Promise<string | null> {
  const filePath = path.join(savedDirectory, `${id}.md`);
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading saved prompt ${id}:`, error);
    return null;
  }
}

/**
 * 全ての保存されたプロンプトのメタデータを取得
 *
 * 一覧表示用に、各プロンプトの基本情報（ID、タイトル、作成日）のみを取得し、
 * 作成日の降順でソートして返します。
 *
 * @returns メタデータの配列
 */
export async function getAllSavedPromptsMetadata(): Promise<
  Array<{ id: string; title: string; createdAt: string }>
> {
  const ids = getSavedPromptIds();
  const metadataPromises = ids.map(async (id) => {
    const data = await getSavedPromptData(id);
    return data
      ? {
          id,
          title: data.frontmatter.title,
          createdAt: data.frontmatter.createdAt,
        }
      : null;
  });
  const allMetadata = await Promise.all(metadataPromises);
  return (
    allMetadata
      .filter((meta) => meta !== null)
      // 作成日の新しい順にソート
      .sort(
        (a, b) =>
          new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime()
      ) as Array<{ id: string; title: string; createdAt: string }>
  );
}

/**
 * 保存プロンプトの評価（rating）を更新
 *
 * 既存のファイルのフロントマターを更新し、評価値のみを変更します。
 * コンテンツ部分は変更されません。
 *
 * @param id プロンプトID
 * @param rating 新しい評価値
 * @returns 更新が成功したかどうか
 */
export async function updatePromptRatingInFile(
  id: string,
  rating: number
): Promise<boolean> {
  const filePath = path.join(savedDirectory, `${id}.md`);
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(
        `Cannot update rating. Saved prompt file not found: ${filePath}`
      );
      return false;
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data: frontmatter, content } = matter(fileContents);

    // 既存のフロントマターに評価値を追加・更新
    const updatedFrontmatter = {
      ...frontmatter,
      rating,
    };

    // フロントマターとコンテンツを再結合してファイルに書き戻し
    const newFileContents = matter.stringify(content, updatedFrontmatter);
    fs.writeFileSync(filePath, newFileContents, "utf8");
    return true;
  } catch (error) {
    console.error(`Error updating rating for prompt ${id}:`, error);
    return false;
  }
}

/**
 * 指定されたIDの保存プロンプトデータ（フロントマターとコンテンツ）を取得
 *
 * @param id プロンプトID
 * @returns プロンプトデータ、または見つからない場合はnull
 */
export async function getSavedPromptData(
  id: string
): Promise<SavedPromptData | null> {
  const fileContents = await getSavedPromptRawContent(id);
  if (!fileContents) {
    return null;
  }
  try {
    // gray-matterを使用してフロントマターとコンテンツを分離
    const { data, content } = matter(fileContents);
    return {
      id,
      frontmatter: data as SavedPromptFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error parsing saved prompt ${id}:`, error);
    return null;
  }
}
