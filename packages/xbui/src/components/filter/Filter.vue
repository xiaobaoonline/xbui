<template>
  <div class="xbf-mainbox">
    <div class="xbf-fr xbf-lh30 xbf-flex">
      <slot name="head" />
      <span
        v-show="priority.level2.length + priority.level3.length"
        class="xbf-fr xbf-linttext"
        type="text"
        @click="showmore"
      >
        {{ showmoretag ? '收起更多' : '更多筛选' }}
        <a-Icon type="caret-down" :class="{ 'xbui-ani-down': true, 'xbui-ani-up': showmoretag }" />
      </span>
    </div>
    <div class="xbf-filtercomp-box">
      <div v-for="item in uimodel" :key="item.key" class="xbf-filterdropitem" :name="item.key">
        <component
          :is="getCurrentComponent(item.type)"
          :parentdata="uimodel"
          :dropdata="item"
          :outerdata="outselecteddata[item.key]"
          @datechange="changeDate"
        >
          <slot :name="item.key" />
        </component>
      </div>
    </div>
    <selecteddata
      :basedata="uimodel"
      :selected-len="selectedLen"
      :showmoretag="!!(priority.level2.length + priority.level3.length)"
      @handleThis="handleThis"
      @handleClearData="handleClearData"
      @clearFilter="clearFilter"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import selecteddata from './components/selecteddata.vue';
import customfilter from './components/customfilter.vue';
import dropdate from './components/dropdate.vue';
import droplist from './components/droplist.vue';
import dropdaterange from './components/dropdaterange.vue';
import numberrange from './components/numberrange.vue';
import selectrange from './components/selectrange.vue';

let changecount: number = 1;

import { getIndex, setItem, getItem, clearItem, debounce } from '../../utils/utils';
import { FilterOption } from './../../model/filter';

let clock: any = null;
// Vue.prototype.$axiosServices = axios;
const componentMap: any = {
  select: 'droplist',
  date: 'dropdate',
  datetime: 'dropdate',
  daterange: 'dropdaterange',
  daterangetime: 'dropdaterange',
  numberrange: 'numberrange',
  selectrange: 'selectrange',
};

// let id: number = 1;
@Component({
  name: 'XbFilter',
  components: {
    selecteddata,
    customfilter,
    droplist,
    dropdate,
    numberrange,
    selectrange,
    dropdaterange,
  },
})
export default class XbFilter extends Vue {
  // provide: {
  //   track: true, // 是否埋点
  // },

  /** 筛选数据 */
  @Prop({
    default: () => {
      return [];
    },
  })
  filterdata!: FilterOption[];

  /** 首次进来时的默认值 */
  @Prop({
    default: () => {
      return {};
    },
  })
  first!: any;

  /** 不可更改的默认值 暂不启用 TODO 待补充 */
  @Prop({
    default: () => {
      return {};
    },
  })
  freeze!: object;

  /** 已选数据 */
  @Prop({
    default: () => {
      return [];
    },
  })
  defaultselect!: any[];

  /** 首次是否默认往外发送一次  默认为true*/
  @Prop({ default: true, type: Boolean })
  autoemit!: boolean;

  /** 是否保存筛选值  默认为true*/
  @Prop({ default: true, type: Boolean })
  storage!: boolean;

  /** 筛选组件名称 请起唯一名 查找本地存储时使用 */
  @Prop({ default: '', type: String })
  filtername!: string;

  /** 外部的勾选项 */
  outselecteddata: any = {};

  search: string = '';
  showcustom: boolean = false;
  selectedLen: number = 0;
  paramdata: any = {};
  uimodel: any = {};
  handleEmit!: () => void;
  initTag: boolean = false; // 是否还是在初始化数据
  priority: any = {
    level1: [],
    level2: [],
    level3: [],
  };
  showmoretag: boolean = false;
  // $axiosServices = Vue.prototype.$axiosServices;

  @Watch('filterdata')
  filterdataChange(val: any) {
    this.handlebaseData();
  }

  // @Watch('first')
  // firstdataChange(val: any) {
  //   // this.resetSelectedFilter();
  // }

  // /** 提供给外部做刷新用的 */
  // resetSelectedFilter() {
  //   this.$nextTick(() => {
  //     if (this.filtername) {
  //       this.clearFilterItem(this.filtername);
  //     }
  //     this.handlebaseData(true);
  //     this.setpackParam();
  //   });
  // }

