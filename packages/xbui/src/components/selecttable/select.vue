<template>
  <div :class="classes">
    <a-dropdown
      ref="dropdown"
      :trigger="['click']"
      :visible="visible"
      :placement="placement"
      :data-transfer="false"
      :disabled="disabled"
      :get-popup-container="getPopupContainer"
      @visibleChange="handleChange"
    >
      <div>
        <slot name="header"></slot>
        <div ref="reference" :class="selectionCls" :style="wrapStyle">
          <slot name="input">
            <template v-if="multiple">
              <a-tag
                v-for="(item, index) in selectedOption"
                :key="index"
                closable
                @close.prevent="removeTag(index)"
              >{{ item[labelKey] }}</a-tag>
            </template>
            <span
              v-show="showPlaceholder && !filterable"
              :class="[prefixCls + '-placeholder']"
            >{{ placeholder }}</span>
            <span
              v-show="!showPlaceholder && !multiple && !filterable"
              :class="[prefixCls + '-selected-value']"
            >{{ selectedSingle[labelKey] }}</span>
            <input
              v-if="filterable"
              ref="input"
              v-model="query"
              type="text"
              :disabled="disabled"
              :class="[prefixCls + '-input']"
              :style="inputStyle"
              :placeholder="showPlaceholder ? placeholder : ''"
              @input="doSearch"
              @keydown="resetInputState"
              @keydown.delete="handleInputDelete"
            />

            <a-icon
              v-show="showCloseIcon"
              :class="[prefixCls + '-arrow']"
              type="close"
              @click.stop="clearSingleSelect"
            />
            <a-icon :class="[prefixCls + '-arrow']" type="caret-down" />
          </slot>
        </div>
      </div>
      <div v-show="dropVisible" slot="overlay" :style="tableStyle">
        <xb-light-table
          ref="lightTable"
          class="xbui-select-dropdown"
          :data="dataList"
          :preselect="preselect"
          :max-height="maxHeight"
          trigger-type="row"
          :pkey="valueKey"
          :selected-item="selectedItem"
          :disabled-item="disabledItem"
          :loading="loading"
          :border="false"
          @on-load-more="loadMore"
          @on-selection-change="getSelectedItem"
        >
          <xb-table-column :type="multiple?'selection':'radio'"></xb-table-column>
          <slot></slot>
          <template slot="emptyData">
            <slot name="emptyData"></slot>
          </template>
        </xb-light-table>
        <slot name="footer"></slot>
      </div>
    </a-dropdown>
  </div>
</template>
<script lang="ts">
import XbLightTable from '../lighttable/table.vue';
import xbTableColumn from '../lighttable/table-column';
import clickoutside from '../../directives/clickoutside';
import { oneOf } from '../../utils/utils';
import Emitter from '../../mixins/emitter';
// import Locale from '../../mixins/locale';

const prefixCls = 'xbui-table-select';

import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'XbSelectTable',
  components: {
    XbLightTable,
    xbTableColumn,
  },
  directives: { clickoutside },
})
export default class XbSelectTable extends Emitter {
  $refs!: {
    input: any;
    lightTable: any;
  };
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  dataList!: any[];

  @Prop({
    type: Boolean,
    default: false,
  })
  filterable!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  loading!: boolean;

  @Prop({
    type: String,
    default: 'left',
  })
  align!: string;

  @Prop({
    type: Number,
    default: 200,
  })
  maxHeight!: number;

  @Prop({
    type: String,
    default: 'id',
  })
  valueKey!: string;

  @Prop({
    type: String,
    default: 'name',
  })
  labelKey!: string;

  @Prop({
    type: Number,
    default: 200,
  })
  selectWidth!: number;
  @Prop({
    type: Number,
    default: 200,
  })
  tableWidth!: number;

  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  selectedItem!: any[];

  //禁止选中项
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
  preselect!: () => void;

  @Prop({
    type: Boolean,
    default: false,
  })
  multiple!: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  disabled!: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  clearable!: boolean;

  @Prop({
    type: String,
    default: '请选择',
  })
  placeholder!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  autohide!: boolean;

  @Prop({
    type: Function,
  })
  remoteMethod!: (...arg: any) => void;

  @Prop({
    validator(value) {
      return oneOf(value, ['topLeft', 'bottomLeft']);
    },
    default: 'bottomLeft',
  })
  placement!: 'topLeft' | 'bottomLeft';

  @Prop({
    type: String,
  })
  name!: string;

  prefixCls: string = prefixCls;
  visible: boolean = false;
  selectedOption: any[] = [];
  selectedSingle: any = {};
  query: string = '';
  inputLength: number = 20;

