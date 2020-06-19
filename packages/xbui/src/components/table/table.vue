<template>
  <div :class="classes">
    <div ref="fixedHeaderEle" :class="[prefixCls + '-headWrap']" :style="[fixedHeaderStyle]">
      <div ref="title" :class="[prefixCls + '-title']">
        <div
          v-show="$slots.headerBtn !== undefined || topCustomCol.length || bottomCustomCol.length"
          :class="[prefixCls + '-head-btn','clearfix']"
        >
          <div :class="[prefixCls + '-head-btn-slot']">
            <slot name="headerBtn"></slot>
          </div>
          <customfilter
            v-if="topCustomCol.length || bottomCustomCol.length"
            v-model="showcustom"
            :topdata="topCustomCol"
            :subdata="bottomCustomCol"
            :class="[prefixCls + '-custom-btn']"
            @onchange="customChange"
          >
            <a-button type="primary" size="small" @click="showcustom=!showcustom">自定义显示列</a-button>
          </customfilter>
        </div>
        <div v-show="$slots.headerField!==undefined" :class="[prefixCls + '-head-field']">
          <slot name="headerField"></slot>
        </div>
      </div>
      <div :class="[prefixCls + '-tableWrap',custumClass.tableWrap]">
        <XbScrollbar
          v-if="scrollBarPos=='top'"
          v-show="showVerticalBar"
          ref="scrollBar"
          :view-style="{'float':'left'}"
          @on-barScroll="handleBarScroll"
        >
          <div :style="[tableStyle]" :class="[prefixCls+'-scrollBar']"></div>
        </XbScrollbar>
        <div style="position:relative" :class="[prefixCls + '-tableHead']">
          <div
            v-if="showHeader"
            ref="header"
            :class="[prefixCls + '-header']"
            :style="centerHeaderStyle"
          >
            <table-head
              :style-object="tableStyle"
              :columns="cloneColumns"
              :columns-width="columnsWidth"
              :data="rebuildData"
            ></table-head>
          </div>
          <div
            v-if="isLeftFixed && showHeader"
            :class="[prefixCls + '-fixed']"
            :style="fixedTableStyle"
          >
            <table-head
              fixed="left"
              :style-object="fixedTableStyle"
              :columns="leftFixedColumns"
              :columns-width="columnsWidth"
              :data="rebuildData"
            ></table-head>
          </div>
          <div
            v-if="isRightFixed && showHeader"
            :class="[prefixCls + '-fixed-right']"
            :style="fixedRightWrapStyle"
          >
            <table-head
              fixed="right"
              :style-object="fixedRightTableStyle"
              :columns="rightFixedColumns"
              :columns-width="columnsWidth"
              :data="rebuildData"
            ></table-head>
          </div>
          <div v-show="resizetag" ref="resizeline" :class="[prefixCls+'-resize-line']"></div>
          <div
            v-if="hasScrollBar"
            :class="[prefixCls + '-gutter']"
            :style="{width:scrollBarWidth+'px'}"
          ></div>
        </div>
      </div>
    </div>
    <div :class="[prefixCls + '-bodywrap',custumClass.bodywrap]" :style="bodyWrapStyle">
      <div ref="mainTable" style="position:relative" :style="bodyStyle">
        <div
          v-show="(!rebuildData || rebuildData.length === 0 && !loading)"
          :class="[prefixCls + '-tip']"
        >
          <!--无数据样式slot-->
          <slot name="emptyData"></slot>
        </div>
        <div
          v-show="(rebuildData && rebuildData.length >0 && !loading)"
          ref="centerBody"
          :class="[prefixCls + '-body']"
          @scroll="handleBodyScroll"
        >
          <table-body
            ref="tbody"
            :style-object="tableStyle"
            :columns="cloneColumns"
            :data="rebuildData"
            :columns-width="columnsWidth"
          ></table-body>
        </div>
        <div
          v-if="isLeftFixed"
          v-show="(rebuildData && rebuildData.length >0 && !loading)"
          :class="[prefixCls + '-fixed']"
          :style="fixedTableStyle"
          style="top:0"
        >
          <div
            ref="fixedBody"
            :class="[prefixCls + '-fixed-body-inner']"
            @scroll="handleBodyScroll"
          >
            <table-body
              fixed="left"
              :style-object="fixedTableStyle"
              :columns="leftFixedColumns"
              :data="rebuildData"
              :columns-width="columnsWidth"
            ></table-body>
          </div>
        </div>
        <div
          v-if="isRightFixed"
          v-show="(rebuildData && rebuildData.length >0) && !loading"
          :class="[prefixCls + '-fixed-right']"
          :style="fixedRightWrapStyle"
          style="top:0"
        >
          <div
            ref="fixedRightBody"
            :class="[prefixCls + '-fixed-body-inner']"
            @scroll="handleBodyScroll"
          >
            <table-body
              fixed="right"
              :style-object="fixedRightTableStyle"
              :columns="rightFixedColumns"
              :data="rebuildData"
              :control="control"
              :columns-width="columnsWidth"
            ></table-body>
          </div>
        </div>
        <div v-show="resizetag" ref="resizeline2" :class="[prefixCls+'-resize-line']"></div>
        <a-Spin v-if="loading" fix size="large" :class="[prefixCls+'-loading']">
          <slot name="loading">
            <div class="mine-spin-loading"></div>
          </slot>
        </a-Spin>
      </div>
    </div>
    <div
      v-if="tableWidth>containerWidth&&fixHeader"
      :class="['testpos',custumClass.tableWrap]"
      :style="'width:'+containerWidth+'px'"
    >
      <XbScrollbar
        v-if="scrollBarPos=='bottom'"
        v-show="showVerticalBar"
        ref="scrollBar"
        :view-style="{'float':'left'}"
        @on-barScroll="handleBarScroll"
      >
        <div :style="[tableStyle]" :class="[prefixCls+'-scrollBar']"></div>
      </XbScrollbar>
    </div>
    <div
      v-if="rebuildData.length===1 && showNoMoreTip && !height"
      style="height: 40px;line-height: 40px;text-align: center;"
      class="noMoreInfo"
    >没有更多信息</div>
    <div ref="footer" :class="[prefixCls + '-footer']">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import tableHead from './table-head.vue';
