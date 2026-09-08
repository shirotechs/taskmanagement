# プロジェクト構成（予定）

```
taskmanagement/
├── README.md（このファイル）
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   ├── Board.jsx
│       │   ├── Column.jsx
│       │   └── Card.jsx
│       ├── hooks/
│       │   └── useTaskApi.js
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
