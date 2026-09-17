# 基金池“五篇大文章”标记体系

中银理财-基海淘金队课题前端。首版为纯前端静态单页应用，使用 React、TypeScript、Vite、Tailwind CSS、React Router HashRouter、Apache ECharts 和 Zod。

## 目录结构

```text
data/data-config.ts          数据统计日期、工作表名、源文件名与规则版本
scripts/update-data.ts        Excel → funds.normalized.json 数据转换脚本
public/data/                  构建时生成的标准 JSON
src/config/                   五类标签、项目身份等单一配置
src/domain/                   类型、标签规则、筛选与概览纯函数
src/data/                     数据加载、Zod 校验与字段规范化
src/components/               页面组件
src/pages/                    基金池页与基金详情页
tests/unit/                   Vitest 单元测试
```

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

## 正式构建

`npm run build` 会自动完成以下流程：

1. 读取项目根目录下的 `fund_labels_web_cleaned.xlsx`
2. 字段映射、缺失占比转 0、标签重算与完整性校验
3. 生成 `public/data/funds.normalized.json`
4. 执行 TypeScript 类型检查与 Vite 构建
5. 输出可部署的 `dist/` 目录

```bash
npm run build
```

## 单元测试

```bash
npm run test
```

## 季度数据更新方法

1. 用新一期、同名字段格式的 Excel 覆盖项目根目录下的 `fund_labels_web_cleaned.xlsx`。
2. 编辑 `data/data-config.ts` 中的 `asOfDate` 为新的统计截止日期。
3. 在项目根目录执行一次：

   ```bash
   npm run build
   ```

4. 构建成功后，用新生成的 `dist/` 目录替换上一版静态网站。

正式 Excel 当前工作表名为 `基金标签`。数据适配层按字段名读取数据，不依赖 Excel 列顺序；新增不参与页面逻辑的冗余列不会导致导入失败。检查失败时脚本不会覆盖上一期 `funds.normalized.json`，并会终止构建。

## 部署

`dist/` 目录可直接部署到任意静态托管环境或单位内部静态服务器。应用使用 HashRouter，无需配置 SPA 路由回退。
