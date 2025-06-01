import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Template, TemplateFrontmatter } from "./types";

/**
 * 全テンプレートのIDリストを取得
 *
 * テンプレートディレクトリ内の.mdファイルをスキャンし、
 * ファイル名（拡張子除く）をIDとして返します。
 *
 * @returns テンプレートIDの配列
 */
export const getTemplateIds = (): string[] => {
  const templatesDirectory = path.join(process.cwd(), "_data/templates");
  // ディレクトリが存在しない場合の安全な処理
  if (!fs.existsSync(templatesDirectory)) {
    console.warn(`Templates directory not found: ${templatesDirectory}`);
    return [];
  }
  const filenames = fs.readdirSync(templatesDirectory);
  return filenames
    .filter((filename) => filename.endsWith(".md")) // .mdファイルのみを対象
    .map((filename) => filename.replace(/\.md$/, ""));
};

/**
 * 指定されたIDのテンプレートデータを取得
 *
 * mdファイルを読み込み、フロントマターとコンテンツを分離して返します。
 * 必須フィールドの検証も行います。
 *
 * @param id テンプレートID
 * @returns テンプレートのメタデータとコンテンツ、または見つからない場合はnull
 */
export const getTemplateData = (
  id: string
): { metadata: TemplateFrontmatter; content: string } | null => {
  const templatesDirectory = path.join(process.cwd(), "_data/templates");
  const filePath = path.join(templatesDirectory, `${id}.md`);
  try {
    // ファイルが存在しない場合はnullを返す
    if (!fs.existsSync(filePath)) {
      console.warn(`Template file not found: ${filePath}`);
      return null;
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    // 必須フロントマターフィールドの基本検証
    if (!data.id || !data.title || !data.variables) {
      console.warn(`Template ${id} is missing essential frontmatter.`);
      return null;
    }
    return { metadata: data as TemplateFrontmatter, content };
  } catch (error) {
    console.error(`Error reading template ${id}:`, error);
    return null;
  }
};

/**
 * 全テンプレートのデータ（メタデータとコンテンツ）を取得
 */
export const getAllTemplates = (): Template[] => {
  const ids = getTemplateIds();
  const templates: Template[] = [];

  for (const id of ids) {
    const templateData = getTemplateData(id);
    if (templateData) {
      templates.push({
        ...templateData.metadata,
        content: templateData.content,
      });
    }
  }

  return templates;
};

/**
 * 全テンプレートのメタデータのみを取得
 *
 * 一覧表示用に、コンテンツを除いたメタデータのみを効率的に取得します。
 * カード表示やフィルタリング機能で使用されます。
 *
 * @returns テンプレートメタデータの配列
 */
export const getTemplatesMetadata = (): TemplateFrontmatter[] => {
  const ids = getTemplateIds();
  const templates: TemplateFrontmatter[] = [];

  for (const id of ids) {
    const templateData = getTemplateData(id);
    if (templateData) {
      templates.push(templateData.metadata);
    }
  }

  return templates;
};
