<template>
  <div v-clickoutside="handleClickout">
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
    >
      <div slot="poper" class="xbf-rangepopbox">
        <a-Input-number
          v-model="start"
          name="min"
          :min="minMin"
          :max="max"
          :fixed="fixed"
          :required="!start && visible"
          class="xbf-numberinput"
        />
        <span class="xbf-numpadDash">-</span>
        <a-Input-number
          v-model="end"
          :max="maxMax"
          name="max"
          :min="min"
          :fixed="fixed"
          :required="!end && visible"
          class="xbf-numberinput"
        />
        <a-tooltip
          mistake
          :content="!start ? '请输入最小值' : '请输入最大值'"
          placement="bottom"
          :show="(start === '' || end === '') && visible"
        >
          <a-button type="primary" size="small" class="xbf-confirmbtn" @click="confirm(item)">确定</a-button>
        </a-tooltip>
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
            type="caret-down"
            :class="{'xbui-ani-down':true,'xbui-ani-up':item.show}"
            @click.stop="handleClick(item)"
          />
          <a-Icon v-if="item.son" type="link" class="xbf-lintdash" />
          <span v-else class="xbf-splitdash">|</span>
        </span>
      </div>
    </Xb-hoverlist>
  </div>
</template>

<script lang="ts">
import clickoutside from './../../../directives/clickoutside';
import XbHoverlist from './xbhoverlist.vue';
import Meta from './../utils/mixins';
import { Component, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'Numberrange',
  components: {
    XbHoverlist,
  },
  directives: {
    clickoutside,
  },
  mixins: [Meta],
})
export default class Numberrange extends Meta {
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

  get max() {
    return Math.max(this.maxMax, Number(this.end));
  }
  get min() {
    return Math.min(this.minMin, Number(this.start));
  }
  get maxMax() {
    let range = this.item.range || [];
    return range.length === 2 ? range[1] : 9999999.99;
  }
  get minMin() {
    let range = this.item.range || [];
    return range.length === 2 ? range[0] : -9999999.99;
  }
  get fixed() {
    return this.item.fixed === undefined ? 2 : this.item.fixed;
  }
  @Watch('item.show')
  itemShowChange(val: any) {
    if (val && !this.item.selectedArr.length) {
      this.start = '';
      this.end = '';
    }
  }
  mounted() {
    if (this.item.selectedArr.length) {
      this.start = this.item.selectedArr[0];
      this.end = this.item.selectedArr[1];
    }
  }
  handleClickout() {
    this.visible = false;
    if (this.item.selectedArr.length !== 2) {
      this.start = '';
      this.end = '';
    }
    this.dropdata.show = false;
  }
  /** 第一次点击时请求数据 */
  handleClick(item: any) {
    if (this.ifdisabled(item, this.parentdata)) {
      return;
    }
    item.show = !item.show;
  }
  confirm(item: any) {
    if (this.start !== '' && this.end !== '' && this.start !== null && this.end !== null) {
      item.show = false;
      this.item.selectedArr = [this.start, this.end];
      this.$parent.selectedLen++;
      this.itemObj = { key: item.key, label: item.label };
      this.$emit('datechange');
    } else {
      let err1 = `XBUI:筛选组件 请输入${this.start ? '最大值' : '最小值'}`;
      console.warn(err1);
      this.$parent.handleError(err1);
      this.visible = true;
    }
  }
}
</script>

<style></style>
