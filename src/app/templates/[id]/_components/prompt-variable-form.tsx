"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TemplateVariable } from "@/lib/markdown/types";

interface PromptVariableFormProps {
  variables: TemplateVariable[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

/**
 * プロンプトテンプレートの変数入力フォームコンポーネント
 *
 * テンプレートで定義された変数に対応する入力フィールドを動的に生成し、
 * ユーザーが変数値を入力できるフォームを提供します。
 */
export default function PromptVariableForm({
  variables,
  values,
  onChange,
}: PromptVariableFormProps) {
  const handleChange = (key: string, value: string) => {
    // 既存の値を保持しつつ、指定されたキーの値のみを更新
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {variables.map((variable) => (
          <div key={variable.key} className="space-y-2">
            <Label htmlFor={variable.key} className="text-sm font-medium">
              {variable.label}
            </Label>
            {variable.description && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {variable.description}
              </p>
            )}
            {/* 変数のタイプに応じて適切な入力コンポーネントを選択 */}
            {variable.type === "textarea" ? (
              <Textarea
                id={variable.key}
                placeholder={variable.placeholder}
                value={values[variable.key] || ""}
                onChange={(e) => handleChange(variable.key, e.target.value)}
                className="resize-none rounded-lg border-zinc-200 dark:border-zinc-800 focus:border-violet-500 focus:ring-violet-500"
                rows={4}
              />
            ) : (
              <Input
                id={variable.key}
                placeholder={variable.placeholder}
                value={values[variable.key] || ""}
                onChange={(e) => handleChange(variable.key, e.target.value)}
                className="rounded-lg border-zinc-200 dark:border-zinc-800 focus:border-violet-500 focus:ring-violet-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
