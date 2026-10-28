# 体重表复核 · 2026-10-28

当前460条型号中，355款收录了官方骑手体重数据，共2037条逐长度记录；其中27条官方单位冲突，仅供查看、不参与自动匹配。有记录不代表所有长度均已核实。本轮新增78款、431行，并为011八款新增独立的官方身高参考表。

| 品牌 | 有体重记录 / 型号数 | 已核长度行数 | 本轮结果 |
|---|---:|---:|---|
| 011 Artistic | 0 / 8 | 0 | 官方提供身高参考，新增8款48个非空格；不换算体重 |
| Arbor | 0 / 33 | 0 | 33份官方CSV均无骑手体重列，保留待核实 |
| Bataleon | 38 / 39 | 234 | 保留已有官方表，新增卡片直接入口 |
| Never Summer | 24 / 28 | 122 | 逐张目视27张官方尺码图，匹配当前型号和长度 |
| OGASAKA | 0 / 26 | 0 | 复核当前26页官方目录，未取得可靠kg范围 |
| Rome | 24 / 24 | 146 | 保留已有官方表，新增卡片直接入口 |
| Salomon | 36 / 36 | 201 | 35款全长度，Taka Split 2.0仅155已核 |
| YES | 15 / 15 | 72 | 保留已有官方表，新增卡片直接入口 |
| YONEX | 0 / 20 | 0 | 复核官方规格/目录/FAQ，继续待核实 |
| thirtytwo | 18 / 18 | 108 | 从官方隐藏规格行取得93完整范围及15仅上限 |

## 来源及边界

- **Salomon**：[日本官网目录入口](https://salomon.jp/pages/snowboard-catalog)提供FW2026–27技术书。先匹配article code，再从可见KG列读数，排除页面外的重复文字，并视觉补录轮廓字体。35款据此确认2026/27雪季；图片未单独确认雪季的仍保留原标记。Taka Split 2.0仅155通过官网实际sizeId与几何参数唯一匹配60–80kg；158、161未知。逐行PDF页码和映射记录见`data/evidence/salomon-weight-review-fw2627.json`。
- **thirtytwo**：产品HTML的隐藏`Weight range(lbs/kg)`行确有数据，先核对canonical、标题和T.27产品编号。`-68kg`等只表达上限，存为`[null,68]`，前端显示“≤68（仅公布上限）”，匹配结果仍明确仅上限参考，不能推断最低体重。见`arbor-thirtytwo-hidden-weight-review.json`。
- **Never Summer**：尺码图下半部分包含逐长度kg表，网页alt文字并不完整。只导入当前官方产品页面实际链接、型号和当前尺寸对应的列；57行上限带`+`，保留原文及开放上限。28处kg/lb数值或加号矛盾按厂家kg原文展示，明确提示冲突，不自行修正。Trooper158X原图`54–200+kg`明显异常，仍保留原文和警示。图中没有独立雪季文字，部分文件名含2025/2026，不以文件名证明本季适用；此限制在型号详情与逐款审计中披露。Shaper Twin LT、Maverix、Instagator、Men's Small Batch Shaper Twin四款仍无可靠体重记录；Summit T3图中161/167不擅自映射为当前161X/167X。见`neversummer-official-image-weight-review.json`。
- **011**：[官方身高表](https://www.011artistic.com/product/snowboard/sizeguide/)只有≤150、155、160、165、170、175、≥180几个身高标签。中间值是离散参考点，不虚构连续区间、插值或体重表；空格不解释为禁用。X FLY的151、154两个长度通过当前官方完整规格图补回，其他7款与身高表长度一致。见`011-official-height-guide-2027.json`和`011-x-fly-size-correction.json`。
- **Arbor**：动态尺码CSV只有几何参数。Veda链接A-Frame表，Mantra Decon链接Madre表，型号与长度不符，未套用；Red Gerard Pro链接含2026的CSV也不当成本季依据。精确CSV清单已保存`arbor-official-csv-manifest.json`。没有找到可靠范围不等于声明厂商任何地方都未发布。
- **OGASAKA / YONEX**：当前可核实资料没有可靠骑手kg范围；板重、侧切、腰宽均不当成骑手体重。YONEX英文页`Weight(g)`列的异常8050等数值不使用。审计见`japanese-weight-review.json`。

## 网页及数据维护

卡片新增“查看体重表 · 已核长度/总长度”入口，直接打开详情尺码位置。011显示“查看官方身高表”。未核实继续明确留白。修复缺表详情中通用参考被错误显示为模板字符串的问题。

`fit[].weightKg`两个端点均可为null，但不能同时为空；null不是0。`weightOriginal`保留厂家kg原文，`weightNote`说明开放端点或冲突。官方表优先；缺少型号表才启用既有RIDE通用估算，不覆盖有表但体重无匹配的情况。011的`heightGuide`单独保存原始参考点及出处，不自动换算成体重匹配。

Never Summer原图28处单位冲突中，27条属于当前已收录长度，均标记`referenceOnly:true`，保留原文供核对，排除自动推荐；另一处属于未导入的图中长度。不能用另一单位反算来擅自修正官方数字。

本次仅修改本地仓库及构建结果，不提交、不推送、不发布。
