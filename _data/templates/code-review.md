---
id: "code-review"
title: "コードレビュー"
description: "提供されたコードを分析し、改善点や最適化案を提案します。"
category: "coding"
emoji: "🔍"
tags: ["code", "explanation"]
variables:
  - key: "code"
    label: "レビュー対象のコード"
    type: "textarea"
    placeholder: "ここにコードを貼り付けてください"
  - key: "language"
    label: "プログラミング言語"
    type: "text"
    placeholder: "例：JavaScript, Python, Go"
---

# 依頼

以下の{language}コードをレビューしてください。

**コード**

```

{code}

```

**レビューのポイント**

1. コードの品質と可読性
2. パフォーマンスの改善点
3. セキュリティの観点
4. ベストプラクティスの適用
5. 具体的な改善案

**要件**

- 具体的で実行可能な改善提案をする
- 理由を明確に説明する
