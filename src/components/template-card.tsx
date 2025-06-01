import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type TemplateFrontmatter } from "@/lib/markdown/types";

export default function TemplateCard({
  template,
}: {
  template: TemplateFrontmatter;
}) {
  return (
    <Link href={`/templates/${template.id}`}>
      <Card className="h-full overflow-hidden rounded-xl py-0 border-0 shadow-sm transition-all hover:shadow-xl">
        {/* グラデーション背景のヘッダー部分に絵文字を大きく表示 */}
        <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 p-20 flex items-center justify-center">
          <span className="text-6xl">{template.emoji}</span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 pt-0 space-y-4">
            <Badge
              variant="outline"
              className="rounded-full bg-violet-50 text-violet-600 border-violet-200"
            >
              {getCategoryNameJapanese(template.category)}
            </Badge>
            <h3 className="text-xl font-semibold line-clamp-1">
              {template.title}
            </h3>
          </div>
          <div className="border-t border-zinc-100 p-4 flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs rounded-full"
                >
                  {getTagNameJapanese(tag)}
                </Badge>
              ))}
              {template.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs rounded-full">
                  +{template.tags.length - 2}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-violet-50 hover:text-violet-600"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function getCategoryNameJapanese(category: string): string {
  const categoryMap: Record<string, string> = {
    Writing: "ライティング",
    Coding: "コーディング",
    Marketing: "マーケティング",
    Education: "教育",
    Creative: "クリエイティブ",
  };
  return categoryMap[category] || category;
}

function getTagNameJapanese(tag: string): string {
  const tagMap: Record<string, string> = {
    blog: "ブログ",
    content: "コンテンツ",
    writing: "ライティング",
    code: "コード",
    explanation: "説明",
  };
  return tagMap[tag] || tag;
}
