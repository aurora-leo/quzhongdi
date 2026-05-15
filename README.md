# 欢迎使用趣种地
秒哒应用链接
    URL:https://www.miaoda.cn/projects/app-bnaznsblkw01

# Project Overview

本仓库是基于 Taro + React + TypeScript 搭建的微信小程序与移动端H5通用起步项目，采用 Tailwind CSS 进行样式开发，依赖包通过 pnpm 管理。
本文档介绍如何完成项目的本地环境搭建、开发调试、测试、代码校验以及项目打包构建。
---

## Repository Structure

The project structure is as follows:

```

├── babel.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── project.config.json
├── README.md
├── tailwind.config.js
├── tsconfig.check.json
├── tsconfig.json
├── config/
│   ├── dev.ts
│   ├── index.ts
│   └── prod.ts
├── scripts/
├── src/
│   ├── app.config.ts               # Taro app configuration, defining routes and tabBar, Please note that the "pages" must correctly correspond to the routes defined in src/pages.
│   ├── app.scss
│   ├── app.ts
│   ├── index.html
│   ├── client/
│   │   └── supabase.ts             # Supabase client configuration, When you need to use Supabase, import and use it from this file.
│   ├── db/                         # Database operations and Supabase integration, all database calls should be implemented here
│   │   └── README.md
│   ├── pages/                      # each folder corresponds to a route defined in app.config.ts
│   ├── store/                      # Global state management using Zustand for cross-page state sharing
│   │   └── README.md
│   └── types/                      # TypeScript type definitions
│       └── global.d.ts
└── supabase/
```

After you generate any files or update the structure of this project, please update the README.md file to reflect the changes.

## Installation and Setup

```bash
pnpm install # Install dependencies
```

```bash
pnpm run lint  # Lint source (Important: After modifying the code, please execute this command to perform necessary checks.)
```
