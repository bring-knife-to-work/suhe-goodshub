# 优选商城 (uni-mall)

基于 uni-app + Vue 3 构建的电商小程序项目，支持 HBuilderX 直接运行。

## 项目简介

优选商城是一个功能完备的电商小程序示例项目，涵盖了首页 Banner、商品分类、购物车管理、订单流程、个人中心等核心模块。后端数据基于 Mock 模拟，无需真实服务器即可运行体验。

## 技术栈

| 技术 | 说明 |
|------|------|
| uni-app 5.14 | 跨平台开发框架，支持 Vue 3 |
| Vue 3 | 组合式 API + 响应式 UI |
| Vuex 4 | 状态管理，支持 localStorage 持久化 |
| Vite | 现代前端构建工具 |
| ES6+ | 模块化开发 |

## 项目结构

```
uni-mall/
├── pages.json              # 页面路由 + TabBar 配置
├── manifest.json           # 应用配置
├── main.js                 # 应用入口，Vue 3 初始化
├── App.vue                 # 根组件
├── index.html              # Web 端入口
├── uni.scss                # 全局样式变量
├── pages/
│   ├── tabbar/             # 底部 Tab 页面
│   │   ├── home/           # 首页：Banner + 推荐商品
│   │   ├── category/       # 分类：商品分类展示
│   │   ├── cart/           # 购物车：增删/选中/结算
│   │   └── profile/        # 个人中心：登录/订单/设置
│   ├── goods/
│   │   ├── detail/         # 商品详情
│   │   └── list/           # 商品列表：排序/筛选
│   ├── order/
│   │   ├── confirm/        # 订单确认
│   │   └── list/           # 订单列表
│   └── login/              # 登录页
├── components/             # 公共组件
│   ├── GoodsCard.vue       # 商品卡片
│   ├── SearchBar.vue       # 搜索栏
│   └── CountInput.vue      # 数量选择器
├── store/                  # Vuex 状态管理
│   ├── index.js
│   ├── cart.js             # 购物车，localStorage 持久化
│   └── user.js             # 用户信息
├── api/                    # API 层
│   ├── index.js            # Mock HTTP 请求封装
│   └── mock.js             # Mock 数据
├── common/                 # 公共模块
│   ├── config.js           # 配置常量
│   └── utils.js            # 工具函数
└── static/                 # 静态资源
    ├── tabbar/             # 底部图标
    └── logo/               # Logo
```

## 功能模块

- **首页** — Banner 轮播、推荐商品列表、下拉刷新加载
- **分类** — 左侧分类导航 + 右侧商品列表 + 搜索筛选
- **购物车** — 勾选/取消/全选、数量增减、商品删除、localStorage 持久化
- **商品列表** — 排序切换、条件筛选、上拉加载更多
- **商品详情** — 商品图片轮播、规格选择、加入购物车
- **订单确认** — 地址选择、商品清单、提交订单
- **个人中心** — 登录/注册、头像昵称、订单管理、收货地址、设置页面
- **登录** — 手机号验证码模拟登录

## 快速开始

### 方式一：HBuilderX 运行

1. 下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 选择 `文件 → 打开目录`，选择 `uni-mall` 文件夹
3. 点击工具栏运行按钮，选择运行到浏览器 / 微信开发者工具 / App
4. 等待编译完成即可预览

### 方式二：命令行运行

```bash
# 安装依赖
npm install

# 启动开发模式
npm run dev
```

## 运行截图

> 项目截图位于 `screenshots/` 目录下，可打开查看各页面效果。

## 注意事项

- 项目数据基于 Mock 模拟，修改数据请编辑 `api/mock.js`
- 购物车数据默认存储在 `localStorage`，清空缓存会丢失
- 如需对接真实 API，修改 `api/index.js` 中的请求地址
- 全局样式变量可在 `uni.scss` 中自定义

## 许可证

MIT License