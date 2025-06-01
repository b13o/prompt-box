import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * プロンプトをMarkdownファイルとして保存する
 *
 * @param request - リクエストボディに filename と content を含む
 * @returns 保存結果のレスポンス
 */
export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json();

    // 必須パラメータの検証
    if (!filename || !content) {
      return NextResponse.json(
        { message: "Filename and content are required" },
        { status: 400 }
      );
    }

    // 本番環境ではプレビューモードとして動作
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          message: "プレビュー環境のため、実際の保存は行われませんでした",
          isPreview: true,
        },
        { status: 200 }
      );
    }

    // 保存ディレクトリの確保（存在しない場合は作成）
    const savedDirectory = path.join(process.cwd(), "_data/saved");
    if (!fs.existsSync(savedDirectory)) {
      fs.mkdirSync(savedDirectory, { recursive: true });
    }

    // ファイルの書き込み（.md拡張子を付与）
    const filePath = path.join(savedDirectory, `${filename}.md`);
    fs.writeFileSync(filePath, content);

    return NextResponse.json(
      { message: "Prompt saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving prompt:", error);
    return NextResponse.json(
      { message: "Error saving prompt" },
      { status: 500 }
    );
  }
}
