## 筛选数据配置：FilterOption

```typescript
/** 筛选组件筛选项配置 */
export interface FilterOption {
  label: string
  key: string
  type: 'daterange' | 'select' | 'date' | 'numberrange' | 'selectrange' | 'datetime' | 'daterangetime'
  filter: boolean
  /** 数据源是否为API获取 */
  remote: boolean
  /** 展示优先级 */
  priority: number
  /** 远程方法 配合remote 默认参数为 {pageIndex:1,pageSize:50} 配合滚动加载 */
  remoteUrl?: string
  /** 默认为post */
  apitype?: 'post' | 'get'
  /** 是否支持多选 */
  mutiple?: boolean
  /** 是否是必填项是则不可被删除 */
  required?: boolean
  /** 格式化类型 配合日期时间组件 */
  format?: string
  /** 父级的Key */
  father?: string
  /** 子级的Key */
  son?: string | string[]
  /** list label的Key 配合remote时 远程数据格式与默认不匹配 */
  labelKey?: string
  /** list label的Key 配合remote时 远程数据格式与默认不匹配 */
  valueKey?: string
  /** remoteUrl 配合remote时 远程方法参数与默认不匹配 */
  extraparam?: {}
  /** 本地或远程的数据源 格式为 FilterItem 类型数组 */
  list?: FilterItem[]
  /** 默认加一行空时显示 格式与 list 内的 FilterItem 相同 */
  baselist?: FilterItem[]
  /** datarange时  单位名字 默认课时 */
  unit?: string
  /** datarange时  数据可输入范围 默认 [9999999.99,9999999.99] */
  range?: number[]
  /** datarange时  数据的小数位数 默认为2位小数 */
  fixed?: number
  /** daterange时 时间段格式最大跨度/天 */
  maxSpan?: number
  /** 时间组件额外配置 */
  options?: Options
}
```

## 单个筛选项配置 list,baselist

```typescript
/** 筛选组件默认选项模型 value和label可以与 valueKey与labelKey配合使用 */
export interface FilterItem {
  label: string | number
  value: string | number
  son?: string
}
```

## 时间组件额外配置  

> 和 DatePicker 的 options 相同

```typescript
// ant-design版本
// 只支持 daterange/daterangetime
export interface ShortCutAnt {
  [k:string]:[moment(),moment()]
}
export interface Options {
  shortcuts?:ShortCutAnt,
  disabledDate():boolean
}


//spui 2.0版本
// 只支持 daterange/daterangetime
export interface ShortCut {
  text: string,
  value():[string,string]
}

export interface Options {
  shortcuts?:ShortCut[],
  disabledDate():boolean
}
```

### 自定义下拉格式代码示例

```html
<xb-filter
  :filterdata="filterdata"
  :first="first"
  :freeze="freeze"
  @on-filter-change="changeFilter"
  @getSelectStop="getSelectStop"
  @getSelectDuration="getSelectDuration"
>
  <template slot="Dateee" slot-scope="data">
    {{data.label}}+{{data.value}}
  </template>
</xb-filter>
```
