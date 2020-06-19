<template>
  <div :class="classes">
    <div class="hidden">
      <slot></slot>
    </div>
    <div :class="[prefixCls + '-header-wrap']">
      <div ref="header" :class="[prefixCls + '-header']" :style="headerStyle">
        <table-head :columns="columns" :data="data"></table-head>
      </div>
    </div>
    <div v-if="hasScrollBar" :class="[prefixCls + '-gutter']" :style="{width:scrollBarWidth+'px'}"></div>
    <div :class="[prefixCls + '-body-wrap']" :style="bodyStyle">
      <div v-show="(!data || data.length === 0 && !loading)" :class="[prefixCls + '-tip']">
        <!--无数据样式slot-->
        <slot name="emptyData"></slot>
      </div>
      <div
        v-show="(data && data.length >0)"
        ref="scrollBody"
        :class="[prefixCls + '-body']"
        :style="bodyStyle"
        @scroll="handleBodyScroll"
      >
        <table-body ref="centerBody" :columns="columns" :data="data"></table-body>
      </div>
      <a-Spin v-if="loading" fix size="large" class="light-table-spin">
        <slot name="loading">
          <div class="mine-spin-loading"></div>
        </slot>
      </a-Spin>
    </div>
  </div>
</template>
<script lang="ts">
const prefixCls = 'xbui-light-table';
import tableHead from './table-head';
import tableBody from './table-body';
import { getScrollBarSize, throttle } from '../../utils/utils';

import { on, off } from '../../utils/dom';

import Mixin from './mixin';

import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'XbLightTable',
  components: {
    tableHead,
    tableBody,
  },
})
export default class XbLightTable extends Mixin {
  $refs!: {
    scrollBody: any;
    header: any;
    centerBody: any;
  };
  //data:列表数据
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  data!: any[];

  @Prop({
    type: Boolean,
    default: false,
  })
  loading!: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  border!: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  height!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  maxHeight!: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  modal!: boolean;

  //pkey:列表数据项唯一标识符
  @Prop({
    type: [String, Array],
    default: 'id',
  })
  pkey!: string | any[];

  //selectedItem:默认选中项，pkey中的属性必须存在，格式{lessonId:1,schoolId:2}
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  selectedItem!: any[];

  //禁止选中项，pkey中的属性必须存在，格式{lessonId:1,schoolId:2}
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  disabledItem!: any[];

  @Prop({
    type: Function,
    default() {
      return true;
    },
  })
  preselect!: (...arg: any) => boolean;

  @Prop({
    type: String,
    default: '',
  })
  triggerType!: string;
  @Prop({
    type: Function,
    default() {
      return '';
    },
  })
  rowClassName!: () => void;

  columns: any[] = [];
  bodyHeight: number = 0;
  hasScrollBar: boolean = false;
  scrollBarWidth = getScrollBarSize();
  selections: any[] = [];
  selectionPkeys: string[] = [];
  bodyRealHeight: number = 0;
  throttleLayout!: () => {};
  handleBodyScroll!: () => {};

  get disabledPkeys() {
    return this.disabledItem.map(item => {
      return this.getPkey(item, this.pkey);
    });
  }
  get classes() {
    return [
      `${prefixCls}`,
      {
        [`${prefixCls}-border`]: this.border,
        [`${prefixCls}-with-gutter`]: this.hasScrollBar,
        [`${prefixCls}-in-modal`]: this.modal,
        [`${prefixCls}-no-height`]:
          (this.height === 0 && this.maxHeight === 0) || (this.maxHeight && !this.hasScrollBar),
      },
    ];
  }
  get bodyStyle() {
    let style: any = {};
    if (this.bodyHeight !== 0) {
      const height = this.bodyHeight;
      if (this.height) {
        style.height = `${height}px`;
      } else if (this.maxHeight) {
        style['max-height'] = `${height}px`;
      }
    }
    if (this.loading) {
      style['min-height'] = `100px`;
    }
    return style;
  }
  get headerStyle() {
    let style: any = {};
    if (this.hasScrollBar) {
      style.paddingRight = `${this.scrollBarWidth}px`;
    }
    return style;
  }
  @Watch('data')
  handleDatachange(val: any, oldVal: any) {
    if (val.length < oldVal.length && this.$refs.scrollBody) {
      this.$refs.scrollBody.scrollTop = 0;
    }
    this.setSelectedPkeys();
    this.handleResize();
  }
  @Watch('selectedItem', { deep: true })
  handleSelectedChange() {
    this.selections = [];
    this.selectionPkeys = [];
    this.setSelectedPkeys();
  }

