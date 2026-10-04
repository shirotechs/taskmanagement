DELETE FROM tasks;
ALTER TABLE tasks AUTO_INCREMENT = 1;

INSERT INTO tasks (title, description, priority, due_date, status, created_at, updated_at) VALUES
('要件定義書を作成する', '画面・API仕様をまとめる', 'HIGH', '2026-10-10', 'DONE', NOW(), NOW()),
('APIの基本設計を行う', 'タスク読み取りAPIのエンドポイント設計', 'HIGH', '2026-10-15', 'IN_PROGRESS', NOW(), NOW()),
('MySQLへの接続確認', 'docker-composeでMySQLを起動し接続確認', 'MEDIUM', '2026-10-05', 'DONE', NOW(), NOW()),
('フロントエンドのワイヤーフレーム作成', '主要画面のレイアウトを検討', 'MEDIUM', '2026-10-20', 'TODO', NOW(), NOW()),
('CI/CDパイプラインの検討', 'GitHub Actionsでのビルド・テスト自動化', 'LOW', '2026-11-01', 'TODO', NOW(), NOW()),
('APIのテストコード作成', 'TaskControllerの単体テストを書く', 'HIGH', '2026-10-12', 'TODO', NOW(), NOW()),
('雑多な調整タスク', '優先度・期限未設定のタスク', NULL, NULL, 'TODO', NOW(), NOW());
