<template>
  <div>
    <Xb-hoverlist
      v-show="item.display"
      trigger="click"
      custom-class="filterdrop"
      placement="bottom"
      :top="0"
      :show="item.show"
      :disabled="ifdisabled(item, parentdata)"
      :duration="3"
      :item-obj="itemObj"
      @input="handleShow"
    >
      <div slot="poper" class="xbf-rangepopbox">
        <a-Select
          v-model="start"
          style="min-width:80px;"
          :get-popup-container="getPopupContainer"
          @change="ChangeMin"
        >
          <a-select-option
            v-for="(li, index) in item.list"
            :key="index"
            :value="li.value"
          >{{ li.label }}</a-select-option>
        </a-Select>

        <span class="xbf-numpadDash">-</span>
        <a-Select
          v-model="end"
          style="min-width:80px;"
          :get-popup-container="getPopupContainer"
          @change="ChangeMax"
        >
          <a-select-option
            v-for="(li, index) in item.list"
            :key="index"
            :value="li.value"
          >{{ li.label }}</a-select-option>
        </a-Select>
        <a-button type="primary" size="small" class="xbf-confirmbtn" @click="confirm(item)">确定</a-button>
      </div>
      <div slot="hover">
        <span
          v-if="checkIfShow(item, parentdata)"
          :class="['xbf-filtertitle', ifdisabled(item, parentdata) ? 'disabled' : '']"
          type="text"
          @click="handleClick(item)"
        >
          {{ item.label }}
          <a-Icon
            :class="{'xbui-ani-down':true,'xbui-ani-up':item.show}"
            type="caret-down"
            @click.stop="handleClick(item)"
          />
        </span>
        <a-Icon v-if="item.son" type="link" class="xbf-lintdash" />
        <span v-else class="xbf-splitdash">|</span>
      </div>
    </Xb-hoverlist>
  </div>
</template>

<script lang="ts">
// import { throttle, debounce } from '../../utils/throttle.js';
import { Component, Prop, Watch } from 'vue-property-decorator';
import XbHoverlist from './xbhoverlist.vue';
import Meta from './../utils/mixins';
@Component({
  components: {
    XbHoverlist,
  },
  name: 'Selectrange',
  // mixins: [Meta],
})
export default class Selectrange extends Meta {
  $parent: any;
  @Prop({
    default() {
      return {};
    },
  })
  dropdata!: any;

  start: string = '';
  end: string = '';
  visible: boolean = false;
  itemObj: any = {};

  // watch: {
  //   'item.selectedArr': {
  //     handler() {
  //       if (!this.item.selectedArr.length) {
  //         this.start = '';
  //         this.end = '';
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  @Watch('item.selectedArr')
  selectedArrChange(val: any) {
    if (!this.item.selectedArr.length) {
      this.start = '';
      this.end = '';
    }
    // deep: true,
  }

  mounted() {
    if (this.item.selectedArr.length) {
      this.start = this.item.selectedArr[0];
      this.end = this.item.selectedArr[1];
      this.confirm(this.item);
    }
  }
  handleShow(val: any) {
    if (!val) {
      this.item.show = false;
    }
  }
  getPopupContainer(trigger: any) {
    return trigger.parentNode;
  }
  ChangeMin() {
    if (!this.end) {
      return;
    }
    if (this.end <= this.start) {
      this.end = this.start;
    }
  }
  ChangeMax() {
    if (!this.start) {
      return;
    }
    if (this.end <= this.start) {
      this.start = this.end;
    }
  }
  /** 第一次点击时请求数据 */
  handleClick(item: any) {
    if (this.ifdisabled(item, this.parentdata)) {
      return;
    }
    if (!item.show) {
      if (!this.item.selectedArr.length) {
        this.start = '';
        this.end = '';
      }
    }
    item.show = !item.show;
  }
  getLabel() {
    let start = '',
      end = '';
    this.item.list.map((item: any) => {
      if (item.value === this.start) {
        start = item.label;
      }
      if (item.value === this.end) {
        end = item.label;
      }
    });
    return {
      start,
      end,
    };
  }
  confirm(item: any) {
    if (this.start && this.end) {
      item.show = false;
      this.item.selectedArr = [this.start, this.end];
      this.item.selectedObj = this.getLabel();
      this.$parent.selectedLen++;
      this.itemObj = { key: item.key, label: item.label };
      this.$emit('datechange');
    } else {
      this.visible = true;
      // this.$message.info("This is a normal message");
      let err1 = 'XBUI:筛选组件 请选择下拉条件';
      console.warn(err1);
      this.$parent.handleError(err1);
    }
  }
}
</script>

<style></style>
