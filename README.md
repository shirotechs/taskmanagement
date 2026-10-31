# Trello風タスク管理アプリ

## プロジェクト概要
個人用のタスク管理アプリ。Trelloのようなカンバンボード形式で、タスク情報を入力してボードに表示し、ドラッグ&ドロップで管理する。

## 目的
- 個人のタスク管理を効率的に行う
- GitHubに上げて学習用プロジェクトとして活用

## 対象ユーザー
- 個人ユーザー（自分1人で使用）
- 実行環境：ブラウザ（Web アプリ）

---

## 詳細ドキュメント

- [要件定義（目的・入力項目・ボード構成・ユースケース）](docs/requirements.md)
- [画面一覧](docs/screens.md)
- [技術スタック・非機能要件](docs/tech-stack.md)
- [データ設計（ER図・テーブル定義）](docs/data-model.md)
- [機能要件・実装ロードマップ](docs/roadmap.md)
- [プロジェクト構成（予定）](docs/project-structure.md)

---

## 技術スタックとバージョン

| 層 | 技術 | バージョン |
|----|------|-----------|
| フロントエンド | React / React DOM | 19.3.0 |
| | TypeScript | 7.0.2 |
| | Vite(+ @vitejs/plugin-react) | 7.3.7(5.2.0) |
| | Node.js / npm(開発環境) | 24.16.0 / 11.13.0 |
| バックエンド | Java | 21(Gradle toolchain) |
| | Spring Boot | 3.3.4 |
| | Gradle(Wrapper) | 8.10 |
| データベース | MySQL(Docker `mysql:8`) | 8.x |
| バージョン管理 | Git(開発環境) | 2.39.5 |

※ FEのバージョンは `frontend/package-lock.json` で解決された実際の値。BEは `backend/build.gradle` と Gradle Wrapper の指定値。

---

## 注釈
- 実装を進める中で、機能が追加・変更される可能性がある
- GitHubで学習用プロジェクトとして公開予定

---

## 開発環境の起動

```bash
# 1. MySQL
docker compose up -d

# 2. バックエンド (http://localhost:8080)
cd backend && ./gradlew bootRun

# 3. フロントエンド (http://localhost:5173)
cd frontend && npm install && npm run dev
```

フロントの `/api` へのリクエストは Vite のプロキシ経由でバックエンドに転送される。
