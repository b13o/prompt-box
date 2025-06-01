"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PromptVariableForm from "@/app/templates/[id]/_components/prompt-variable-form";
import PromptPreview from "@/app/templates/[id]/_components/prompt-preview";
import Link from "next/link";
import type { TemplateFrontmatter } from "@/lib/markdown/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateClientViewProps {
  templateData: {
    metadata: TemplateFrontmatter;
    content: string;
  };
}

/**
 * テンプレート詳細表示クライアントコンポーネント
 *
 * このコンポーネントはテンプレートの詳細表示とプロンプト生成機能を提供します。
 * ユーザーが変数を入力してプロンプトをカスタマイズし、生成されたプロンプトを
 * クリップボードにコピーまたはファイルとして保存できます。
 */
export default function TemplateClientView({
  templateData,
}: TemplateClientViewProps) {
  // テンプレートの変数に対応するユーザー入力値を管理
  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const initialVars: Record<string, string> = {};
    // テンプレートの変数を抽出して、初期値を設定
    if (templateData?.metadata?.variables) {
      templateData.metadata.variables.forEach(
        (v: TemplateFrontmatter["variables"][number]) => {
          initialVars[v.key] = "";
        }
      );
    }
    return initialVars;
  });

  // 保存ダイアログの表示状態を管理
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [currentFilename, setCurrentFilename] = useState("");

  /**
   * プロンプト生成処理
   *
   * テンプレートコンテンツ内の変数プレースホルダー（{変数名}）を
   * ユーザーが入力した値で置換してプロンプトを生成します。
   */
  const generatedPrompt = useMemo(() => {
    if (!templateData?.content) return "";
    let promptContent = templateData.content;
    // 1つずつ、変数をユーザーが入力した値で置き換える
    Object.entries(variables).forEach(([key, value]) => {
      promptContent = promptContent.replace(
        new RegExp(`{${key}}`, "g"),
        value || `{${key}}`
      );
    });
    return promptContent;
  }, [variables, templateData?.content]);

  const template = templateData.metadata;

  /**
   * プロンプトをクリップボードにコピーする処理
   */
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("クリップボードにコピーしました", {
      description: "プロンプトがクリップボードにコピーされました。",
    });
  };

  /**
   * プロンプト保存ダイアログを開く処理
   *
   * タイムスタンプを含むファイル名を自動生成し、保存ダイアログを表示します。
   */
  const handleSavePrompt = () => {
    if (!templateData?.metadata?.id || !generatedPrompt) {
      toast.error("エラー", {
        description: "プロンプトの保存に必要な情報がありません。",
      });
      return;
    }
    // タイムスタンプベースのファイル名を生成
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "-")
      .replace("Z", "")
      .replace(".", "");
    const filename = `${templateData.metadata.id}-${timestamp}`;
    setCurrentFilename(filename);
    setSaveTitle(filename);
    setIsSaveDialogOpen(true);
  };

  /**
   * プロンプトをファイルとして保存する処理
   *
   * フロントマターを含むMarkdownファイルとして保存します。
   * APIエンドポイントを通じてサーバー側でファイル書き込みを実行します。
   */
  const handleConfirmSave = async () => {
    if (!templateData?.metadata?.id || !generatedPrompt || !saveTitle) {
      toast.error("エラー", {
        description: "タイトルとプロンプト内容は必須です。",
      });
      return;
    }

    const createdAt = new Date().toISOString();
    const templateId = templateData.metadata.id;
    const rating = null; // Default rating

    // YAMLフロントマターを含むMarkdownコンテンツを構築
    const frontmatter = `---
title: "${saveTitle}"
createdAt: "${createdAt}"
rating: ${rating === null ? "null" : rating} 
templateId: "${templateId}"
---

`;

    const contentToSave = frontmatter + generatedPrompt;

    try {
      // APIエンドポイントにプロンプトデータを送信
      const response = await fetch("/api/save-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: currentFilename,
          content: contentToSave,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.isPreview) {
          toast.success("プレビュー保存完了", {
            description:
              "このデモでは実際のファイル保存は行われません。ローカル環境では完全に動作します。",
          });
        } else {
          toast.success("プロンプトを保存しました", {
            description: `${currentFilename}.md として保存されました。`,
          });
        }
        setIsSaveDialogOpen(false);
      } else {
        // サーバーエラーレスポンスの処理
        const errorData = await response.json();
        toast.error("保存エラー", {
          description: errorData.message || "プロンプトの保存に失敗しました。",
        });
      }
    } catch (error) {
      // ネットワークエラーやその他の例外の処理
      console.error("Failed to save prompt:", error);
      toast.error("保存エラー", {
        description: "プロンプトの保存中にエラーが発生しました。",
      });
    }
  };

  return (
    <>
      <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen py-12">
        <div className="container mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-zinc-500 hover:text-violet-600 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              テンプレート一覧に戻る
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{template.title}</h1>
              <Badge
                variant="outline"
                className="rounded-full bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800"
              >
                {template.category}
              </Badge>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-3xl">
              {template.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-xl border-0 shadow-sm overflow-hidden">
                <div className="bg-white dark:bg-zinc-950 p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    プロンプトをカスタマイズ
                  </h2>
                  <PromptVariableForm
                    variables={template.variables || []}
                    values={variables}
                    onChange={setVariables}
                  />
                </div>
              </Card>
              <Card className="rounded-xl border-0 shadow-sm overflow-hidden">
                <div className="bg-white dark:bg-zinc-950 p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    テンプレート情報
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                        カテゴリ
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800"
                        >
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                        タグ
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {template.tags &&
                          template.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-full"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-xl border-0 shadow-sm overflow-hidden">
                <div className="bg-white dark:bg-zinc-950 px-6 py-6 space-y-6">
                  <h2 className="text-xl font-semibold">
                    生成されたプロンプト
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPrompt}
                      className="rounded-full"
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      コピー
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSavePrompt}
                      className="rounded-full bg-violet-600 hover:bg-violet-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </Button>
                  </div>
                  <PromptPreview content={generatedPrompt} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>プロンプトを保存</DialogTitle>
            <DialogDescription>
              保存するプロンプトのタイトルを入力してください。ファイル名は自動生成されます。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prompt-title" className="text-right">
                タイトル
              </Label>
              <Input
                id="prompt-title"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DialogClose>
            <Button onClick={handleConfirmSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