import tableBody from './table-body';
import customfilter from '../filter/components/customfilter.vue';
import XbScrollbar from '../scrollbar/main';

import { getStyle, deepCopy, getScrollBarSize } from '../../utils/utils';
import { throttle } from '../../utils/utils';
import { on, off, hasClass } from '../../utils/dom';

const prefixCls = 'xbui-table';

let rowKey = 1;
let columnKey = 1;

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'XbTable',
  components: { tableHead, tableBody, XbScrollbar, customfilter },
})
export default class XbTable extends Vue {
  $refs!: {
    scrollBar: any;
    fixedBody: any;
    mainTable: any;
    tbody: any;
    title: any;
    header: any;
    footer: any;
    centerBody: any;
    fixedRightBody: any;
  };
  //data:列表数据
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  data!: any[];

  //pkey:列表数据项唯一标识符
  @Prop({
    type: [String, Array],
    default: 'Id',
  })
  pkey!: string | any[];
  //selectedPkeys:默认选中项
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  selectedPkeys!: any[];

  @Prop({ type: String })
  name!: string;
  //columns:表格列的配置描述
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  columns!: any[];
  //fixHeader:是否固定表头
  @Prop({
    type: Boolean,
    default: false,
  })
  fixHeader!: boolean;
  //fixedTop:固定表头时到顶部的距离
  @Prop({
    type: [Number, String],
  })
  fixedTop!: number | string;
  //fixedScrollTop:body滚动条到顶部的距离
  @Prop({
    type: [Number, String],
  })
  fixedScrollTop!: number | string;
  @Prop({
    type: [Number, String],
  })
  height!: number | string;
  @Prop({
    type: Boolean,
    default: false,
  })
  stripe!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  border!: boolean;
  @Prop({
    type: Boolean,
    default: true,
  })
  showHeader!: boolean;
  @Prop({
    type: Function,
    default() {
      return '';
    },
  })
  rowClassName!: (...arg: any[]) => any;
  @Prop({
    type: Function,
    default() {
      return '';
    },
  })
  spanMethod!: (...arg: any[]) => any;
  //control:操作列
  @Prop({
    type: Object,
    default() {
      return {
        width: 60,
        options: [],
      };
    },
  })
  control!: any;
  //defaultSort:默认排序参数
  @Prop({
    type: Object,
    default() {
      return {
        key: '',
        order: '',
      };
    },
  })
  defaultSort!: any;
  //modal:是否在弹窗中使用
  @Prop({
    type: Boolean,
    default: false,
  })
  modal!: boolean;
  //custumClass:自定义样式
  @Prop({
    type: Object,
    default() {
      return {};
    },
  })
  custumClass!: any;
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  slotkeys!: any[];
  @Prop({
    type: String,
    default: 'top', // bottom
  })
  scrollBarPos!: string;
  //resizeable:是否可拖拽修改宽度
  @Prop({
    type: Boolean,
    default: true,
  })
  resizeable!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  loading!: boolean;
  @Prop({
    type: Boolean,
    default: true,
  })
  showNoMoreTip!: boolean;

