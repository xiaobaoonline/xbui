<template>
  <a-date-picker
    v-if="checkIfShow(item, parentdata)"
    v-show="item.display"
    v-model="date"
    :get-calendar-container="getPopupContainer"
    :default-value="currentdate"
    :disabled="ifdisabled(item, parentdata)"
    :show-time="item.type == 'datetime'"
    :format="format"
    :show-today="false"
    :disabled-date="disabledDate"
    @change="handleChange"
    @openChange="handleOpen"
    @ok="handleOk"
  >
    <span class="xbf-filtertitle" type="text">
      {{ item.label }}
      <a-Icon type="caret-down" :class="{'xbui-ani-down':true,'xbui-ani-up':item.show}" />
      <span class="xbf-splitdash">|</span>
    </span>
  </a-date-picker>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Watch, Inject } from 'vue-property-decorator';

import Meta from './../utils/mixins';
/** 面板展开时间 */
let startTime = 0;
@Component({
  name: 'Dropdate',
  mixins: [Meta],
})
export default class Dropdate extends Meta {
  // inject: {
  //   track: { default: false },
  // },
  $parent: any;
  @Inject({ default: false }) track!: boolean;

  currentdate: any = null;
  date: any = null;

  get format() {
    return this.dropdata.format || 'YYYY-MM-DD';
  }
  get disabledDate() {
    return this.dropdata.options ? this.dropdata.options.disabledDate : undefined;
  }
  @Watch('currentdate')
  currentdateChange(val: any, val2: any) {
    if (!val) {
      return;
    }
    this.item.datevalue = moment(val).format(this.format);
    this.$parent.selectedLen++;
    this.$emit('datechange');
    this.getDuration();
  }
  @Watch('item.datevalue')
  datevalueChange(val: any) {
    if (!val) {
      this.date = undefined;
      this.currentdate = undefined;
    }
  }
  mounted() {
    this.currentdate = this.item.datevalue ? moment(this.item.datevalue) : undefined;
  }

  getPopupContainer(trigger: any) {
    return trigger.parentNode;
  }
  handleChange(val: any) {
    if (this.item.type == 'datetime') {
      // 带时间时  点击确认时才调用回调参数
      return;
    }
    this.currentdate = val;
  }
  handleOk(val: any) {
    this.currentdate = val;
  }
  handleOpen(val: any) {
    if (val) {
      this.date = this.currentdate ? moment(this.currentdate) : undefined;
    }
  }
  getDuration() {
    if (startTime && this.track) {
      // let duration = (new Date().getTime() - startTime) / 1000;
      // eventEmitter.emit('getSelectDuration', {
      //   key: this.dropdata.key,
      //   label: this.dropdata.label,
      //   duration
      // })
      startTime = 0;
    }
  }
}
</script>

<style lang="less"></style>
