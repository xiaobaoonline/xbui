import { FilterOption } from '@xiaobaoonline/xbui'

export interface RefAttrOption {
  /** 依赖的其他prop */
  key: keyof FilterOption
  /** 其他prop需要满足的条件 */
  value: any
}

export interface FinterOptionConfig {
  /** 字段Key */
  key: keyof FilterOption
  /** 字段描述 */
  desc: string
  /** 默认值 */
  default: any
  /** 数据范围 */
  data?: any[]
  /** 字段类型 */
  type: 'jsoninput' | 'input' | 'switch' | 'select' | 'numberinput' | 'numberrange' | 'inputgroup'
  /** 字段格式 */
  format?: string
  /** 需要展示时  需要的必须数据  只支持  依赖单个属性  */
  linkattr?: RefAttrOption
}

/** 获取所有的属性配置 */
export function getBaseFilterConfig() {
  const filterItems: FinterOptionConfig[] = [
    {
      key: 'key',
      desc: '唯一Key',
      default: '',
      type: 'input',
    },
    {
      key: 'label',
      desc: '筛选项',
      default: '',
      type: 'input',
    },
    {
      key: 'type',
      desc: '筛选类型',
      type: 'select',
      default: 'select',
      data: ['select', 'numberrange', 'date', 'daterange', 'datetime', 'daterangetime', 'selectrange'],
    },
    {
      key: 'priority',
      default: 1,
      desc: '优先级描述，默认1，更低则默认不展示',
      type: 'numberinput',
    },
    {
      key: 'father',
      desc: '父级Key值',
      default: '',
      type: 'input',
      data: [],
    },
    {
      key: 'son',
      desc: '子级筛选项key值',
      default: '',
      type: 'inputgroup',
    },
  ]
  return filterItems
}

/** 获取所有的属性配置 */
export function getFilterConfig() {
  const filterItems: FinterOptionConfig[] = [
    {
      key: 'mutiple',
      desc: '下拉时是否支持多选',
      type: 'switch',
      default: false,
      linkattr: {
        key: 'type',
        value: 'select',
      },
    },
    {
      key: 'filter',
      desc: '是否支持搜索',
      default: false,
      type: 'switch',
      linkattr: {
        key: 'type',
        value: 'select',
      },
    },

    {
      key: 'remote',
      desc: '是否支持远程搜索',
      type: 'switch',
      default: false,
      linkattr: {
        key: 'type',
        value: 'select',
      },
    },
    {
      key: 'remoteUrl',
      desc: '远程搜索URL',
      type: 'input',
      default: '',
      linkattr: {
        key: 'remote',
        value: true,
      },
    },
    {
      key: 'apitype',
      desc: '远程搜索类型控制',
      default: '',
      data: ['post', 'get'],
      type: 'select',
      linkattr: {
        key: 'remote',
        value: true,
      },
    },
    {
      key: 'extraparam',
      desc: '远程请求时 接口的额外参数',
      type: 'input',
      default: '',
      format: '',
      linkattr: {
        key: 'remote',
        value: true,
      },
    },
    {
      key: 'baselist',
      desc: '下拉时支持的默认数据',
      type: 'jsoninput',
      default: '',
      format: '[{label:"1",value:1}]',
      linkattr: {
        key: 'type',
        value: 'select',
      },
    },
    {
      key: 'list',
      desc: '下拉数据源',
      default: '',
      type: 'jsoninput',
      format: '[{label:"1",value:1}]',
      linkattr: {
        key: 'type',
        value: 'select',
      },
    },
    {
      key: 'labelKey',
      default: '',
      desc: '下拉list的数据源适配',
      type: 'input',
    },
    {
      key: 'valueKey',
      default: '',
      desc: '下拉list的数据源适配',
      type: 'input',
    },
    {
      key: 'range',
      desc: '数字输入框时的数值限制',
      type: 'numberrange',
      default: [1, 100],
      linkattr: {
        key: 'type',
        value: 'numberrange',
      },
    },
    {
      key: 'fixed',
      desc: '小数点位数',
      default: 2,
      type: 'numberinput',
      linkattr: {
        key: 'type',
        value: 'numberrange',
      },
    },

    {
      key: 'unit',
      desc: '数值范围时的额外单位配置',
      type: 'input',
      default: '',
      linkattr: {
        key: 'type',
        value: 'numberrange',
      },
    },
    {
      key: 'format',
      desc: '时间格式',
      type: 'input',
      default: '',
      format: 'YYYY-MM-DD',
      linkattr: {
        key: 'type',
        value: ['date', 'daterange', 'datetime', 'daterangetime'],
      },
    },
    {
      key: 'maxSpan',
      desc: '时间范围时最大时间段限制 单位为天',
      type: 'numberinput',
      default: '',
      linkattr: {
        key: 'type',
        value: ['daterange', 'daterangetime'],
      },
    },
    {
      key: 'required',
      desc: '是否是必选项',
      type: 'switch',
      default: false,
      linkattr: {
        key: 'type',
        value: ['select', 'date', 'datetime', 'daterange', 'daterangetime'],
      },
    },
  ]
  return filterItems
}
