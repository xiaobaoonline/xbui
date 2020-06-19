<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
    <colgroup>
      <col
        v-for="(column, index) in columns"
        v-show="column.show"
        :key="index"
        :width="setCellWidth(column)"
      />
    </colgroup>
    <thead>
      <tr>
        <th
          v-for="(column, index) in columns"
          v-show="column.show"
          :key="index"
          :class="alignCls(column,true)"
          :style="thStyle(column)"
          @mousemove="handleMouseMove($event,column)"
          @mousedown="handleMouseDown($event,column)"
          @mouseout="handleMouseOut"
        >
          <div :class="cellClasses(column)">
            <template v-if="column.type === 'expand'">
              <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
              <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
            </template>
            <template v-else-if="column.type === 'selection'">
              <label
                class="ant-checkbox-wrapper"
                :class="isSelectAll?'ant-checkbox-wrapper-checked':''"
              >
                <span class="ant-checkbox" :class="isSelectAll?'ant-checkbox-checked':''">
                  <span class="ant-checkbox-inner"></span>
                  <input type="checkbox" class="ant-checkbox-input" @click="selectAll" />
                </span>
              </label>
              <!-- <Checkbox :value="isSelectAll" @on-change="selectAll"></Checkbox> -->
            </template>
            <template v-else>
              <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
              <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
              <span v-if="column.tipContent" :class="[prefixCls+'-head-tip']">
                <a-Tooltip
                  :placement="column.tipPlacement?column.tipPlacement:'top'"
                  transfer
                  :max-width="200"
                >
                  <template slot="title">{{column.tipContent}}</template>
                  <a-Icon class="question-icon1" theme="outlined" type="question-circle" size="20"></a-Icon>
                  <a-Icon class="question-icon2" theme="filled" type="question-circle" size="20"></a-Icon>
                </a-Tooltip>
              </span>
              <span
                v-if="column.sortable"
                :class="[prefixCls + '-sort']"
                @click="handleSort($event,index)"
              >
                <a-icon
                  type="caret-up"
                  :class="{on: orderParam.sortKey === column.key && orderParam.sortOrder === 'asc'}"
                ></a-icon>
                <a-icon
                  type="caret-down"
                  :class="{on: orderParam.sortKey === column.key && orderParam.sortOrder === 'desc'}"
                ></a-icon>
              </span>
            </template>
          </div>
        </th>
      </tr>
    </thead>
  </table>
</template>
<script lang="ts">
import renderHeader from './header';
import Mixin from './mixin';

import { Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'TableHead',
  components: { renderHeader },
})
export default class TableHead extends Mixin {
  @Prop({ type: Object })
  styleObject!: any;
  @Prop({ type: Array })
  columns!: any[];
  @Prop({ type: Array })
  data!: any[]; // rebuildData
  @Prop({ type: Object })
  columnsWidth!: any;

  $parent: any;
  dragState: any = {};
  ondrag: boolean = false;
  dragcolumn: any = null;

  get orderParam() {
    return {
      sortKey: this.$parent.sortKey,
      sortOrder: this.$parent.sortOrder,
    };
  }
  get isSelectAll() {
    let isSelectAll = true;
    if (!this.data.length) isSelectAll = false;
    for (let i = 0; i < this.data.length; i++) {
      if (this.$parent.selectionPkeys.indexOf(this.data[i]._pkey) == -1 && !this.data[i]._disabled) {
        isSelectAll = false;
        break;
      }
    }
    return isSelectAll;
  }

  handleMouseDown(event: any, column: any) {
    if (!this.$parent.resizeable || this.$parent.modal || !column.dragable) return;
    if (this.dragcolumn) {
      const table = this.$parent;
      const tableEl = table.$refs.mainTable;
      const tableLeft = tableEl.getBoundingClientRect().left;
      const columnEl = event.target;
      const columnRect = columnEl.getBoundingClientRect();
      const minLeft = columnRect.left - tableLeft + column.minWidth;

      this.ondrag = true;
      table.resizetag = true;
      this.dragState = {
        startMouseLeft: event.pageX,
        startLeft: columnRect.right - tableLeft,
        startColumnLeft: columnRect.left - tableLeft,
        tableLeft,
      };
      document.onselectstart = function() {
        return false;
      };
      document.ondragstart = function() {
        return false;
      };
      const resizeProxy = table.$refs.resizeline;
      const resizeProxy2 = table.$refs.resizeline2;
      resizeProxy.style.left = this.dragState.startLeft + 'px';
      resizeProxy2.style.left = this.dragState.startLeft + 'px';

      let that = this;
      let onMouseUp = (event2: any) => {
        if (that.ondrag) {
          table.resizetag = false;
          that.ondrag = false;
          document.body.style.cursor = '';
          that.dragcolumn = null;
          let width = event2.pageX - that.dragState.startMouseLeft + column.realWidth;
          column.width = column.realWidth = width < column.minWidth ? column.minWidth : width;
          table.doLayout();
          table.saveColumnWidth(column);
        }
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.onselectstart = null;
        document.ondragstart = null;
      };
      let onMouseMove = (event2: any) => {
        if (that.dragcolumn) {
          let left = Math.max(minLeft, event2.pageX - that.dragState.startMouseLeft + that.dragState.startLeft) + 'px';
          resizeProxy.style.left = left;
          resizeProxy2.style.left = left;
        }
      };
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    }
  }
  handleMouseMove(event: any, column: any) {
    if (!this.$parent.resizeable || this.$parent.modal || !column.dragable) return;
    if (!this.ondrag) {
      let target = event.target;
      while (target && target.tagName !== 'TH') {
        target = target.parentNode;
      }
      let rect = target.getBoundingClientRect();
      let bodyStyle = document.body.style;
      if (rect.width >= column.minWidth && rect.right - event.pageX < 10) {
        bodyStyle.cursor = 'col-resize';
        // bodyStyle.cursor = 'url("http://cdn.schoolpal.cn/schoolpal/resource/ci/schoolpal-protest/preview/common/crm-images/crm-consult-arrow2.png"),auto';
        this.dragcolumn = column;
      } else if (!this.ondrag) {
        bodyStyle.cursor = '';
        this.dragcolumn = null;
      }
    }
  }
  handleMouseOut() {
    const bodyStyle = document.body.style;
    bodyStyle.cursor = '';
  }
  cellClasses(column: any) {
    return [
      `${this.prefixCls}-cell`,
      {
        [`${this.prefixCls}-hidden`]:
          !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'),
      },
    ];
  }
  thStyle(column: any) {
    let style: any = {};
    if (column.type === 'selection') {
      style.textAlign = 'left';
    }
    return style;
  }
  selectAll() {
    const status = !this.isSelectAll;
    this.$parent.selectAll(status);
  }
  handleSort(event: any, index: any, type: any) {
    event.stopPropagation();
    if (type) {
      this.$parent.handleSort(index, type);
    } else {
      const column = this.columns[index];
      if (column.sortable) {
        if (this.orderParam.sortKey === column.key) {
          let sortBy = this.orderParam.sortOrder === 'asc' ? 'desc' : 'asc';
          this.$parent.handleSort(index, sortBy);
        } else {
          this.$parent.handleSort(index, 'desc');
        }
      }
    }
  }
}
</script>
