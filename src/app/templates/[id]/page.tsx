import { getTemplateIds, getTemplateData } from "@/lib/markdown/templates";
import TemplateClientView from "./_components/template-client-view";
import { notFound } from "next/navigation";

/**
 * 静的パラメータ生成関数
 *
 * ビルド時に全てのテンプレートIDを取得し、静的ページを生成するための
 * パラメータリストを返します。これによりSSGが有効になります。
 */
export async function generateStaticParams() {
  const ids = getTemplateIds();
  return ids.map((id) => ({ id }));
}

/**
 * テンプレート詳細ページコンポーネント
 *
 * 指定されたIDのテンプレートデータを取得し、クライアントコンポーネントに渡します。
 * テンプレートが見つからない場合は、404エラーを表示します。
 */
export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const templateData = getTemplateData(id);

  if (!templateData) {
    notFound();
  }

  return <TemplateClientView templateData={templateData} />;
}
