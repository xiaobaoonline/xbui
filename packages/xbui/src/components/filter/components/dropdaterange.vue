<template>
  <a-range-picker
    v-if="checkIfShow(item, parentdata)"
    v-show="item.display"
    v-model="date"
    :get-calendar-container="getPopupContainer"
    :disabled="ifdisabled(item, parentdata)"
    :default-value="currentdate"
    :show-time="item.type == 'daterangetime'"
    :format="format"
    :ranges="shortcuts"
    :disabled-date="disabledDate"
    @change="handleChange"
    @openChange="handleOpen"
    @ok="handleOk"
  >
    <a>
      <span :class="['xbf-filtertitle', ifdisabled(item, parentdata) ? 'disabled' : '']">
        {{ item.label }}
        <a-icon type="caret-down" :class="{'xbui-ani-down':true,'xbui-ani-up':item.show}" />
        <span class="xbf-splitdash">|</span>
      </span>
    </a>
  </a-range-picker>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Watch, Inject } from 'vue-property-decorator';
import Meta from './../utils/mixins';
/** 面板展开时间 */
let startTime = 0;
@Component({
  name: 'Dropdaterange',
  mixins: [Meta],
})
export default class Dropdaterange extends Meta {
  $parent: any;
  @Inject({ default: false }) track!: boolean;

  currentdate: any = [];
  date: any = [];

  get isOpen() {
    return this.dropdata.show;
  }
  get format() {
    return this.dropdata.format || 'YYYY-MM-DD';
  }
  get shortcuts() {
    let shorts = this.dropdata.options ? this.dropdata.options.shortcuts : {};
    if (Array.isArray(shorts)) {
      let obj: any = {};
      shorts.forEach((item: any) => {
        obj[item.text] = item.value();
      });
      return obj;
    } else {
      return shorts;
    }
  }
  get disabledDate() {
    return this.dropdata.options ? this.dropdata.options.disabledDate : undefined;
  }
  @Watch('currentdate')
  currentdateChange(val: any, val2: any) {
    if (val.length && val[0]) {
      this.checkMaxDate();
      this.item.dateval = [moment(val[0]).format(this.format), moment(val[1]).format(this.format)];
      this.$parent.selectedLen++;
      this.$emit('datechange');
      this.getDuration();
    }
    // deep: true,
  }
  @Watch('isOpen')
  isOpenChang(val: any) {
    if (val) {
      startTime = new Date().getTime();
    }
  }
  @Watch('item.dateval')
  datevalueChange(val: any) {
    if (!val.length) {
      this.currentdate = [];
    }
  }
  mounted() {
    this.currentdate = this.item.dateval.length ? this.item.dateval.map((a: any) => moment(a)) : [];
  }
  getPopupContainer(trigger: any) {
    return trigger.parentNode;
  }
  checkMaxDate() {
    let unit = this.item.unit || 'days';
    let lastdate = new Date(this.currentdate[1]).getTime();
    let maxdate: any = new Date(
      moment(this.currentdate[0])
        .add(this.item.maxSpan, unit)
        .toString(),
    ).getTime();
    if (lastdate > maxdate && this.item.maxSpan) {
      let err1 = 'XBUI:筛选组件 超过时间段最大限制，已重置为最大值';
      console.warn(err1);
      this.$parent.handleError(err1);
      let date = moment(maxdate);
      this.$parent.uimodel[this.item.key].dateval[1] = date;
      this.currentdate[1] = date;
    }
  }
  changePick() {
    // console.log(this.currentdate)
  }
  handleChange(val: any) {
    if (this.item.type == 'daterangetime') {
      // 带时间时  点击确认时才调用回调参数
      return;
    }
    // val.show = null
    this.dropdata.show = false;
    this.currentdate = val;
  }

  handleOk(val: any) {
    this.currentdate = val;
  }
  handleOpen(val: any) {
    if (val) {
      this.date = this.currentdate ? this.currentdate : [];
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
