/**
 * アプリケーション全体で使用される型定義
 */

// 基本的な変数定義
export interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  type: "text" | "textarea";
  placeholder?: string;
}

// テンプレートカテゴリー
export type TemplateCategory =
  | "writing"
  | "coding"
  | "marketing"
  | "education"
  | "creative";

// テンプレートのフロントマター
export interface TemplateFrontmatter {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  emoji: string;
  tags: string[];
  variables: TemplateVariable[];
}

// 完全なテンプレート型
export interface Template extends TemplateFrontmatter {
  content: string;
}

// 保存されたプロンプトのフロントマター
export interface SavedPromptFrontmatter {
  title: string;
  createdAt: string;
  rating: number | null;
  templateId: string;
}

// MDX関連の型（Frontmatterインターフェース）
export interface Frontmatter extends SavedPromptFrontmatter {
  [key: string]: unknown;
}

// 保存されたプロンプトデータ
export interface SavedPromptData {
  id: string;
  frontmatter: SavedPromptFrontmatter;
  content: string;
}

// テンプレートカテゴリーの定義（日本語表示名付き）
export const templateCategories = [
  { id: "writing" as const, name: "ライティング" },
  { id: "coding" as const, name: "コーディング" },
  { id: "marketing" as const, name: "マーケティング" },
  { id: "education" as const, name: "教育" },
  { id: "creative" as const, name: "クリエイティブ" },
] as const;