  /** 外部设置某一项的值 */
  selectData(key: string, val: any) {
    // this.outselecteddata[key] = val;
    this.$set(this.outselecteddata, key, {
      value: val,
      tick: changecount++,
    });
  }

  mounted() {
    this.handleEmit = debounce(this.onFilterChange, 150);
    this.handlebaseData();
    this.setpackParam();
  }
  ifdisabled(item: any) {
    // if (item.type !== 'select' && item.type !== 'rangefornumber'&& item.type !== 'rangefordate') {
    //     return true;
    // }
    if (!item.father) {
      return false;
    } else {
      return this.uimodel[item.father].selectedArr.length == 0;
    }
  }
  getCurrentComponent(type: any) {
    return componentMap[type];
  }

  /** 清空筛选项 */
  clearFilter(tag: boolean = true) {
    let count = 0;
    for (let prop in this.uimodel) {
      if (this.uimodel[prop].required) {
        count++;
      } else {
        this.uimodel[prop].selectedArr = [];
        this.uimodel[prop].selectedObj = {};
        this.uimodel[prop].datevalue = '';
        this.uimodel[prop].dateval = [];
      }
    }
    this.selectedLen = count;
    this.setpackParam(tag);
  }
  ifselected(item: any, fi: any) {
    let valueKey = item.valueKey || 'value';
    return item.selectedObj[fi[valueKey]] == true;
  }
  getStorageData(localdata: any, item: any) {
    let obj: any = {};
    let arr: any[] = [];
    let datevalue = '';
    let datevals: any[] = [];
    let valueKey = item.valueKey || 'value';

    /** 处理默认值 */
    if (this.first[item.key]) {
      let current: any[] = this.first[item.key];
      if (!Array.isArray(current)) {
        console.warn('XBUI:筛选组件 默认值数据格式错误,请提供数组格式：' + item.label);
      } else {
        if (item.type == 'select') {
          /** 标识默认值选项是否是对象 */
          let tag = true;
          current.forEach((fi) => {
            if (typeof fi === 'object') {
              obj[fi[valueKey]] = true;
            } else {
              tag = false;
              if (item.remote) {
                console.warn(
                  'XBUI:筛选组件 支持远程搜索的默认值 建议提供对应选项对象，只传ID可能导致渲染错误' + item.label,
                );
              }
              obj[fi] = true;
            }
          });
          if (tag) {
            arr = current;
          } else {
            let cachearr: any[] = [];
            item.list.map((li: any) => {
              if (current.indexOf(li[valueKey]) != -1) {
                cachearr.push(li);
              }
            });
            arr = cachearr;
          }

          if (arr.length) {
            this.selectedLen++;
          }
        } else if (item.type == 'date' || item.type == 'datetime') {
          datevalue = current[0];
          if (datevalue) {
            this.selectedLen++;
          }
        } else if (item.type == 'daterange' || item.type == 'daterangetime') {
          datevals = current;
          if (datevals.length) {
            this.selectedLen++;
          }
        } else if (item.type == 'numberrange' || item.type == 'selectrange') {
          arr = current;
          if (datevals.length) {
            this.selectedLen++;
          }
        }
      }
    }

    if (localdata && localdata[item.key]) {
      if (item.type == 'select' && Array.isArray(localdata[item.key])) {
        obj = {};
        localdata[item.key].map((fi: any) => {
          if (typeof fi == 'object') {
            obj[fi[valueKey]] = true;
          } else {
            obj[fi] = true;
          }
        });
        arr = localdata[item.key];
        if (arr.length) {
          this.selectedLen++;
        }
      } else if (item.type == 'date' || item.type == 'date') {
        datevalue = localdata[item.key];
        if (datevalue) {
          this.selectedLen++;
        }
      } else if (item.type == 'daterange' || item.type == 'daterangetime') {
        datevals = localdata[item.key];
        if (datevals.length) {
          this.selectedLen++;
        }
      } else if (item.type == 'numberrange' || item.type == 'selectrange') {
        arr = localdata[item.key];
        if (datevals.length) {
          this.selectedLen++;
        }
      }
    }
    return { obj, arr, datevalue, datevals };
  }
  /** 处理默认值数据 */
  handlebaseData(tag: boolean = false) {
    let filterobj: any = {};
    let localdata = this.getFilterStorge(this.filtername);
    let custumlocaldata = this.getFilterStorge(this.filtername + '_custum');

    let keysarr: any[] = [];

    this.priority = {
      level1: [],
      level2: [],
      level3: [],
    };
    this.filterdata.forEach((item) => {
      let { obj, arr, datevalue, datevals } = this.getStorageData(localdata, item);
      if (!keysarr.includes(item.key)) {
        keysarr.push(item.key);
        this.priority['level' + item.priority].push({
          key: item.key,
          label: item.label,
          display: item.priority == 1 ? true : custumlocaldata[item.key],
        });
      }

      filterobj[item.key] = {
        ...item,
        display: item.priority == 1 ? true : custumlocaldata[item.key], // 筛选项是否显示
        show: false, //下拉框是否展示
        loading: false, //是否在获取远端数据
        searchtext: '',
        searching: false, //是否在搜索状态
        datevalue: datevalue,
        dateval: datevals,
        selectedObj: obj, // 已选数据的对象 以下拉项的value为key
        selectedArr: arr, // 已选数据的数据 以下拉项的value为key
      };
      // 处理 筛选项的显示 规则 1-3级  1级常显   2级 可以勾选  默认显示  3级 默认不显示 自定义
      // 还要处理 本地缓存的筛选项 之前已经显示的数据
      // let storge = this.getFilterStorge(this.filtername);
    });
    // console.log(filterobj);
    // Object.keys(filterobj).forEach(key => {
    //   this.$set(this.uimodel, key, filterobj[key]);
    // });

    this.uimodel = filterobj;
    this.setCustomFilter();
    this.initTag = true;
    if (!tag) {
      this.handleEmit();
    }
  }
  /** 处理选择某一个的情况 */
  handleThis(filter: any, item: any) {
    if (this.ifdisabled(filter)) {
      return;
    }
    let valueKey = filter.valueKey || 'value';
    let index = getIndex(filter.selectedArr, item, valueKey);
    if (filter.required && index > -1 && filter.selectedArr.length == 1) {
      return;
    }
    let key = typeof item == 'object' ? item[valueKey] : item;
    if (filter.mutiple) {
      if (index === -1) {
        if (!filter.selectedArr.length) {
          this.selectedLen++;
        }
        filter.selectedArr.push(item);
        this.$set(filter.selectedObj, key, true);
      } else {
        filter.selectedArr.splice(index, 1);
        if (!filter.selectedArr.length) {
          this.selectedLen--;
        }
        filter.selectedObj[key] = false;
      }
    } else {
      filter.selectedObj = {};
      filter.show = false;
      if (index === -1) {
        if (!filter.selectedArr.length) {
          this.selectedLen++;
        }
        filter.selectedArr = [item];
        this.$set(filter.selectedObj, key, true);
      } else {
        filter.selectedArr = [];

        filter.selectedObj[key] = false;
        this.selectedLen--;
      }
      filter.show = false;
    }

    this.clearSonData(filter);
    this.setpackParam();
  }
  clearSonData(currentfilter: any) {
    /** 处理有子级的情况 */
    // 添加多层子级的情况
    let sonarr = currentfilter.son ? (Array.isArray(currentfilter.son) ? currentfilter.son : [currentfilter.son]) : [];
    this.checksondata(sonarr, currentfilter.label);
    sonarr.map((son: any) => {
      let sondata = this.uimodel[son];
      if (sondata.selectedArr.length) {
        sondata.selectedArr = [];
        sondata.selectedObj = {};
      }
      // 如果自己的父级被隐藏 则自己也隐藏  处理多儿子的情况
      let father = this.uimodel[sondata.father];
      if (!father) {
        console.warn('XBUI:父级配置错误：' + sondata.label);
      } else {
        sondata.display = father.display;
      }
      sondata.datevalue = '';
      sondata.dateval = [];
      if (sondata.remote) {
        sondata.list = [];
      }
      this.selectedLen--;
      if (sondata.son) {
        this.clearSonData(sondata);
      }
    });
  }
  /** 获取本地缓存 */
  getFilterStorge(name: any) {
    let value = getItem(name);
    if (value) {
      return JSON.parse(value);
    } else {
      return {};
    }
  }
  /** 设置本地缓存  */
  setFilterStorge(name: any, data: any) {
    if (this.storage && this.filtername) {
      setItem(name, data);
    }
  }
  /** 清除该组件本地缓存 */
  clearFilterItem(name: any) {
    clearItem(name);
  }
  handleClearData(val: any) {
    this.uimodel[val.key].datevalue = '';
    this.uimodel[val.key].dateval = [];
    this.uimodel[val.key].selectedArr = [];
    this.uimodel[val.key].selectedObj = {};
    this.setpackParam();
  }
  showmore() {
    this.showmoretag = !this.showmoretag;
    let keys = Object.keys(this.uimodel);
    for (let i = 0; i < keys.length; i++) {
      if (this.uimodel[keys[i]].priority > 1) {
        this.uimodel[keys[i]].display = this.showmoretag;
      }
    }
  }
  customChange(val: any) {
    this.uimodel[val.key].display = val.display;
    // 处理子级？？
    if (this.uimodel[val.key].son) {
      this.uimodel[this.uimodel[val.key].son].display = val.display;
    }
    this.setCustomFilter();
  }
  setCustomFilter() {
    if (!this.filterdata.length) {
      return; /** 修复 实际使用时 第一次初始化无值的情况 */
    }
    let obj: any = {};
    let keys = Object.keys(this.uimodel);
    for (let i = 0; i < keys.length; i++) {
      if (this.uimodel[keys[i]].display) {
        obj[keys[i]] = true;
      }
    }
    setItem(this.filtername + '_custum', obj);
  }
  /** 父级变动后 对子级数据的处理 */
  checksondata(sonarr: any, label: any) {
    sonarr.forEach((son: any) => {
      let sondata = this.uimodel[son];
      if (!son || !sondata || !sondata.key) {
        console.warn('XBUI:筛选组件 子级配置错误：' + label);
        return;
      }
    });
  }
  getFatherparam(fatherKey: any) {
    let obj: any = {};
    obj[fatherKey] = this.getpackParam()[fatherKey];
    return obj;
  }
  handleRemote(targetItem: any, param: any, callback: any) {
    let { remoteUrl, label, apitype = 'post' } = targetItem;
    if (!this.$axiosServices) {
      console.warn('XBUI:筛选组件 请配置：$axiosServices：vue.$prototype.$axiosServices = axiosService');
    }
    if (remoteUrl) {
      this.$axiosServices[apitype](remoteUrl, param).then((res: any) => {
        callback(res.data);
      });
    } else {
      console.warn('XBUI:筛选组件 如果使用远程数据，请设置正确的远程API地址：' + label);
    }
  }
  changeDate(val: any) {
    this.setpackParam();
  }
  changeRange() {
    this.setpackParam();
  }
  setpackParam(tag = true) {
    if (!this.filterdata.length) {
      return; /** 修复 实际使用时 第一次初始化无值的情况 */
    }
    let paramdata: any = {};
    for (let prop in this.uimodel) {
      let data = this.uimodel[prop];
      if (data.type == 'select' && data.selectedArr.length) {
        paramdata[prop] = data.selectedArr;
      } else if (data.type == 'date' || data.type == 'datetime') {
        paramdata[prop] = data.datevalue;
      } else if ((data.type == 'daterange' || data.type == 'daterangetime') && data.dateval.length && data.dateval[0]) {
        paramdata[prop] = data.dateval;
      } else if ((data.type === 'numberrange' || data.type === 'selectrange') && data.selectedArr.length) {
        paramdata[prop] = data.selectedArr;
      }
    }
    this.paramdata = paramdata;
    this.setFilterStorge(this.filtername, paramdata);
    if (tag) {
      this.handleEmit();
    }
  }
  handleError(errmsg: any) {
    this.$emit('onError', errmsg);
  }
  getpackParam() {
    let paramdata: any = {};
    for (let prop in this.uimodel) {
      let data = this.uimodel[prop];
      if ((data.type == 'date' || data.type == 'datetime') && this.paramdata[prop]) {
        paramdata[prop] = [this.paramdata[prop]];
      } else if (data.type == 'daterange' || data.type == 'daterangetime') {
        paramdata[prop] = this.paramdata[prop];
      } else if (data.type == 'select') {
        let obj = data.selectedObj;
        let arr: any[] = [];
        for (let prop in obj) {
          if (obj[prop]) {
            arr.push(prop);
          }
        }
        paramdata[prop] = arr;
      } else if (data.type == 'numberrange' || data.type == 'selectrange') {
        paramdata[prop] = data.selectedArr;
      }
    }

    return paramdata;
  }
  onFilterChange() {
    let param = this.getpackParam();
    this.$emit('on-filter-change', param);
    this.getSelectStop(param);
  }
  /** 用于埋点，60s 没操作，则向外触发事件 */
  getSelectStop(param: any) {
    if (clock) {
      clearTimeout(clock);
    }
    clock = setTimeout(() => {
      this.$emit('getSelectStop', param);
    }, 1000 * 60);
  }
}
</script>

<style lang="less">
@import './style/index.less';
</style>
