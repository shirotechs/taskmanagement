---
name: dev-server-ports
description: 開発サーバー(MySQL・Spring Boot BE・Vite FE)を起動する、動作確認のためにアプリを立ち上げる、ポート競合やポート番号について扱うときに必ず使う。BE=8080、FE=5173、MySQL=3306の固定ポートで起動し、別ポートへ逃がさないための手順を定める。「サーバー起動して」「動作確認したい」「localhost:5173を開きたい」「ポートが使われている」といった依頼でも使うこと。
---

# 開発サーバーのポート(固定)

FEのプロキシ(`/api` → 8080)やBEの設定はこのポート番号を前提にしている。別ポートで起動すると画面からAPIに繋がらなくなり、原因の切り分けも難しくなる。そのため、必ず下記のポートで起動する。

| サーバー | ポート | 起動コマンド |
|---|---|---|
| MySQL (Docker) | 3306 | `docker compose up -d` (リポジトリルート) |
| BE (Spring Boot) | 8080 | `cd backend && ./gradlew bootRun` |
| FE (Vite) | 5173 | `cd frontend && npm install && npm run dev` |

ポート番号は `.claude/settings.json` の `env`(`MYSQL_PORT` / `BACKEND_PORT` / `FRONTEND_PORT`)にも定義されている。

## 手順

1. 起動前に各ポートの使用状況を確認する: `lsof -ti:3306`, `lsof -ti:8080`, `lsof -ti:5173`
2. 空いていれば、上記コマンドで起動する(BE・FEは長時間動くのでバックグラウンドで起動し、ログをスクラッチパッド等に出す)。
3. 起動後、`curl localhost:8080/api/tasks` や `curl "localhost:5173/api/tasks"`(プロキシ経由)で疎通を確認する。

## ポートが使用中だった場合

- 別ポートで起動しない。`--port` の変更や `application.properties` のポート書き換えで回避しない。
- 使用中のプロセスが何かを確認する(`lsof -i:<ポート>`)。
- 今のセッションで自分が起動したサーバーが残っているだけなら、停止して起動し直してよい。
- ユーザー自身が起動した可能性のあるプロセスは、勝手に停止しない。ユーザーに確認する。MySQLの既存コンテナが healthy で動いている場合は、そのまま使う。

## 補足

- FEは `vite.config.js` の `strictPort: true` により、5173が使用中だと別ポートにずれず起動に失敗する。失敗したら上の「使用中だった場合」に従う。
- BEのポートは `backend/src/main/resources/application.properties` の `server.port=8080` で固定されている。