  ready: boolean = false;
  addFixedStyle: boolean = false; //是否添加固定表头样式
  tableWidth: number = 0; //表格宽度，可能超出父层宽度
  centerWidth: number = 0; //除去padding的表格包裹层宽度
  containerWidth: number = 0; //$el宽度
  columnsWidth: any = {};
  prefixCls: string = prefixCls;
  rebuildData: any[] = [];
  topCustomCol: any[] = [];
  bottomCustomCol: any[] = [];
  customStorage: any = {};
  cloneColumns: any[] = [];
  leftFixedColumns: any[] = [];
  rightFixedColumns: any[] = [];
  bodyHeight: number = 0;
  bodyRealHeight: number = 0;
  scrollBarWidth: any = getScrollBarSize();
  fixedColumnsBodyRowsHeight: any[] = [];
  deletePkeys: any[] = []; //删除的数组
  clearAllFlag: boolean = false;
  selections: any[] = [];
  selectionPkeys: any[] = [];
  propselectedPkeys: any[] = [];
  showcustom: boolean = false;
  sortKey: string = this.defaultSort.key; //排序参数
  sortOrder: string = this.defaultSort.order || 'desc';
  lastScrollTop: number = 0;
  currentHoverRow: number = -1;
  currentClickRow: number = -1;
  selectTriggerByRow: boolean = false;
  isRadio: boolean = false;
  resizetag: boolean = false;
  draglineleft: number = 0;
  expandArr: any[] = [];
  storgeWidth: any = {};

  get hasScrollBar() {
    return this.bodyHeight > 0 && this.bodyHeight < this.bodyRealHeight;
  }
  get showVerticalBar() {
    return this.tableWidth > this.centerWidth;
  }
  get classes() {
    return [
      `${prefixCls}`,
      {
        [`${prefixCls}-border`]: this.border,
        [`${prefixCls}-stripe`]: this.stripe,
        [`${prefixCls}-hide`]: !this.ready,
        [`${prefixCls}-with-fixed-top`]: !!this.height,
        [`${prefixCls}-with-gutter`]: this.hasScrollBar,
        [`${prefixCls}-in-modal`]: this.modal,
        [`${prefixCls}-not-modal`]: !this.modal,
        [`${prefixCls}-with-vertical-bar`]: this.showVerticalBar,
      },
    ];
  }
  get tableStyle() {
    let style: any = {};
    if (this.tableWidth !== 0) {
      let width: any = '';
      if (this.bodyHeight === 0) {
        width = this.tableWidth;
      } else {
        if (this.hasScrollBar) {
          width = this.tableWidth - this.scrollBarWidth;
        } else {
          width = this.tableWidth;
        }
      }
      style.width = `${width}px`;
    }
    return style;
  }
  get fixedTableStyle() {
    let style: any = {};
    let width = 0;
    this.leftFixedColumns.forEach(col => {
      if (col.show) width += col.realWidth || col.minWidth;
    });
    style.width = `${width}px`;
    return style;
  }
  get centerHeaderStyle() {
    let style: any = {};
    if (this.hasScrollBar) {
      let width = this.centerWidth - this.scrollBarWidth;
      style.width = `${width}px`;
    }
    return style;
  }
  get fixedRightWrapStyle() {
    let style: any = {};
    let width = 0;
    this.rightFixedColumns.forEach(col => {
      if (col.show) width += col.realWidth || col.minWidth;
    });
    if (this.hasScrollBar) {
      width += this.scrollBarWidth;
    }
    style.width = `${width}px`;
    return style;
  }
  get fixedRightTableStyle() {
    let style: any = {};
    let width = 0;
    this.rightFixedColumns.forEach(col => {
      if (col.show) width += col.realWidth;
    });
    style.width = `${width}px`;
    return style;
  }
  get bodyStyle() {
    let style: any = {};
    if (this.bodyHeight !== 0) {
      const height = this.bodyHeight;
      style.height = `${height}px`;
    } else if (this.loading) {
      style.height = '600px';
    }
    return style;
  }
  get isLeftFixed() {
    return this.leftFixedColumns.filter(col => col.show).length;
  }
  get isRightFixed() {
    return this.rightFixedColumns.filter(col => col.show).length;
  }
  get fixedHeaderStyle() {
    let style: any = {};
    if (this.addFixedStyle) {
      style.position = 'sticky';
      style.top = this.fixedTop + 'px';
      style.width = this.containerWidth + 'px';
    }
    return style;
  }
  get bodyWrapStyle() {
    let style: any = {};
    // if (this.addFixedStyle) {
    //     style.marginTop = this.$refs.fixedHeaderEle.getBoundingClientRect().height + 'px';
    // }
    if (!this.rebuildData.length) {
      style.paddingBottom = 0;
    }
    return style;
  }