  get classes() {
    return [
      `${prefixCls}`,
      {
        [`${prefixCls}-visible`]: this.visible,
        [`${prefixCls}-disabled`]: this.disabled,
        [`${prefixCls}-multiple`]: this.multiple,
        [`${prefixCls}-single`]: !this.multiple,
        [`${prefixCls}-show-clear`]: this.showCloseIcon,
      },
    ];
  }
  get showCloseIcon() {
    return !this.multiple && this.clearable && this.query;
  }
  get selectionCls() {
    return {
      [`${prefixCls}-selection`]: true,
    };
  }
  get showPlaceholder() {
    return !this.selectedOption.length && !this.query;
  }
  get inputStyle() {
    let style: any = {};
    if (this.multiple) {
      if (this.showPlaceholder) {
        style.width = '100%';
      } else {
        style.width = `${this.inputLength}px`;
      }
    }
    return style;
  }
  get wrapStyle() {
    let style: any = {};
    style.width = `${this.selectWidth}px`;
    return style;
  }
  get tableStyle() {
    let style: any = {};
    style.width = `${this.tableWidth}px`;
    if (this.align === 'center') {
      style.left = '50%';
      // style.marginLeft = `-${this.tableWidth / 2}px`;
    }
    return style;
  }
  get transitionName() {
    return this.placement === 'bottomLeft' ? 'slide-up' : 'slide-down';
  }
  get dropVisible() {
    return this.visible;
  }
  @Watch('selectedItem')
  selectedItemWatch() {
    this.setDefaultSelectItem();
  }
  @Watch('disabled')
  disabledWatch() {
    this.visible = false;
  }
  //   @Watch('label')
  //   labelWatch(val: any) {
  //     this.currentLabel = val;
  //     this.updateLabel();
  //   }
  @Watch('visible')
  visibleWatch(val: any) {
    if (val) {
      if (this.filterable && this.$refs.input) {
        this.$refs.input.focus();
      }
    } else {
      if (this.filterable && this.$refs.input) {
        this.$refs.input.blur();
      }
    }

    setTimeout(() => {
      if (this.$refs.lightTable) {
        this.$refs.lightTable.doLayout();
      }
    }, 50);
    this.$emit('on-open-change', val);
  }

  mounted() {
    this.setDefaultSelectItem();
  }

  setDefaultSelectItem() {
    if (!this.selectedItem.length) {
      return;
    }
    this.selectedOption = this.selectedItem;
    if (!this.multiple) {
      this.selectedSingle = this.selectedItem[0];
      this.query = this.selectedSingle[this.labelKey];
    }
  }
  toggleMenu() {
    if (this.disabled) {
      return false;
    }
    if (!this.visible) {
      this.visible = true;
    } else {
      if (this.filterable) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    }
  }
  handleChange(show: boolean) {
    console.log(123, show);
    this.visible = show;
  }
  handleToggle() {
    if (this.disabled) {
      return false;
    }
    this.visible = !this.visible;
  }
  clearSingleSelect() {
    if (this.disabled) {
      return false;
    }
    if (this.selectedOption.length && this.$refs.lightTable) {
      this.$refs.lightTable.toggleSelect(this.selectedSingle, 'checkbox');
    }
  }
  removeTag(index: number, event?: any) {
    event && event.preventDefault();
    if (this.disabled) {
      return false;
    }
    if (this.$refs.lightTable) {
      this.$refs.lightTable.toggleSelect(this.selectedOption[index], 'checkbox');
    }

    if (this.filterable && this.visible) {
      this.$refs.input.focus();
    }
  }
  hideMenu() {
    this.visible = false;
    this.query = '';
    if (this.selectedSingle) {
      this.query = this.selectedSingle[this.labelKey];
    }
  }

  getPopupContainer(trigger: any) {
    return trigger.parentNode;
  }

  handleClose() {
    this.hideMenu();
  }
  doSearch(event: any) {
    let value = event.target.value;
    if (this.remoteMethod) {
      this.remoteMethod(value, this);
    }
  }
  resetInputState() {
    this.inputLength = this.$refs.input.value.length * 12 + 20;
  }
  handleInputDelete() {
    if (this.multiple && this.selectedOption.length && this.query === '') {
      this.removeTag(this.selectedOption.length - 1);
    }
  }
  getSelectedItem(data: any) {
    this.selectedOption = data;
    this.query = '';
    if (!this.multiple) {
      if (data.length) {
        this.selectedSingle = data[0];
        this.query = this.selectedSingle[this.labelKey];
        if (this.autohide) {
          this.visible = false;
        }
      } else {
        this.selectedSingle = {};
      }
    }
    this.$emit('on-change', this.selectedOption);
  }
  loadMore() {
    this.$emit('on-load-more');
  }
  clear() {
    if (this.$refs.lightTable) {
      this.$refs.lightTable.clearSelection();
    }
  }
}
</script>
<style lang="less">
@import './style/index.less';
</style>
