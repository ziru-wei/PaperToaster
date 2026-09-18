# Paper Toaster Dashboard UI Kit

从 Paper Toaster Dashboard 提取出的独立、零依赖 Web UI 组件库。它只包含展示与轻量交互，不依赖 Chrome Extension API、IndexedDB、PDF 解析或 AI 逻辑。

## 目录

```text
dashboard-ui-kit/
├── README.md
├── tokens.css              设计令牌与主题覆盖点
├── dashboard-ui-kit.css    组件与响应式样式
├── dashboard-ui-kit.js     DOM 组件工厂
├── demo.html               完整组件目录页
└── demo.js                 示例数据与交互
```

## 快速使用

```html
<link rel="stylesheet" href="./tokens.css">
<link rel="stylesheet" href="./dashboard-ui-kit.css">
<script type="module">
  import { createPaperCard } from "./dashboard-ui-kit.js";

  const card = createPaperCard({
    id: "paper-1",
    title: "Attention Is All You Need",
    label: "Transformers",
    labelTone: 0,
    messageCount: 12,
    starred: true,
    onActivate: ({ id }) => console.log("open", id),
    onToggleStar: ({ id, starred }) => console.log(id, starred)
  });

  document.querySelector("#papers").append(card);
</script>
```

本地查看完整目录页：

```sh
cd dashboard-ui-kit
python3 -m http.server 4173
```

然后打开 `http://127.0.0.1:4173/demo.html`。

## 组件 API

所有组件都是返回原生 `HTMLElement` 的工厂函数，因此可直接用于 Vanilla JS，也可在 React/Vue/Svelte 中通过容器 ref 挂载。

| 工厂 | 用途 | 主要状态 |
| --- | --- | --- |
| `createDashboardToolbar` | 搜索与圆形工具按钮 | `searchValue`、`actions` |
| `createIconButton` | 玻璃质感图标按钮 | `icon`、`active`、`disabled` |
| `createSortMenu` | 浮层菜单 | `activeId`、`grouping` |
| `createBulkActions` | 批量管理工具条 | `selectedCount`、`actions` |
| `createPaperCard` | 论文卡片 | `active`、`selected`、`related`、`starred` |
| `createPaperGroup` | 带标题与色调的卡片组 | `label`、`tone`、`selectState` |
| `enableDashboardDragAndDrop` | 卡片与分组拖拽控制器 | 长按卡片、分组手柄、Escape 取消 |
| `createLabelChip` | 论文标签胶囊 | `tone`、`empty` |
| `createLabelControl` | 完整 Label Management 菜单 | 选择、创建、重命名、删除、键盘操作、`open` |
| `createComparisonCard` | 多论文比较记录 | `active`、`selected`、`related` |
| `createFloatingAction` | 右侧浮动主操作 | `icon`、`label` |
| `createKeyboardHint` | 快捷键提示 | `keys`、`text` |
| `createEmptyState` | 空状态 | `message` |

各组件只通过传入的回调向外报告操作，不修改业务数据。状态变更后，可重新创建组件，或者使用导出的 `setVisualState(element, state)` 更新常见状态类。

## 事件约定

除回调外，交互组件也会派发冒泡的 `CustomEvent`，便于统一事件委托：

- `ptk:activate`
- `ptk:star-change`
- `ptk:selection-change`
- `ptk:search`
- `ptk:action`
- `ptk:sort-change`
- `ptk:label-click`
- `ptk:label-change`
- `ptk:label-create`
- `ptk:label-rename`
- `ptk:label-delete`
- `ptk:card-moved`
- `ptk:groups-reordered`

事件数据位于 `event.detail`。

## 主题定制

覆盖 `tokens.css` 中的 CSS 变量即可换肤：

```css
.my-dashboard {
  --ptk-color-page: #f4f1ea;
  --ptk-color-text: #24211d;
  --ptk-card-radius: 10px;
  --ptk-layout-max: 1440px;
}
```

标签提供 5 个稳定色调（`0`–`4`）和 `neutral`。组件库默认尊重 `prefers-reduced-motion`。

## 提取边界

这里刻意不包含：

- Dashboard 的存储、筛选、排序和归档实现；
- Chrome runtime 消息与 Side Panel 联动；
- 论文卡片拖拽排序的业务逻辑；
- Side Panel 的任何视觉或组件；
- Paper Toaster 原始源码的导入。

组件库是独立副本，后续修改不会影响插件，插件中的改动也不会自动同步到这里。
