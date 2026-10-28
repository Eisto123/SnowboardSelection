# BOARD ATLAS · 雪板档案

可公开发布到 GitHub Pages 的中文单板选购工具。纯 HTML / CSS / JavaScript，无运行时依赖、无账户、无服务器。源码与已经构建好的 `dist/` 同时提供；所有资源路径相对引用，支持 `https://用户名.github.io/仓库名/` 子路径。

## 当前交付（v1.4）

- 16 个品牌，460 条型号 / 雪季记录：011 Artistic、Arbor、Bataleon、Burton、CAPiTA、Jones、K2、Never Summer、Nitro、OGASAKA、RIDE、Rome、Salomon、YES、YONEX、thirtytwo。
- 149 条官方数值硬度，355 条含已核实体重尺码数据的记录；其余字段按实际证据保留为换算值或未知。完整实时覆盖表在网站“数据说明”。
- 搜索、品牌、三种板型、硬度 1–10 与官方值限定、水平、玩法、系列定位、雪季、长度、币种、预算筛选与排序。
- 同季官方图片左右切换 / 横滑；同型号已收录雪季左右切换；最多 4 条记录对比。
- 本地收藏、收藏导入 / 导出、可分享筛选网址、按厂商体重表优先推荐长度，缺表时提供标明来源的通用参考。

新增8个品牌共217条记录：Burton40、RIDE24、K2 25、Salomon36、Never Summer28、thirtytwo18、OGASAKA26、YONEX20。详见 [本轮补全报告](ENRICHMENT.md)。

Burton Spellbinder 与 Salomon Taka Split 2.0 雪季仍待核实；其余35款Salomon已通过官方FW2026–27技术目录产品编号确认雪季，不按抓取年份猜测。OGASAKA 英文官网为日本未税价；YONEX 官方商店为日本含税价。K2 / RIDE 的价格采用可核实的美国官方目录，不混用自动地区跳转后的币种。RIDE Response 和 Salomon 文字硬度以换算估值展示；YONEX F/T 保留为原生指标说明，不直接当成1–10。

这不是“所有品牌所有产品线已完成”的数据库。当前为官方目录快照，部分目录可能分页或漏掉地区专供 / 历史款；技术数据尚未逐条补齐。范围、来源与后续品牌队列见 `data/coverage.json`。

## 发布到 GitHub Pages（你自行操作）

1. 新建 GitHub 仓库，通常选择 Public，默认分支使用 `main`。
2. 将本项目**内部所有文件**上传到仓库根目录，必须包含 `.github/workflows/deploy.yml`；不要把 ZIP 整个上传，也不要多套一层 `snowboard-atlas/`。网页上传器可能遗漏点开头目录，上传后确认 workflow 文件存在；也可使用 GitHub Desktop 上传整个文件夹。
3. 仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。
4. 打开 Actions，运行 `Validate and deploy GitHub Pages`；或者在启用 Pages 后再提交一次修改。该 workflow 支持手动触发。
5. 成功后在 Pages 或 workflow 的 deployment 输出中取得网站 HTTPS 链接，发送这个链接给 iPhone 用户，在 Safari 中打开。

无需填写仓库名、部署密钥或环境变量。主分支如果不是 `main`，需要同步修改 workflow 的分支条件。PR 只校验和构建，不部署。此项目没有替你创建仓库或部署。

