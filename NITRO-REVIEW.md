# Nitro核实与界面更新

核查日期：2026-10-28。源码、数据和构建产物已同步到本地 SnowboardSelection 仓库；未提交或推送。

## 界面改动

- 删除“全部雪板 / True Twin / 定向双向 / 日本品牌”整排快捷标签及其隐藏筛选逻辑；原有品牌、板型等侧栏条件保留。
- 在“按体型看建议长度”中增加男女适用：不限男女、男生、女生。明确另一性别的款式被排除，中性款与未标男女的款式保留，待核实标记不变。
- 年龄Youth与厂商明确的男女定位分开记录，避免女生儿童款出现在男生筛选中。厂商没有明确时不猜测。
- 男女筛选可单独使用，可与体重、搜索、品牌等组合；支持网址分享和重置。桌面4列体型输入，移动端2列。

## Nitro核实结果

| 项目 | 结果 |
|---|---:|
| 条目 | 56 |
| 官方1–10硬度 | 56 |
| 官方原生板型 | 56 |
| 可归入三分类 | 51 |
| 官方长度 | 56 |
| 有可用体重范围的型号 | 55 |
| 可用于自动建议的长度/体重行 | 188 |
| 官方EUR展示售价 | 56 |
| 雪季冲突，仍待核实 | 13 |

官网目录使用Sale price标签，只记录公开展示售价；具体销售国家、含税口径、常规价与MSRP未确认。Cannon目录仅起价已核，不伪造最高价。56条展示金额与官方商品接口对应金额交叉核对一致。

保留MW尺寸原文。儿童体重表的“−25”等只有上限，保留原文供人工判断，不补下限；“60+”作为开放上限。

Spirit Kids与Spirit Youth分别为1/10和2/10，长度分别086–126与132/137，没有混用。同名旧slug不替代当前-1型号。x Konvoi为无固定器Powder Surfer，原生板型不强行转为普通三分类；硬度6/10已核，骑手体重表未核实。

[Mastercarve官网参数](https://www.nitrosnowboards.com/products/mastercarve-snowboard)、[Spirit Kids官网参数](https://www.nitrosnowboards.com/collections/all-26-27/products/spirit-kids-snowboard-1)、[26/27官网欧元目录](https://www.nitrosnowboards.com/collections/snowboards-26-27)。逐款来源与原始表见data/evidence/nitro-official-review.json。

## 检查

460条数据通过schema和跨字段检查，19项测试通过，构建通过。浏览器确认快捷标签不存在；Spirit在女生筛选下2条、男生下0条；Mastercarve中性款男女各1条。未进行iPhone Safari真机验证。