  created() {
    this.throttleLayout = throttle(this.doLayout, 200);
    this.handleBodyScroll = throttle(this.handleScroll, 10);
    this.setSelectedPkeys();
  }
  mounted() {
    this.getBodyHeight();
    this.handleResize();
    on(window, 'resize', this.handleResize);
  }
  beforeDestroy() {
    off(window, 'resize', this.handleResize);
  }

  getBodyHeight() {
    let height = this.height || this.maxHeight || 0;
    this.$nextTick(() => {
      if (height) {
        const headerHeight = this.$refs.header ? this.$refs.header.offsetHeight : 0;
        this.bodyHeight = height - headerHeight;
      } else {
        this.bodyHeight = 0;
      }
      this.hasScrollBar = this.bodyHeight > 0 && this.bodyHeight < this.bodyRealHeight;
    });
  }
  insertColumn(column: any) {
    if (
      this.columns.findIndex(item => {
        return item.key === column.key;
      }) === -1
    ) {
      this.columns.push(column);
    }
  }
  deleteColumn(column: any) {
    let index = this.columns.findIndex(item => {
      return item.key === column.key;
    });
    if (index !== -1) {
      this.columns.splice(index, 1);
    }
  }
  doLayout() {
    this.bodyRealHeight = this.$refs.centerBody ? this.$refs.centerBody.$el.offsetHeight : 0;
    this.hasScrollBar = this.bodyHeight > 0 && this.bodyHeight < this.bodyRealHeight;
  }
  handleResize() {
    this.$nextTick(() => {
      this.throttleLayout();
    });
  }
  handleScroll(event: any) {
    this.$emit('on-scroll', event);
    let scrollTop = event.target.scrollTop;
    let scrollHeight = event.target.scrollHeight;
    let offsetHeight = event.target.offsetHeight;
    if (scrollTop > scrollHeight - offsetHeight - 120) {
      this.$emit('on-load-more', event);
    }
  }
  clickCurrentRow(row: any) {
    this.$emit('on-row-click', row);
  }
  //处理默认选中项
  setSelectedPkeys() {
    this.selectedItem.forEach(item => {
      let pky = this.getPkey(item, this.pkey);
      let index = this.selectionPkeys.indexOf(pky);
      if (index === -1) {
        this.selections.push(item);
        this.selectionPkeys.push(pky);
      }
    });
  }
  toggleSelect(row: any, type: any) {
    let pky = this.getPkey(row, this.pkey);
    let status = this.selectionPkeys.indexOf(pky) > -1;
    if (!this.preselect(row, !status, 'one')) {
      return;
    }
    if (this.disabledPkeys.indexOf(pky) !== -1) {
      return;
    }
    if (type === 'checkbox') {
      let index = this.selectionPkeys.indexOf(pky);
      if (index === -1) {
        this.selections.push(row);
        this.selectionPkeys.push(pky);
      } else {
        this.selections.splice(index, 1);
        this.selectionPkeys.splice(index, 1);
      }
    } else {
      this.selections = [row];
      this.selectionPkeys = [pky];
    }
    this.$emit('on-select', this.selections, row);
    this.$emit('on-selection-change', this.selections);
  }
  selectAll(status: boolean) {
    for (let i = 0; i < this.data.length; i++) {
      let row = this.data[i];
      let pky = this.getPkey(row, this.pkey);
      if (this.disabledPkeys.indexOf(pky) !== -1) {
        continue;
      } else {
        let index = this.selectionPkeys.indexOf(pky);
        if (status) {
          if (index === -1 && this.preselect(row, true, 'all')) {
            this.selectionPkeys.push(pky);
            this.selections.push(row);
          }
        } else {
          if (index !== -1 && this.preselect(row, false, 'all')) {
            this.selectionPkeys.splice(index, 1);
            this.selections.splice(index, 1);
          }
        }
        this.$emit('on-selection-change', this.selections);
      }
    }
    this.$emit('on-select-all', this.selections, status);
  }
  clearSelection() {
    let unpasspkeys: any[] = [];
    let unpassselections: any[] = [];
    for (let i = 0; i < this.selections.length; i++) {
      let data = this.selections[i];
      if (!this.preselect(data, false, 'all')) {
        let pky = this.getPkey(data, this.pkey);
        unpasspkeys.push(pky);
        unpassselections.push(data);
      }
    }
    this.selectionPkeys = unpasspkeys;
    this.selections = unpassselections;
    this.$emit('on-selection-change', this.selections);
  }
}
</script>
<style lang="less">
@import './style/index.less';
</style>