# プロジェクト構成（予定）

```
taskmanagement/
├── README.md（このファイル）
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json（tsconfig.app.json / tsconfig.node.json を参照）
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── types.ts
│       ├── components/
│       │   ├── Board.tsx
│       │   ├── Column.tsx
│       │   └── Card.tsx
│       ├── hooks/
│       │   └── useTaskApi.ts
│       └── styles/
│           └── style.css
└── backend/
    ├── pom.xml
    └── src/
        └── main/
            ├── java/
            │   └── com/example/taskmanagement/
            │       ├── TaskManagementApplication.java
            │       ├── controller/
            │       │   └── TaskController.java
            │       ├── service/
            │       │   └── TaskService.java
            │       ├── repository/
            │       │   └── TaskRepository.java
            │       └── entity/
            │           └── Task.java
            └── resources/
                └── application.properties
```
