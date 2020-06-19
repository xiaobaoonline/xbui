import { XBuiComponent } from './components';
/** 筛选组件 */
export declare class XbFilter extends XBuiComponent {
    /** 列表数据 */
    data?: [];
    /** 筛选项配置数据 */
    filterdata: FilterOption[];
    /** 筛选项默认值 */
    first: {};
    /** 不可删除的默认值 */
    freeze: {};
    /** 默认已选 */
    defaultselect: [];
    /** 是否保存筛选值 */
    storge: boolean;
    /** 筛选组件名称 */
    filtername: string;
    /**
     * 清空本地保存筛选项
     */
    clearFilterItem(name: string): void;
    /** 清空筛选项
     * @param tag  是否发送回调
     */
    clearFilter(tag: boolean): void;
}
/** 筛选组件默认选项模型 */
export interface FilterItem {
    label: string | number;
    value: string | number;
    son?: string;
}
declare type OptionType = {
    /** 日期 moment().format("YYYY-MM-DD") */
    date: string;
    /** 日期范围 [moment().format("YYYY-MM-DD"),moment().format("YYYY-MM-DD")] */
    daterange: string;
    /** 日期时间 moment().format("YYYY-MM-DD HH:mm:ss") */
    datetime: string;
    /** 日期时间范围 [moment().format("YYYY-MM-DD HH:mm:ss"),moment().format("YYYY-MM-DD HH:mm:ss")] */
    daterangetime: string;
    /** 下拉选择 */
    select: string;
    /** 数值范围 */
    numberrange: string;
    /** 下拉范围选择 */
    selectrange: string;
};
/** 筛选组件筛选项配置 */
export interface FilterOption {
    label: string;
    key: string;
    type: keyof OptionType;
    filter?: boolean;
    remote?: boolean;
    priority: number;
    /** 远程搜索api地址 可配合 axiosService使用 */
    remoteUrl?: string;
    /** 默认为post */
    apitype?: 'post' | 'get';
    /** 是否支持多选 */
    mutiple?: boolean;
    /** 是否是必选项 */
    required?: boolean;
    /** 格式化类型 */
    format?: string;
    father?: string;
    son?: string | string[];
    labelKey?: string;
    valueKey?: string;
    extraparam?: {};
    list?: FilterItem[];
    /** 默认加一行空时显示 */
    baselist?: FilterItem[];
    /** datarange时  单位名字,如果是时间段的maxSpan 则可以为 d,m,y */
    unit?: string;
    range?: number[];
    fixed?: number;
    /** 时间段格式最大跨度/天 */
    maxSpan?: number;
    options?: any;
}
export {};
