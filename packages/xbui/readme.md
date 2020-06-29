## 组件库

目前已集成组件

- [高级筛选](xbfilter)

# 筛选组件

## API

### Prop

| prop           | 描述                                   | 默认值 | 类型                                    |
| -------------- | -------------------------------------- | :----: | --------------------------------------- |
| filterdata     | _筛选项配置数据_                       |   []   | Array   [FilterOption](#FilterOption)[] |
| first          | _筛选项默认值_                         |   {}   | Object [Indexer](#first)                |
| freeze(未启用) | _不可删除的默认值_                     |   {}   | Object                                  |
| storge         | _是否保存筛选值，存在本地，刷新后保持_ |  true  | Boolean                                 |
| filtername     | _筛选组件名称,配合 storge_             |   -    | String                                  |

### Slot

| 名称       | 描述                                  |
| ---------- | ------------------------------------- |
| head       | 一般用于和列表页的搜索框等结合使用    |
| 筛选项 key | 自定义 下拉筛选组件的下拉项自定义配置 |

### Event

| 方法              | 描述                                    | 返回值      |
| ----------------- | --------------------------------------- | ----------- |
| on-filter-change  | 默认回传<br />所有的回传 val 数据为数组 | {key:val[]} |
| getSelectStop     |                                         |             |
| getSelectDuration | 获取单个选择项花费时间，神策等使用      |             |

## 支持场景

### 1. date\datetime

日期类
<a name="TACui"></a>

### 2. daterange\daterangetime

日期范围类 配合字段 maxSpan：最大的日期选择范围<br />以上日期类配合字段  :`options` `format` `maxSpan` 
<a name="de6xq"></a>

### 3. numberrange

数字范围类 配合字段 range 数字范围，fixed 小数点位数  ，unit 选择之后的文案后缀<br />默认限制大小  <br />配合字段： `unit`  
<a name="ix2hU"></a>

### 4. select

一般的下拉筛选项 可配合自定义下拉格式。<br />配合字段： `remote`  `required` `list` `baselist` `mutiple` `filter` `extraparam` 
<a name="8aPqP"></a>

### 5. selectrange

选择范围类 12     一般用于确定的 如年龄段等<br />默认限制大小<br />配合字段 `list` <br />