  @Watch('data', { deep: true })
  dataWatch() {
    const oldDataLen = this.rebuildData.length;
    this.rebuildData = this.makeDataWithSort();
    this.handleResize();
    if (!oldDataLen) {
      this.fixedHeader();
    }
  }
  @Watch('columns', { deep: true })
  columnsWatch() {
    this.makeColumns();
    this.handleResize();
  }
  @Watch('height')
  heightWatch() {
    this.fixedHeader();
  }
  @Watch('addFixedStyle')
  addFixedStyleWatch(val: any) {
    this.$emit('on-fixed-change', val);
    if (val) {
      this.containerWidth = parseInt(getStyle(this.$el, 'width'));
    }
  }

  rowClsName(index: number) {
    return this.rowClassName(this.data[index], index);
  }
  //计算表格内容单元格高度，处理fixed列单元格高度和表格内容单元格高度一致
  syncFixedTableRowHeight() {
    if (!this.isLeftFixed && !this.isRightFixed) {
      return;
    }
    this.$nextTick(() => {
      if (!this.$refs.centerBody) return;
      if (!this.$refs.centerBody.querySelector('tbody')) return;
      let trRows = this.$refs.centerBody.querySelector('tbody').children || [];
      let bodyRows = [].filter.call(trRows, row => row);
      let fixedColumnsBodyRowsHeight: any[] = [];
      let normalRowCount = 0;
      bodyRows.forEach((row: any) => {
        let height = row.offsetHeight && row.offsetHeight < 2000 ? row.offsetHeight : 'auto';
        if (hasClass(row, `${this.prefixCls}-row`)) {
          normalRowCount += 1;
          fixedColumnsBodyRowsHeight.push({
            height: height,
            expandHeight: 0,
          });
        } else if (hasClass(row, `${this.prefixCls}-expanded-row`)) {
          fixedColumnsBodyRowsHeight[normalRowCount - 1].expandHeight = height;
        }
      });
      this.fixedColumnsBodyRowsHeight = fixedColumnsBodyRowsHeight;
    });
  }
  customChange(data: any) {
    this.resetCustomShow(data);
    this.customStorage[data.key] = data.display;
    this.setLocalData(this.customStorage);
    this.handleResize();
    this.changeCustomdata(data);
    this.$emit('on-custom-change', data);
  }
  changeCustomdata(data: any) {
    let findIndex = this.topCustomCol.findIndex(item => item.key === data.key);
    if (findIndex > -1) {
      this.topCustomCol[findIndex].show = data.display;
    } else {
      let findBottomIndex = this.bottomCustomCol.findIndex(item => item.key === data.key);
      this.bottomCustomCol[findBottomIndex].show = data.display;
    }
  }
  resetCustomShow(data: any) {
    let findIndex = this.cloneColumns.findIndex(item => item.key === data.key);
    if (findIndex > -1) {
      this.cloneColumns[findIndex].show = data.display;
    }
  }
  updateColumnsWidth(flexColumns: any, totalFlexWidth: any) {
    if (flexColumns.length === 1) {
      flexColumns[0].realWidth = totalFlexWidth;
    } else {
      const allFlexColumnsWidth = flexColumns.reduce(
        (prev: any, column: any) => prev + (column.width || column.minWidth),
        0,
      );
      const flexWidthPerPixel = totalFlexWidth / allFlexColumnsWidth;
      let realTotalFlexColumnWidth = 0;
      flexColumns.forEach((column: any, index: any) => {
        const width = typeof column.width !== 'number' ? column.minWidth : column.width;
        if (index !== 0) {
          let realFlexColumnWidth = Math.floor(width * flexWidthPerPixel);
          realTotalFlexColumnWidth += realFlexColumnWidth;
          flexColumns[index].realWidth = realFlexColumnWidth;
        }
      });
      flexColumns[0].realWidth = totalFlexWidth - realTotalFlexColumnWidth;
    }
  }
  doLayout() {
    //安置所有列所需要的最小宽度总和
    let bodyMinWidth = 0;
    let staticWidth = 0;
    this.cloneColumns.forEach(column => {
      bodyMinWidth += column.show ? column.width || column.minWidth : 0;
      staticWidth += column.show && column.width ? column.width : 0;
    });
    //宽度分配的列
    let flexColumns = this.cloneColumns.filter(column => column.show && typeof column.width !== 'number');
    //滚动条宽度，可用宽度需减去滚动条宽度
    const scrollYWidth = this.hasScrollBar ? this.scrollBarWidth : 0;
    //存在宽度不定的列
    if (flexColumns.length) {
      //宽度之和小于容器宽度，不设置width的列需要分配剩下的宽度
      if (bodyMinWidth < this.centerWidth - scrollYWidth) {
        const totalFlexWidth = this.centerWidth - scrollYWidth - staticWidth;
        this.updateColumnsWidth(flexColumns, totalFlexWidth);
      } else {
        flexColumns.forEach(function(column) {
          column.realWidth = column.minWidth;
        });
      }
    } else {
      //当所有列都有固定宽度而总宽度依然小于父层宽度时，为解决固定列宽度问题，需将其中一列的宽度设为总宽度减去其余列宽
      if (bodyMinWidth < this.centerWidth - scrollYWidth) {
        const totalFlexWidth = this.centerWidth - scrollYWidth;
        //宽度分配的列
        let showColumns = this.cloneColumns.filter(column => column.show);
        this.updateColumnsWidth(showColumns, totalFlexWidth);
      } else {
        this.cloneColumns.forEach(column => {
          column.realWidth = column.width || column.minWidth;
        });
      }
    }
    this.tableWidth = Math.max(bodyMinWidth, this.centerWidth);
    this.columnsWidth = {};
    this.$nextTick(() => {
      this.syncFixedTableRowHeight();
    });
    // 高度小于表格真实高度时显示纵向滚动条
    if (!this.$refs.tbody) return;
    this.bodyRealHeight = parseInt(getStyle(this.$refs.tbody.$el, 'height'));
  }
  handleResize() {
    this.$nextTick(() => {
      this.centerWidth = parseInt(getStyle(this.$refs.mainTable, 'width'));
      this.containerWidth = parseInt(getStyle(this.$el, 'width'));
      this.throttleLayout();
    });
  }
  throttleLayout!: () => void;
  handleMouseIn(_index: any, event: any) {
    this.currentHoverRow = _index;
    this.$emit('row-mouse-enter', this.rebuildData[_index], event);
  }
  handleMouseOut(_index: any, event: any) {
    this.currentHoverRow = -1;
    this.$emit('row-mouse-out', this.rebuildData[_index], event);
  }
  setCurrentRow(_index: any, data: any) {
    this.currentClickRow = _index;
    if (this.isRadio) {
      this.selections = [data];
      this.selectionPkeys = [data._pkey];
      this.$emit('on-select', this.selections, data);
      this.$emit('on-selection-change', this.selections);
    }
    this.clickCurrentRow(data);
  }
  clickCurrentRow(data: any) {
    if (this.selectTriggerByRow) {
      this.toggleSelect(data);
    }
    this.$emit('on-row-click', data);
  }
  changeByitem(data: any) {
    //未添加 preselect
    this.selectTriggerByRow = true;
    this.clickCurrentRow(data);
    this.selectTriggerByRow = false;
  }
  changeBypKey(pkey: any) {
    //未添加 preselect
    this.selectTriggerByRow = true;
    this.clickCurrentRow({ _pkey: pkey });
    this.selectTriggerByRow = false;
  }
  clearSelection() {
    let columns: any = this.cloneColumns[0];
    let preselectfn: any = typeof columns.preselect == 'function' ? columns.preselect : undefined;
    let unpasspkeys: any[] = [],
      unpassselections: any[] = [];
    this.clearAllFlag = true;
    for (let i = 0; i < this.selections.length; i++) {
      let data = this.selections[i];
      if (preselectfn && !preselectfn(data, false, 'all')) {
        unpasspkeys.push(data._pkey);
        unpassselections.push(data);
      }
    }
    this.selectionPkeys = unpasspkeys;
    this.selections = unpassselections;
    this.$emit('on-selection-change', this.selections);
  }
  getSelections() {
    return this.selections;
  }
  getpropSelectedData() {
    return this.selectedPkeys.slice(0);
  }
  getPkey(row: any) {
    if (Array.isArray(this.pkey)) {
      let keyarr: any[] = [];
      this.pkey.forEach(k => {
        keyarr.push(row[k]);
      });
      return keyarr.join('_') || rowKey++;
    } else {
      return row[this.pkey] || rowKey++;
    }
  }
  toggleSelect(row: any) {
    if (row._disabled) {
      return;
    }
    let pky = row._pkey;
    let index = this.selectionPkeys.indexOf(pky);
    if (index === -1) {
      this.selections.push(row);
      this.selectionPkeys.push(pky);
      let addIndex = this.deletePkeys.indexOf(pky);
      if (addIndex > -1) {
        this.deletePkeys.splice(index, 1);
      }
    } else {
      this.selections.splice(index, 1);
      this.selectionPkeys.splice(index, 1);
      this.deletePkeys.push(pky);
    }
    this.$emit('on-select', this.selections, row);
    this.$emit('on-selection-change', this.selections);
  }
  toggleExpand(index: any) {
    let data = this.data[index];
    let expandData = this.expandArr[index];
    const status = !expandData.expanded;
    expandData.expanded = status;
    this.$nextTick(() => {
      this.syncFixedTableRowHeight();
    });

    this.$emit('on-expand', JSON.parse(JSON.stringify(data)), status);
  }
  selectAll(status: any) {
    let columns = this.cloneColumns[0];
    let preselectfn = typeof columns.preselect == 'function' ? columns.preselect : undefined;
    for (let i = 0; i < this.rebuildData.length; i++) {
      let data = this.rebuildData[i];
      if (data._disabled) {
        continue;
      } else {
        let pk = data._pkey;
        let index = this.selectionPkeys.indexOf(pk);
        if (status) {
          if (index === -1 && ((preselectfn && preselectfn(data, true, 'all')) || !preselectfn)) {
            this.selectionPkeys.push(pk);
            this.selections.push(data);
            let addIndex = this.deletePkeys.indexOf(pk);
            if (addIndex > -1) {
              this.deletePkeys.splice(index, 1);
            }
          }
        } else {
          if (index !== -1 && ((preselectfn && preselectfn(data, false, 'all')) || !preselectfn)) {
            this.deletePkeys.push(pk);
            this.selectionPkeys.splice(index, 1);
            this.selections.splice(index, 1);
          }
        }
      }
    }

    this.$emit('on-select-all', this.selections, status);
    this.$emit('on-selection-change', this.selections);
  }
  fixedHeader() {
    if (this.height) {
      this.$nextTick(() => {
        const titleHeight = parseInt(getStyle(this.$refs.title, 'height')) || 0;
        const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
        const footerHeight = parseInt(getStyle(this.$refs.footer, 'height')) || 0;
        this.bodyHeight = (this.height as number) - titleHeight - headerHeight - footerHeight;
      });
    } else {
      this.bodyHeight = 0;
    }
  }
  //固定表头效果
  addScrollEffect(event: any) {
    let t = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (t > this.fixedScrollTop) {
      this.addFixedStyle = true;
    } else {
      this.addFixedStyle = false;
    }
  }
  handleBodyScroll!: () => void;

