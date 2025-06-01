import { NextResponse } from "next/server";
import { updatePromptRatingInFile } from "@/lib/markdown/saved-prompts";

/**
 * 保存済みプロンプトの評価を更新する
 *
 * @param request - リクエストボディに id と rating を含む
 * @returns 更新結果のレスポンス
 */
export async function POST(request: Request) {
  try {
    const { id, rating } = await request.json();

    // 入力値の検証（IDの存在確認と評価値の範囲チェック）
    if (!id || typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json(
        { message: "Invalid ID or rating provided" },
        { status: 400 }
      );
    }

    // 本番環境ではプレビューモードとして動作
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          message: "プレビュー環境のため、実際の更新は行われませんでした",
          isPreview: true,
        },
        { status: 200 }
      );
    }

    const success = await updatePromptRatingInFile(id, rating);

    if (success) {
      return NextResponse.json(
        { message: "Rating updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to update rating" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { message: "Error updating rating" },
      { status: 500 }
    );
  }
}