GitHub 官方说明：[使用自定义 workflow 发布 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

### 不想先运行构建

ZIP 已附 `dist/`。可以直接用静态托管服务发布该目录；GitHub Actions 方案仍建议上传完整源码，让以后改数据时自动重建。

## 本地预览

安装 Node.js 22 或更高版本后，在此目录打开终端：

```sh
npm run validate
npm test
npm run build
npm run dev
```

打开终端显示的 `http://127.0.0.1:4173/`。无需 `npm install`。修改 `site/` 或 `data/` 后重新运行 `npm run build`，再刷新。

**iPhone 使用 HTTPS 网页链接，不从“文件”应用打开下载的 HTML。** 后者对脚本、模块和文件来源有限制，正是静态托管要解决的问题。项目按 iOS Safari 15.4+ 的功能范围设计：响应布局、16px 表单字体、安全区底部边距、触摸操作、可横向滚动的对比表、减少动态效果选项。没有真机 Safari 验证时不得宣称已通过 iPhone 实测。

## 文件结构

```text
site/                       页面源码与筛选逻辑
data/brands/*.json          每品牌独立的人工审阅数据
data/schema.json            JSON Schema，字段与枚举约束
data/coverage.json          来源、范围、后续导入队列
scripts/build.mjs           校验并生成 dist/catalog.mjs
scripts/validate.mjs        schema 子集校验与跨字段检查
scripts/import-shopify.mjs  分页获取待审候选，不覆盖生产数据
scripts/serve.mjs           本地静态预览
tests/catalog.test.mjs      关键业务规则测试
.github/workflows/          校验、构建、Pages 发布
dist/                       已构建的发布版本
```

`dist/catalog.mjs` 是构建产物，**不要直接修改**。新增品牌只需新增 JSON 文件，不需改界面代码。品牌、雪季和币种筛选自动生成。

## 数据维护

### 新品牌 / 新雪季：先候选、再核实、再发布

1. 从品牌官网确认目录 URL、地区、雪季和当前覆盖范围。优先官网产品页或官方 PDF，不用店铺价格替代官网 MSRP。
2. Shopify 品牌可先取公开候选：

   ```sh
   node scripts/import-shopify.mjs "NewBrand" https://official-brand.example 2026/27
   ```

   脚本逐页读取，最多 20 页，并记录分页是否完成。只把候选保存到忽略提交的 `work/`；不会把接口中的衣服、绑定器、未知币种、猜测雪季等直接当成雪板生产数据。非 Shopify 品牌手工整理官方 PDF / 产品页即可。

3. 复制一个已有记录结构到 `data/brands/new-brand.json`，按 `schema.json` 填写。`id` 永久稳定，建议“品牌 + 型号 + 雪季”。旧雪季保留独立记录；`family` 相同且 `brand` 相同就会在同一卡片中切换。不同长度 / 配色的同季记录不要重复成雪季。
4. 逐项确认板型、硬度原值和尺度、系列定位、长度、长度对应的体重范围、地区币种、定价性质、税费、雪季图源；每个 `price`、`flex`、`fit`、`image` 均保留来源 URL。未知写 `null` 或空数组，不能填 0、随意猜值或补上不确定数据。
5. `levels` 与 `terrains` 为编辑推荐归类，必须有官网依据并写清 `recommendationBasis`。不要把编辑意见包装为官方等级。性别是厂商系列定位，不是体型适配规则。
6. 运行 `npm run validate`、`npm test`、`npm run build`，浏览器检查新记录，更新 `coverage.json` 和核查日期。完成后提交；Actions 会自动重建和发布。

### 硬度口径

- `official`：厂商已明确 1–10 的数值，原样保留；`original` 保存原始写法。Arbor 的 `flex:N` 为官方目录标签。品牌内相对尺度不等于跨品牌物理标定。
- `converted`：有官方原描述，以透明映射统一导航：soft/softer=3、mid-soft=4、medium=5、mid-stiff=7、stiff=8，误差约 ±1；`method` 必填。
- `unknown`：`value` 和 `source` 均为 `null`。不使用“图上看起来软”或其他网站的评分冒充官方。
- 厂商为 1–5 等其他数值尺度时，应先明确原尺度，再记录转换公式与依据；当前没有为没有原尺度证据的型号执行这类转换。

### 定价口径

`price.kind="msrp"` 仅在官网明确使用 MSRP 且有对应证据时填写。当前数据大多来自官方产品目录的常规定价 / 官方原价，标为 `official-list`，页面明确显示 **MSRP 未单独确认**。官网促销价格和建议零售价不能混称；需按尺码变价时保留范围。不得把美元符号直接解释为 USD；Nitro 国际站已核实 EUR 展示售价，记录为 official-display；具体国家、税费和MSRP仍待核实。

### 长度与体型

`sizes` 为实际厂商长度标签，如 `143`、`156W`。`fit` 只录入同雪季官方体重表，单位 kg；上限开放写 `null`。当前部分 Jones / Bataleon / Rome 及39款Burton、21款K2、23款RIDE、55款Nitro页面完成此项核实。填写体重后返回**所有**符合范围的长度，不做伪精确唯一推荐。身高可用于缺表时的通用参考，Mondo 输入暂只作页面内个人参考，缺少可靠宽度表时不推断鞋码适配。

### 图片与使用权

图片 URL 从官网产品目录 / 官方品牌页面直接取得；每条图片包含雪季、署名、原图与来源链接。前端直接加载官方 CDN；没有把不存在的旧雪季图片或示意板花伪装成真图。加载失败时自动重试原图和其它已收录官方视图，仍失败则提供官网入口与重试；会话内不重复请求已失败URL。新8品牌K2/RIDE 49款主图已保存到项目；部分其它品牌图源仍待核实；已有官方链接也不等于本地网络一定可达。

代码许可不覆盖商标与产品图片。品牌图源可核实不代表已取得转载授权；公开发布前可向权利方确认使用条件，或在相同字段替换为已授权素材。项目没有附任何声称这些品牌图片为 CC0 的授权。

## 检查与局限

- 自动校验 schema 使用的所有约束，并检查 ID 唯一、硬度证据、换算方法、价格雪季、图片雪季、体重范围与尺寸。
- 功能测试覆盖未知硬度排除、不同币种预算 / 排序、零预算、体重表边界、雪季归组、多条件搜索、收藏输入清洗、无效数据拒绝。
- 浏览器检查与当前未测试范围见 `QA.md`。没有在 GitHub 执行实际部署；workflow 已按 Pages 官方流程配置，需要你上传后运行。
- 数据是 2026-10-28 的快照，价格、库存和官网 URL 会变化。并不包含所有品牌 / 所有年代产品；未确认字段会影响筛选结果，不自动视作符合条件。

## 许可

原创网站代码按 MIT 许可发布，详见 `LICENSE`。事实数据与原始来源、品牌商标和图片分别遵循其权利归属。

## 本次更新

移除顶部快捷标签，保留侧栏板型等筛选。体型建议新增男女适用筛选，中性及未标男女的款式两边保留；厂商明确为女生设计的儿童款只保留在女生筛选中，年龄Youth独立保留。Nitro核实范围和证据见NITRO-REVIEW.md。

数据新增可选riderGender、shapeOriginal；尺寸支持MW（保留厂商Mid-Wide原文，不与W混同）。price.kind新增official-display，表示当前官网展示售价而非已核实MSRP；startsAt表示仅起价已核实，价格上限未核实。

## v1.3 体型建议与图片维护

v1.3 时官方体重表覆盖277/460条，共1606条逐长度范围；该轮新增128款802条范围。CAPiTA36/36、Rome24/24、YES15/15全覆盖。当时 Arbor、Salomon、Never Summer、thirtytwo及部分日本品牌仍有体重区间缺口，v1.4 最新状态见下；Jones部分J.26页面缺26/27证明，不强行混入。

缺表时可按RIDE官方152–183cm成人通用身高/体重表给参考，精确来源、插值和限制见页面数据说明及data/evidence/general-sizing-reference.json；它不是CASI标准或厂商型号表。仅匹配已知板长，不生成新尺寸。绿色为厂商匹配、橙色为通用估算，也可选择仅厂商表。

K2/RIDE49款主图已下载为原始JPEG至site/assets/boards，并随构建复制到dist/assets/boards。每张保留官方URL、来源和署名，SHA-256见data/evidence/k2-ride-image-review.json。Metropolitan/Heartbreaker官网地址丢失品牌账户段，保留原始错误、修复依据和HTTP200证据。Marauder/Lowride图文件含2526，图片雪季保留待核实，不冒称本季板花。新增图只需放入site/assets/boards并设置images[].local，校验会检查文件/JPEG签名；原始远端URL必须保留。

详细说明见SIZING-IMAGE-REVIEW.md。本次不自动提交或推送。

## v1.4 逐品牌尺码复核

当前 355/460 款有官方体重记录，共 2037 行，其中27行单位冲突仅供查看、不参与自动匹配。Salomon36款201行（Taka Split 2.0仅155已核），thirtytwo18款108行（15行仅上限）。Never Summer24款122行，4款及部分不匹配长度保留未知；详见 WEIGHT-TABLE-REVIEW.md。011八款增加官方离散身高参考表，并补回X FLY漏录的151、154尺寸；该表不转换成体重范围。Arbor33份CSV、OGASAKA与YONEX官方资料继续留待核实，不能把板重或腰宽当骑手体重。

卡片新增“查看体重表 / 官方身高表”入口，标出已核长度数；原始加号、只有上限以及官方单位冲突均保留说明。`fit[].weightKg` 使用null表示未公布端点，不是0；可选weightOriginal保留kg原文，weightNote记录限制。可选referenceOnly排除来源矛盾的记录参与自动匹配。可选heightGuide存储独立的官方身高参考点、图源和解释，不参与体重匹配。

证据见data/evidence下的salomon-weight-review-fw2627.json、arbor-thirtytwo-hidden-weight-review.json、japanese-weight-review.json及011-official-height-guide-2027.json。原始抓取辅助脚本scripts/review-weight-sources.mjs的输出位于被Git忽略的work/weight-pages；可用--manifest 指向包含url/file的JSON清单下载官方证据，不修改正式数据。