  handleBodyScrollthrottle(event: any) {
    if (this.lastScrollTop !== event.target.scrollTop) {
      if (this.isLeftFixed && event.target !== this.$refs.fixedBody)
        this.$refs.fixedBody.scrollTop = event.target.scrollTop;
      if (this.isRightFixed && event.target !== this.$refs.fixedRightBody)
        this.$refs.fixedRightBody.scrollTop = event.target.scrollTop;
      if (event.target !== this.$refs.centerBody) this.$refs.centerBody.scrollTop = event.target.scrollTop;
    }
    this.lastScrollTop = event.target.scrollTop;
    this.$emit('on-scroll', event);
    let scrollTop = event.target.scrollTop;
    let scrollHeight = event.target.scrollHeight;
    let offsetHeight = event.target.offsetHeight;
    if (scrollTop > scrollHeight - offsetHeight - 120) {
      this.$emit('on-load-more', event);
    }
  }
  handleBarScroll(scrollObj: any, type: any) {
    //   let distance = scrollObj.distance;
    if (type == 'relative') {
      if (this.showHeader)
        this.$refs.header[scrollObj.scroll] = this.$refs.header[scrollObj.scroll] + scrollObj.distance;
      this.$refs.centerBody[scrollObj.scroll] = this.$refs.centerBody[scrollObj.scroll] + scrollObj.distance;
      return;
    }
    if (this.showHeader) this.$refs.header[scrollObj.scroll] = scrollObj.distance;
    this.$refs.centerBody[scrollObj.scroll] = scrollObj.distance;
  }
  sortData(data: any, type: any, index: any) {
    if (!this.cloneColumns[index]) {
      return data;
    }
    const key = this.cloneColumns[index].key;
    data.sort((a: any, b: any) => {
      if (this.cloneColumns[index].sortMethod) {
        return this.cloneColumns[index].sortMethod(a, b, key, type);
      } else {
        if (type === 'asc') {
          return a[key] > b[key] ? 1 : -1;
        } else if (type === 'desc') {
          return a[key] < b[key] ? 1 : -1;
        }
      }
    });
    return data;
  }
  handleSort(index: any, type: any) {
    const key = this.cloneColumns[index].key;
    this.sortKey = key;
    this.sortOrder = type;
    if (this.cloneColumns[index].sortable !== 'custom') {
      this.rebuildData = this.sortData(this.rebuildData, type, index);
    }
    this.$emit('on-sort-change', {
      column: this.cloneColumns[index],
      key: key,
      order: type,
    });
  }
  makeData() {
    let data = this.data.slice(0);
    let that = this;
    this.expandArr = [];
    let deleteFlag = true;
    for (let i = 0; i < that.propselectedPkeys.length; i++) {
      for (let k = 0; k < that.deletePkeys.length; k++) {
        if (that.propselectedPkeys[i] === that.deletePkeys[k]) {
          deleteFlag = false;
        }
      }
    }
    data.forEach((row, index) => {
      row._index = index;
      row._rowKey = rowKey++;
      row._pkey = this.getPkey(row); //数据唯一k
      row._disabled = row._disabled || false;
      row._expanded = row._expanded || false;
      if (
        !this.clearAllFlag &&
        this.propselectedPkeys.indexOf(row._pkey) > -1 &&
        this.selectionPkeys.indexOf(row._pkey) == -1 &&
        deleteFlag
      ) {
        //默认值处理
        this.selections.push(row);
        this.selectionPkeys.push(row._pkey);
      }
      this.expandArr.push({
        expanded: row._expanded,
      });
    });
    this.propselectedPkeys = [];
    return data;
  }
  makeDataWithSort() {
    this.propselectedPkeys = this.getpropSelectedData();
    let data = this.makeData();
    let isCustom = false;
    let sortIndex = -1;
    if (this.sortKey) {
      for (let i = 0; i < this.cloneColumns.length; i++) {
        if (this.cloneColumns[i].key === this.sortKey) {
          sortIndex = i;
          isCustom = this.cloneColumns[i].sortable === 'custom';
          break;
        }
      }
    }
    if (!isCustom) {
      data = this.sortData(data, this.sortOrder, sortIndex);
    }
    if (this.selectedPkeys.length) {
      this.$emit('on-selection-change', this.selections);
    }
    return data;
  }
  makeColumns() {
    let columns = deepCopy(this.columns);
    let topCustomCol: any[] = [];
    let bottomCustomCol: any[] = [];
    let left: any[] = [];
    let right: any[] = [];
    let center: any[] = [];
    if (this.control.options.length) {
      columns.push({
        title: '操作',
        type: 'control',
        width: this.control.width || 60,
        fixed: 'right',
        align: this.control.align || 'left',
        handleArr: this.control.options,
      });
    }
    //取持久化自定义隐藏数据 并重置现有数据
    this.customStorage = this.getLocalData();
    //取持久化自定义列宽数据 并重置现有数据
    this.storgeWidth = this.getLocalData('width');
    columns.forEach((column: any, index: any) => {
      column._index = index;
      column._columnKey = columnKey++;
      column.width = column.width; //初始设置的宽度
      column.dragable = typeof column.width !== 'number';
      column.realWidth = column.width ? column.width : '';
      column.minWidth = column.minWidth || column.width || 80; //拖拽最小宽度
      column.show = 'show' in column ? column.show : true;
      column.renderType = 'normal';
      if (column.type && column.type !== 'link') {
        column.renderType = column.type;
      } else if (column.render) {
        column.renderType = 'selfRender';
      }
      if (column.type === 'selection') {
        this.selectTriggerByRow = column.triggerType === 'row';
      }
      if (column.type === 'radio') {
        this.isRadio = true;
      }
      if (column.custom) {
        if (column.key in this.customStorage) {
          column.show = this.customStorage[column.key];
        }
        if (column.isExtend) {
          bottomCustomCol.push({
            key: column.key,
            label: column.title,
            display: column.show,
          });
        } else {
          topCustomCol.push({
            key: column.key,
            label: column.title,
            display: column.show,
          });
        }
      }
      if (column.key in this.storgeWidth) {
        column.width = this.storgeWidth[column.key];
        column.realWidth = this.storgeWidth[column.key];
      }
      if (column.fixed && column.fixed === 'left') {
        left.push(column);
      } else if (column.fixed && column.fixed === 'right') {
        right.push(column);
      } else {
        center.push(column);
      }
    });
    this.topCustomCol = topCustomCol;
    this.bottomCustomCol = bottomCustomCol;
    this.leftFixedColumns = left;
    this.rightFixedColumns = right;
    this.cloneColumns = left.concat(center).concat(right);
  }
  setLocalData(colobj: any, type = '') {
    if (this.name) {
      localStorage.setItem('table' + this.name + type, JSON.stringify(colobj));
    }
  }
  getLocalData(type: string = '') {
    let data;
    if (this.name) {
      data = JSON.parse(localStorage.getItem('table' + this.name + type) as any);
    }
    return data || {};
  }
  saveColumnWidth(column: any) {
    this.storgeWidth[column.key] = column.realWidth;
    this.setLocalData(this.storgeWidth, 'width');
  }
  handleWheel(event: any) {
    // console.log(event)
    if (!this.$refs.scrollBar) {
      return;
    }
    if (event.deltaX < 0) {
      event.preventDefault();
    }
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      this.handleBarScroll(
        {
          scroll: 'scrollLeft',
          distance: event.deltaX,
        },
        'relative',
      );
      this.$refs.scrollBar.handleWhell(this.$refs.header['scrollLeft'] + event.deltaX);
    }
  }

  created() {
    this.makeColumns();
    this.rebuildData = this.makeDataWithSort();
    this.throttleLayout = throttle(this.doLayout, 200);
    this.handleBodyScroll = throttle(this.handleBodyScrollthrottle, 10);
  }
  mounted() {
    this.fixedHeader();
    this.handleResize();
    this.$nextTick(() => {
      this.ready = true;
    });
    if (this.fixHeader) {
      on(window, 'scroll', this.addScrollEffect);
    }
    on(window, 'resize', this.handleResize);
    let that = this;
    on(this.$el, 'wheel', function(event: any) {
      that.handleWheel(event);
    });
  }
  activated() {
    this.handleResize();
  }
  beforeDestroy() {
    if (this.fixHeader) {
      off(window, 'scroll', this.addScrollEffect);
    }
    off(window, 'resize', this.handleResize);
  }
}
</script>
<style lang="less">
@import './style/index.less';
.testpos {
  position: fixed;
  bottom: 0;
  height: 10px;
  z-index: 1;
}
/* .testpos div{
    width:1000px;
    height:10px;
} */
</style>
