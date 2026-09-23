# Git / GitHub 運用ルール

このリポジトリで作業する際は、以下のルールを必ず守ること。

## 1. mainブランチへの直接pushは禁止
- `main` ブランチに対する直接コミット・直接pushは行わない。
- 全ての変更は作業用ブランチを作成し、Pull Request経由でmainにマージする。
- `main` にはGitHub側でブランチ保護(直接push禁止・force-push禁止・削除禁止)が設定されているため、誤って直接pushしても拒否される。それを前提にせず、そもそも直接pushしようとしないこと。

## 2. 作業着手前に必ずIssueを作成する
- コードやドキュメントの変更に着手する前に、`gh issue create` でGitHub Issueを作成し、Issue番号を取得する。
- どんなに小さな変更でも例外を作らない。
- Issue作成時は `.github/ISSUE_TEMPLATE/` のテンプレート(feature / bug)を使う。

## 3. ブランチ命名規則
Issue番号を含めた以下の形式でブランチを作成する。

- 新機能: `feature/<issue番号>-<簡潔な説明>` (例: `feature/12-add-login`)
- 不具合修正: `fix/<issue番号>-<簡潔な説明>` (例: `fix/15-fix-date-bug`)
- ドキュメント: `docs/<issue番号>-<簡潔な説明>` (例: `docs/20-update-readme`)

## 4. Pull Requestのルール
- ブランチでの作業が完了したら `gh pr create` でPRを作成する。
- PR本文には対応するIssueを `Closes #<issue番号>` の形式で必ず記載する。
- `.github/PULL_REQUEST_TEMPLATE.md` の内容に従って記載する。
- PRのマージも、可能な限りユーザーの確認を得てから行う(マージは影響が大きい操作のため、勝手に実行しない)。
