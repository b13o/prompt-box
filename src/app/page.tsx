import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Copy, Save } from "lucide-react";
import { getTemplatesMetadata } from "@/lib/markdown/templates";
import TemplateCard from "@/components/template-card";

export default function HomePage() {
  const templates = getTemplatesMetadata();

  return (
    <div className="flex flex-col">
      {/* Hero セクション */}
      <section className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                Prompt Manager
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                AIプロンプト <br />
                テンプレートで <br />
                <span className="inline-flex gap-2 items-center">
                  時間を節約 ⏱️ 💰 🤖
                </span>
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                テンプレートの管理。履歴の保存。レビューの記録。 AI
                プロンプトを簡単に管理できます！
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white text-violet-600 hover:bg-white/90"
                >
                  <Link href="#templates">テンプレートを見る</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent border-white text-white hover:bg-white/10"
                >
                  <Link href="/about">詳しく見る</Link>
                </Button>
              </div>
            </div>

            {/* プレビューカード */}
            <div className="hidden lg:flex justify-end">
              <Card className="w-[560px] rounded-xl pb-0 overflow-hidden border-0 shadow-xl bg-white">
                <div className="p-6 pb-0 flex flex-col gap-4">
                  <div className="text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full w-fit">
                    ブログ記事の作成依頼
                  </div>
                  <h3 className="text-xl font-semibold">
                    <span className="text-violet-600">{"{topic}"}</span>
                    についてのブログ記事を書いてください。
                    <br />
                    その際、以下のブログ記事作成ガイドに従って…
                  </h3>
                  <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
                    <div className="text-xs text-zinc-500 mb-2">変数を入力</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">topic:</div>
                        <div className="flex-1 bg-white rounded border border-zinc-200 px-2 py-1 text-sm">
                          React
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">url:</div>
                        <div className="flex-1 bg-white rounded border border-zinc-200 px-2 py-1 text-sm">
                          https://react-road.b13o.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className="bg-violet-50 border-violet-100 pb-6 border-t">
                  <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full flex gap-1 items-center"
                      >
                        <Copy className="h-4 w-4" />
                        コピー
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full flex gap-1 items-center"
                      >
                        <Save className="h-4 w-4" />
                        履歴に保存
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* テンプレート一覧セクション */}
      <section id="templates" className="py-16 bg-zinc-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12">
            日々改善されていく、おすすめテンプレート集。
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.slice(0, 6).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
